import { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseURL, Context } from "../../../context/context";
import Table from "../../../components/table/Table";
import { dateFormatter } from "../../../utils/dateFormatter";
import { Link } from "react-router-dom";
import TabelFilterDiv from "../../../components/tabelFilterData/TabelFilterDiv";
const columns = [
  { name: "title", headerName: "title", sort: true },
  {
    name: "subject",
    headerName: "subject",
    hidden: true,
    getCell: (e) => (
      <Link to={`${e._id}`} className="name">
        {e.subject}
      </Link>
    ),
  },
  {
    name: "date",
    headerName: "date",
    sort: true,
    getCell: (row) => dateFormatter(row.date),
  },
  {
    name: "number",
    headerName: "number",
    sort: true,
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
    getCell: (e, setOverlay, setSelectedItems) => (
      <>
        <div className="options center">
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
              to={`/dashboard/update_result/${e._id}`}
              className="flex update"
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </Link>
          </>

          <Link to={`${e._id}`} className="flex visit">
            <i className="fa-solid fa-eye" />
          </Link>
        </div>
      </>
    ),
  },
];
const ResultListShow = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allPeople = useRef([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const limit = context?.limit;
  const [sort, setSort] = useState({});
  const [openFiltersDiv, setOpenFiltersDiv] = useState(false);
  const [filters, setFilters] = useState({
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
      const { data } = await axios.get(`${baseURL}/results`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      dataLength.current = data[search ? "numberOfActiveResults" : "total"];
      allPeople.current = data.data?.map((e) => e._id);
      setData(data.data);
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
  const [beforeFiltering, setBeforeFiltering] = useState({
    date: { from: "", to: "" },
  });
  return (
    <>
      <h1 className="title"> results </h1>
      <div className="flex align-start gap-20 wrap">
        <div className="flex-1">
          {openFiltersDiv && (
            <TabelFilterDiv
              beforeFiltering={beforeFiltering}
              setBeforeFiltering={setBeforeFiltering}
              setFilter={setFilters}
              setPage={setPage}
              setIsopen={setOpenFiltersDiv}
            />
          )}
          <Table
            columns={columns}
            addPageUrl="add_result"
            selectable
            loading={loading}
            currentPage={page}
            setPage={setPage}
            allData={allPeople.current}
            selectedItems={slectedItems}
            setSelectedItems={setSelectedItems}
            getData={getData}
            deleteUrl="results"
            dataLength={dataLength.current}
            tabelData={data}
            setSort={setSort}
            search={search}
            setSearch={setSearch}
            openFiltersDiv={openFiltersDiv}
            setOpenFiltersDiv={setOpenFiltersDiv}
          />
        </div>
      </div>
    </>
  );
};

export default ResultListShow;
