import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { baseURL, Context, date } from "../../context/context";
import Table from "./../../components/table/Table";
import { Link } from "react-router-dom";
import "./profile.css";
import MediaComponent from "../../components/MediaComponent";
import useLanguage from "../../hooks/useLanguage";
import TabelFilters from "./TabelFilters";

const columns = [
  {
    name: "image",
    headerName: "profile",
    getCell: (e) => (
      <Link to={`/dashboard/people/${e._id}`} className="center">
        {e.image ? (
          <MediaComponent
            className="photo"
            src={e.image}
            type="image"
            showUserIcon
          />
        ) : (
          <i className="photo fa-solid fa-user"></i>
        )}
      </Link>
    ),
  },
  {
    name: "firstName",
    headerName: "name",
    className: "name",
    sort: true,
    getCell: (row) => (
      <Link to={`/dashboard/people/${row._id}`} className="name">
        {row.firstName} {row.fatherName} {row.surName}
      </Link>
    ),
  },
  { name: "gender", headerName: "gender" },
  { name: "motherName", headerName: "motherName" },
  { name: "maritalStatus", headerName: "maritalStatus" },
  { name: "occupation", headerName: "occupation", sort: true },
  {
    name: "birthDate",
    headerName: "birthDate",
    getCell: (e) => date(e.birthDate),
  },
  {
    name: "placeOfBirth",
    headerName: "placeOfBirth",
  },
  {
    name: "country",
    headerName: "country",
    getCell: (e) => e.countryId?.name,
  },
  {
    name: "county",
    headerName: "county",
    getCell: (e) => e.countyId?.name,
  },
  {
    name: "governorate",
    headerName: "governorate",
    getCell: (e) => e.governorateId?.name,
    hidden: true,
  },
  {
    name: "city",
    headerName: "city",
    getCell: (e) => e.cityId?.name,
    hidden: true,
  },
  {
    name: "street",
    headerName: "street",
    getCell: (e) => e.streetId?.name,
    hidden: true,
  },
  {
    name: "region",
    headerName: "region",
    getCell: (e) => e.regionId?.name,
    hidden: true,
  },
  {
    name: "village",
    headerName: "village",
    getCell: (e) => e.villageId?.name,
    hidden: true,
  },
  {
    name: "phone",
    headerName: "phone",
  },
  {
    name: "email",
    headerName: "email",
    hidden: true,
  },
  {
    name: "sources",
    headerName: "sources",
    getCell: (e) => e.sources?.source_name,
    hidden: true,
  },
  {
    name: "createdAt",
    headerName: "createdAt",
    sort: true,
    getCell: (row) => date(row.createdAt),
  },
  {
    name: "updatedAt",
    headerName: "updatedAt",
    sort: true,
    getCell: (row) => date(row.updatedAt),
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
              <Link
                to={`/dashboard/update_person/${e._id}`}
                className="flex update"
              >
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

const People = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allPeople = useRef([]);
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
    gender: "",
    maritalStatus: "",
    countryId: "",
    cityId: "",
    villageId: "",
    regionId: "",
    streetId: "",
    sources: "",
    countyId: "",
    governorateId: "",
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
      const { data } = await axios.get(`${baseURL}/people`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      dataLength.current =
        data[search ? "numberOfActiveResults" : "numberOfActivePeople"];
      allPeople.current = data[search ? "data" : "people"]?.map((e) => e._id);
      setData(data[search ? "data" : "people"]);
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
      <h1 className="title"> {language?.header?.people} </h1>
      {openFiltersDiv && (
        <TabelFilters
          setFilter={setFilters}
          filter={filters}
          setIsopen={setOpenFiltersDiv}
          setPage={setPage}
        />
      )}
      <Table
        columns={columns}
        selectable={role === "admin"}
        loading={loading}
        currentPage={page}
        setPage={setPage}
        allData={allPeople.current}
        selectedItems={slectedItems}
        setSelectedItems={setSelectedItems}
        getData={getData}
        deleteUrl="People"
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

export default People;
