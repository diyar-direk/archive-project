import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { baseURL, Context } from "../../context/context";
import Table from "./../../components/table/Table";
import useLanguage from "../../hooks/useLanguage";
import { Link } from "react-router-dom";
import InormationTableFilters from "./InormationTableFilters";
import { nextJoin } from "./../../utils/obejctJoin";
import { dateFormatter } from "../../utils/dateFormatter";
const columns = [
  {
    name: "subject",
    headerName: "subject",
    sort: true,
  },
  {
    name: "details",
    headerName: "details",
    sort: true,
    className: "name",
    getCell: (e) => (
      <Link to={`${e._id}`} className="name">
        {e.details}
      </Link>
    ),
  },
  {
    name: "note",
    headerName: "note",
    hidden: true,
    sort: true,
  },
  { name: "credibility", headerName: "credibility" },
  {
    name: "countryId",
    headerName: "country",
    getCell: (e) => e.countryId?.name,
  },
  {
    name: "countyId",
    headerName: "county",
    getCell: (e) => e.countyId?.name,
  },
  {
    name: "governorateId",
    headerName: "governorate",
    hidden: true,
    getCell: (e) => e.governorateId?.name,
  },
  {
    name: "cityId",
    headerName: "city",
    getCell: (e) => e.cityId?.name,
    hidden: true,
  },
  {
    name: "streetId",
    headerName: "street",
    getCell: (e) => e.streetId?.name,
    hidden: true,
  },
  {
    name: "regionId",
    headerName: "region",
    getCell: (e) => e.regionId?.name,
    hidden: true,
  },
  {
    name: "villageId",
    headerName: "village",
    getCell: (e) => e.villageId?.name,
    hidden: true,
  },

  {
    name: "addressDetails",
    headerName: "addressDetails",
  },
  {
    name: "people",
    headerName: "people",
    getCell: (e) =>
      e.people?.map((person, i) => {
        const arr = [];
        if (i < 3)
          arr.push(
            <Link className="name" key={i} to={`/people/${person._id}`}>
              {e.people[i + 1]
                ? `${person.firstName} ${person.surName} , `
                : `${person.firstName} ${person.surName}`}
            </Link>
          );
        else if (i === 3) arr.push(<span key={i}>...</span>);
        return arr;
      }),
  },
  {
    name: "section",
    headerName: "section",
    getCell: (e) => e.sectionId?.name,
    onlyAdminCanSee: true,
  },
  {
    name: "source",
    headerName: "source",
    getCell: (e) => nextJoin(e.sources, "source_name"),
  },
  {
    name: "parties",
    headerName: "parties",
    getCell: (e) => nextJoin(e.parties, "name"),
    hidden: true,
  },
  {
    name: "events",
    headerName: "events",
    getCell: (e) => nextJoin(e.events, "name"),
    hidden: true,
  },

  {
    name: "createdAt",
    headerName: "createdAt",
    sort: true,
    getCell: (row) => dateFormatter(row.createdAt),
  },
  {
    name: "updatedAt",
    headerName: "updatedAt",
    sort: true,
    getCell: (row) => dateFormatter(row.updatedAt),
    hidden: true,
  },
  {
    name: "options",
    headerName: "options",
    type: "actions",
    getCell: (e, setOverlay, setSelectedItems, role) => (
      <>
        <div className="options center">
          {role && (
            <>
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  setOverlay(true);
                  const allSelectors = document.querySelectorAll(".checkbox");
                  allSelectors.forEach((el) => el.classList.remove("active"));
                  setSelectedItems([e._id]);
                }}
                className="flex delete"
              >
                <i className="fa-solid fa-trash"></i>
              </div>
              <Link to={`/update_info/${e._id}`} className="flex update">
                <i className="fa-regular fa-pen-to-square"></i>
              </Link>
            </>
          )}
          <Link to={`${e._id}`} className="flex visit">
            <i className="fa-solid fa-circle-user"></i>
          </Link>
        </div>
      </>
    ),
  },
];
const Informations = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allData = useRef([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const limit = context?.limit;
  const { language } = useLanguage();
  const [sort, setSort] = useState({});
  const { role } = context.userDetails;
  const [openFiltersDiv, setOpenFiltersDiv] = useState(false);
  const [filters, setFilters] = useState({
    countryId: "",
    cityId: "",
    villageId: "",
    regionId: "",
    streetId: "",
    sources: "",
    countyId: "",
    governorateId: "",
    people: "",
    parties: "",
    events: "",
    sectionId: "",
    date: {
      from: "",
      to: "",
    },
  });
  const [search, setSearch] = useState("");

  const getData = useCallback(async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    const params = new URLSearchParams();
    params.append("active", true);
    params.append("limit", limit);
    params.append("page", page);
    if (context.userDetails.role === "user") {
      params.append("sectionId", context.userDetails.sectionId);
    }
    Object.keys(filters).forEach((key) => {
      if (key !== "date" && filters[key]) {
        params.append(key, filters[key]._id || filters[key]);
      }
    });
    if (filters.date.from) params.append("createdAt[gte]", filters.date.from);
    if (filters.date.to) params.append("createdAt[lte]", filters.date.to);
    if (Object.keys(sort).length) {
      const sortParams = Object.values(sort)
        .map((v) => v)
        .join(",");
      params.append("sort", sortParams);
    }
    if (search) params.append("search", search);
    try {
      const { data } = await axios.get(`${baseURL}/Information`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      dataLength.current =
        data[search ? "numberOfActiveResults" : "numberOfActiveInformations"];
      allData.current = data[search ? "data" : "informations"]?.map(
        (e) => e._id
      );
      setData(data[search ? "data" : "informations"]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, filters, search, limit, sort]);
  useEffect(() => {
    if (!search) getData();
    else {
      const timeOut = setTimeout(() => getData(), 500);
      return () => clearTimeout(timeOut);
    }
  }, [page, filters, search, limit, sort, getData]);

  return (
    <>
      <h1 className="title">{language?.header?.information}</h1>
      {openFiltersDiv && (
        <InormationTableFilters
          setFilter={setFilters}
          filter={filters}
          setIsopen={setOpenFiltersDiv}
          setPage={setPage}
        />
      )}
      <Table
        addPageUrl="add_information"
        columns={columns}
        selectable={role === "admin"}
        loading={loading}
        currentPage={page}
        setPage={setPage}
        allData={allData.current}
        selectedItems={slectedItems}
        setSelectedItems={setSelectedItems}
        getData={getData}
        deleteUrl="Informations"
        dataLength={dataLength.current}
        tabelData={data}
        setSort={setSort}
        search={search}
        setSearch={setSearch}
        openFiltersDiv={openFiltersDiv}
        setOpenFiltersDiv={setOpenFiltersDiv}
      />
    </>
  );
};

export default Informations;
