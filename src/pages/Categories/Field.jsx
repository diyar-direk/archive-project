import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import SendData from "../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import TabelFilterDiv from "../../components/tabelFilterData/TabelFilterDiv";
import InputWithLabel from "../../components/inputs/InputWithLabel";
import { dateFormatter } from "../../utils/dateFormatter";
const columns = [
  { name: "name", headerName: "name", sort: true },
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
    getCell: (e, setOverlay, setSelectedItems, role, setUpdate) => (
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
              <div className="flex update">
                <i
                  className="fa-regular fa-pen-to-square"
                  onClick={() => setUpdate(e)}
                ></i>
              </div>
            </>
          )}
        </div>
      </>
    ),
  },
];
const Field = () => {
  const response = useRef(true);
  const [responseOverlay, setResponseOverlay] = useState(false);
  const ref = useRef(null);
  const [formLoading, setFormLoading] = useState(false);
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
  const { role } = context.userDetails;
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
      const { data } = await axios.get(`${baseURL}/Fields`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      console.log(data);
      dataLength.current =
        data[search ? "numberOfActiveResults" : "numberOfActiveFields"];
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
  const responseFun = (complete = false) => {
    complete === true
      ? (response.current = true)
      : complete === "reapeted data"
      ? (response.current = 400)
      : (response.current = false);
    setResponseOverlay(true);
    window.onclick = () => {
      setResponseOverlay(false);
    };
    setTimeout(() => {
      setResponseOverlay(false);
    }, 3000);
  };
  const [name, setName] = useState("");
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (update) {
      ref.current.focus();
      setName(update.name);
    } else {
      setName("");
    }
  }, [update]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (update) {
        const data = await axios.patch(
          `${baseURL}/Fields/${update._id}`,
          {
            name,
          },
          { headers: { Authorization: "Bearer " + token } }
        );

        if (data.status === 200) {
          responseFun(true);
        }
        setUpdate(false);
      } else {
        const data = await axios.post(
          `${baseURL}/Fields`,
          { name: name },
          { headers: { Authorization: "Bearer " + token } }
        );
        if (data.status === 201) {
          responseFun(true);
        }
      }

      setName("");
      getData();
    } catch (error) {
      console.log(error);
      if (error.status === 400) responseFun("reapeted data");
      else responseFun(false);
    } finally {
      setFormLoading(false);
    }
  };
  const [beforeFiltering, setBeforeFiltering] = useState({
    date: { from: "", to: "" },
  });
  return (
    <>
      {responseOverlay && (
        <SendData data="Fields" response={response.current} />
      )}
      {formLoading && <Loading />}
      <h1 className="title">Fields</h1>
      <div className="flex align-start gap-20 wrap">
        {context.userDetails.isAdmin && (
          <form onSubmit={handleSubmit} className="addresses">
            <h1>{update ? "update_Fields" : "add_new_Fields"}</h1>
            <InputWithLabel
              label={"Fields_name"}
              ref={ref}
              required
              placeholder="Fields_name_placeholder"
              value={name}
              onInput={(e) => setName(e.target.value)}
              id="name"
            />
            <div className="flex wrap gap-10">
              <button className={`${update ? "save" : ""} btn flex-1`}>
                {update ? "save" : "add_btn"}
              </button>
              {update && (
                <button
                  onClick={() => setUpdate(false)}
                  className="btn flex-1 cencel "
                >
                  cancel
                </button>
              )}
            </div>
          </form>
        )}
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
            selectable={role === "admin"}
            loading={loading}
            currentPage={page}
            setPage={setPage}
            allData={allPeople.current}
            selectedItems={slectedItems}
            setSelectedItems={setSelectedItems}
            getData={getData}
            deleteUrl="Fields"
            dataLength={dataLength.current}
            tabelData={data}
            setSort={setSort}
            search={search}
            setSearch={setSearch}
            openFiltersDiv={openFiltersDiv}
            setOpenFiltersDiv={setOpenFiltersDiv}
            setUpdate={setUpdate}
          />
        </div>
      </div>
    </>
  );
};

export default Field;
