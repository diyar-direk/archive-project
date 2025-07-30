import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { baseURL, Context } from "../../context/context";
import Table from "./../../components/table/Table";
import useLanguage from "../../hooks/useLanguage";
import UsersTabelFilters from "./UsersTabelFilters";
import { dateFormatter } from "../../utils/dateFormatter";
const columns = [
  {
    name: "username",
    headerName: (lang) => lang?.users?.username,
    getCell: (e, currentUser, language) => {
      return `${e.username} ${
        currentUser === e._id ? language?.users?.you : ""
      }`;
    },
    type: "usersPage",
    sort: true,
  },
  {
    name: "role",
    headerName: (lang) => lang?.users?.role,
    getCell: (value, translate) => translate?.enums?.role[value?.role],
  },
  {
    name: "sectionId",
    headerName: (lang) => lang?.users?.section,
    getCell: (e) => e.sectionId?.name || "all sections",
  },
  {
    name: "createdAt",
    headerName: (lang) => lang?.users?.created_at,
    getCell: (e) => dateFormatter(e.createdAt),
    sort: true,
  },

  {
    name: "option",
    headerName: (lang) => lang?.table?.options,
    getCell: (e, setOverlay, setSelectedItems) => (
      <div className="center gap-10 options">
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
      </div>
    ),
    hideColumnIf: (e, currentUser) => e._id === currentUser,
    type: "actions",
  },
];
const Users = () => {
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
  const [openFiltersDiv, setOpenFiltersDiv] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
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
      const { data } = await axios.get(`${baseURL}/Users`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      dataLength.current =
        data[search ? "numberOfActiveResults" : "numberOfActiveUsers"];
      allPeople.current = data[search ? "data" : "users"]?.filter(
        (e) => e._id !== context.userDetails._id
      );
      setData(data[search ? "data" : "users"]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, filters, search, limit, sort, context.userDetails._id]);

  useEffect(() => {
    if (!search) getData();
    else {
      const timeOut = setTimeout(() => getData(), 500);
      return () => clearTimeout(timeOut);
    }
  }, [page, filters, search, limit, sort, getData]);

  return (
    <>
      <h1 className="title"> {language?.header?.users} </h1>
      {openFiltersDiv && (
        <UsersTabelFilters
          setFilter={setFilters}
          filter={filters}
          setIsopen={setOpenFiltersDiv}
          setPage={setPage}
        />
      )}
      <Table
        addPageUrl="add_user"
        columns={columns}
        selectable
        loading={loading}
        currentPage={page}
        setPage={setPage}
        allData={allPeople.current}
        selectedItems={slectedItems}
        setSelectedItems={setSelectedItems}
        getData={getData}
        deleteUrl="Users"
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

export default Users;
