import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import { date } from "../../context/context";
import SendData from "./../../components/response/SendData";
import "../../components/form/form.css";
import Loading from "../../components/loading/Loading";
import TabelFilterDiv from "../../components/tabelFilterData/TabelFilterDiv";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getInfinityFeatchApis } from "../../infintyFeatchApis";
import InputWithLabel from "../../components/inputs/InputWithLabel";

const columns = [
  { name: "name", headerName: "name", sort: true },
  {
    name: "country",
    headerName: "country",
    getCell: (row) => row?.country?.name,
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

const Counties = () => {
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
    country: "",
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
    if (filters.country._id) params.append("country", filters.country._id);
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
      const { data } = await axios.get(`${baseURL}/Counties`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      dataLength.current =
        data[search ? "numberOfActiveResults" : "numberOfActiveConties"];
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
  const [form, setForm] = useState({ name: "", country: "" });
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (update) {
      ref.current.focus();
      setForm(update);
    } else {
      setForm({ name: "", country: "" });
    }
  }, [update]);
  const [error, setError] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.country) return setError("please select country");
    setFormLoading(true);
    try {
      if (update) {
        const data = await axios.patch(
          `${baseURL}/Counties/${update._id}`,
          form,
          { headers: { Authorization: "Bearer " + token } }
        );

        if (data.status === 200) {
          responseFun(true);
        }
        setUpdate(false);
      } else {
        const data = await axios.post(`${baseURL}/Counties`, form, {
          headers: { Authorization: "Bearer " + token },
        });
        if (data.status === 201) {
          responseFun(true);
        }
      }

      setForm({ name: "", country: "" });
      getData();
      setError(false);
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
    country: "",
  });

  return (
    <>
      {responseOverlay && (
        <SendData
          data={"language?.header?.Counties"}
          response={response.current}
        />
      )}
      {formLoading && <Loading />}
      <h1 className="title">{"language?.header?.Countiess"}</h1>
      <div className="flex align-start gap-20 wrap">
        {context.userDetails.isAdmin && (
          <form onSubmit={handleSubmit} className="addresses">
            <h1>
              {update
                ? "language?.Counties?.update_Counties"
                : "language?.Counties?.add_new_Counties"}
            </h1>

            <InputWithLabel
              label={"language?.Counties?.Counties_name"}
              ref={ref}
              required
              placeholder={"language?.Counties?.Counties_name_placeholder"}
              value={form.name}
              onInput={(e) => setForm({ ...form, name: e.target.value })}
              id="name"
            />

            <SelectInputApi
              fetchData={getInfinityFeatchApis}
              selectLabel="select country"
              optionLabel={(option) => option?.name}
              onChange={(option) => setForm({ ...form, country: option })}
              onIgnore={() => setForm({ ...form, country: "" })}
              url="Countries"
              label="country"
              value={form?.country?.name}
            />
            {error && <p className="error"> {error} </p>}
            <div className="flex wrap gap-10">
              <button className={`${update ? "save" : ""} btn flex-1`}>
                {update
                  ? "language?.Counties?.save"
                  : "language?.Counties?.add_btn"}
              </button>
              {update && (
                <button
                  onClick={() => setUpdate(false)}
                  className="btn flex-1 cencel "
                >
                  {"language?.Counties?.cancel"}
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
            >
              <SelectInputApi
                className="tabel-filter-select"
                isTabelsFilter
                fetchData={getInfinityFeatchApis}
                selectLabel={beforeFiltering?.country?.name}
                optionLabel={(option) => option?.name}
                onChange={(option) =>
                  setBeforeFiltering({ ...beforeFiltering, country: option })
                }
                tabelFilterIgnoreText="any country"
                onIgnore={() =>
                  setBeforeFiltering({ ...beforeFiltering, country: "" })
                }
                url="Countries"
                label="country"
              />
            </TabelFilterDiv>
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
            deleteUrl="Counties"
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
window.addEventListener("click", () => {
  const div = document.querySelector("form.addresses .selecte .inp.active");
  div && div.classList.remove("active");
});

export default Counties;
