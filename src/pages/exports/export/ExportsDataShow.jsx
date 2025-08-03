import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { baseURL, Context } from "../../../context/context";
import Table from "../../../components/table/Table";
import { Link } from "react-router-dom";
import { dateFormatter } from "../../../utils/dateFormatter";
import ExportFilters from "./ExportFilters";
import useLanguage from "../../../hooks/useLanguage";
const columns = [
  {
    name: "code",
    headerName: (lang) => lang?.exports?.code,
    sort: true,
    getCell: (e) => (
      <Link to={`${e?._id}`} className="name">
        {e.code}
      </Link>
    ),
  },
  {
    name: "details",
    hidden: true,
    headerName: (lang) => lang?.exports?.details,
    getCell: (e) => (
      <Link to={`${e?._id}`} className="name">
        {e.details}
      </Link>
    ),
  },

  {
    name: "expirationDate",
    headerName: (lang) => lang?.exports?.expiration_date,
    sort: true,
    getCell: (e) => dateFormatter(e.expirationDate),
  },

  {
    name: "createdAt",
    headerName: (lang) => lang?.exports?.created_at,
    sort: true,
    getCell: (row) => dateFormatter(row.createdAt),
  },
  {
    name: "updatedAt",
    headerName: (lang) => lang?.exports?.last_updated,
    sort: true,
    getCell: (row) => dateFormatter(row.updatedAt),
    hidden: true,
  },
  {
    name: "options",
    headerName: (lang) => lang?.table?.options,
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
            <Link to={`/update_export/${e._id}`} className="flex update">
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
const ExportsDataShow = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allData = useRef([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const { language } = useLanguage();
  const token = context.userDetails.token;
  const limit = context?.limit;
  const [sort, setSort] = useState({});
  const [openFiltersDiv, setOpenFiltersDiv] = useState(false);
  const [filters, setFilters] = useState({
    date: {
      from: "",
      to: "",
    },
    expirationDate: "",
  });
  const [search, setSearch] = useState("");

  const { expiredExports, setExpiredExports } = context;

  const getData = useCallback(async () => {
    if (search && filters.expirationDate) return;
    setLoading(true);
    setData([]);
    setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    const params = new URLSearchParams();
    params.append("active", true);
    params.append("limit", limit);
    params.append("page", page);
    const exportsDataUrl = `${baseURL}/exports/${
      filters.expirationDate ? "expiredExports" : ""
    }`;

    if (filters.date.from) params.append("createdAt[gte]", filters.date.from);
    if (filters.date.to) params.append("createdAt[lte]", filters.date.to);
    if (Object.keys(sort).length) {
      const sortParams = Object.values(sort)
        .map((v) => v)
        .join(",");
      params.append("sort", sortParams);
    }
    if (search && !filters.expirationDate) params.append("search", search);
    try {
      const [tabelData, expiredExportsCount] = await Promise.all([
        axios.get(exportsDataUrl, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }),
        axios.get(`${baseURL}/exports/countExpiredExports`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const { data } = tabelData;

      const { count } = expiredExportsCount.data;
      if (count !== expiredExports && expiredExports > 0)
        setExpiredExports(count);
      dataLength.current = filters.expirationDate
        ? count
        : data[search ? "numberOfActiveResults" : "total"];
      allData.current = data.data?.map((e) => e._id);
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

  return (
    <>
      <h1 className="title">{language?.exports?.incoming}</h1>
      {openFiltersDiv && (
        <ExportFilters
          setFilter={setFilters}
          filter={filters}
          setIsopen={setOpenFiltersDiv}
          setPage={setPage}
          expirationCount={expiredExports}
        />
      )}
      <Table
        addPageUrl="add_export"
        columns={columns}
        selectable
        loading={loading}
        currentPage={page}
        setPage={setPage}
        allData={allData.current}
        selectedItems={slectedItems}
        setSelectedItems={setSelectedItems}
        getData={getData}
        deleteUrl="exports"
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

export default ExportsDataShow;
