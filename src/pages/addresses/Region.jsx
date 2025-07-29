import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import SendData from "./../../components/response/SendData";
import "../../components/form/form.css";
import Loading from "../../components/loading/Loading";
import TabelFilterDiv from "../../components/tabelFilterData/TabelFilterDiv";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import useLanguage from "../../hooks/useLanguage";
import InputWithLabel from "../../components/inputs/InputWithLabel";
import { getInfinityFeatchApis } from "../../utils/infintyFeatchApis";
import { dateFormatter } from "../../utils/dateFormatter";

const columns = [
  { name: "name", headerName: (lang) => lang?.region?.region_name, sort: true },
  {
    name: "city",
    headerName: (lang) => lang?.region?.city,
    getCell: (row) => row?.city?.name,
  },
  {
    name: "createdAt",
    headerName: (lang) => lang?.region?.created_at,
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
    onlyAdminCanSee: true,
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

const Region = () => {
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
    city: "",
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
    if (filters.city._id) params.append("city", filters.city._id);
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
      const { data } = await axios.get(`${baseURL}/Regions`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      dataLength.current =
        data[search ? "numberOfActiveResults" : "numberOfActiveRegions"];
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
  const [form, setForm] = useState({ name: "", city: "" });
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (update) {
      ref.current.focus();
      setForm(update);
    } else {
      setForm({ name: "", city: "" });
    }
  }, [update]);
  const [error, setError] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.city) return setError(language?.error?.please_selecet_city);
    setFormLoading(true);
    try {
      if (update) {
        const data = await axios.patch(
          `${baseURL}/Regions/${update._id}`,
          form,
          { headers: { Authorization: "Bearer " + token } }
        );

        if (data.status === 200) {
          responseFun(true);
        }
        setUpdate(false);
      } else {
        const data = await axios.post(`${baseURL}/Regions`, form, {
          headers: { Authorization: "Bearer " + token },
        });
        if (data.status === 201) {
          responseFun(true);
        }
      }

      setForm({ name: "", city: "" });
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
    city: "",
  });
  const { language } = useLanguage();

  return (
    <>
      {responseOverlay && (
        <SendData data={language?.header?.region} response={response.current} />
      )}
      {formLoading && <Loading />}
      <h1 className="title">{language?.header?.region}</h1>
      <div className="flex align-start gap-20 wrap">
        {context.userDetails.isAdmin && (
          <form onSubmit={handleSubmit} className="addresses">
            <h1>
              {update
                ? language?.region?.update_region
                : language?.region?.add_new_region}
            </h1>

            <InputWithLabel
              label={language?.region?.region_name}
              ref={ref}
              required
              placeholder={language?.region?.region_name_placeholder}
              value={form.name}
              onInput={(e) => setForm({ ...form, name: e.target.value })}
              id="name"
            />

            <SelectInputApi
              fetchData={getInfinityFeatchApis}
              selectLabel={language?.people?.select_city}
              optionLabel={(option) => option?.name}
              onChange={(option) => setForm({ ...form, city: option })}
              onIgnore={() => setForm({ ...form, city: "" })}
              url="Cities"
              label={language?.people?.city}
              value={form?.city?.name}
            />
            {error && <p className="error"> {error} </p>}
            <div className="flex wrap gap-10">
              <button className={`${update ? "save" : ""} btn flex-1`}>
                {update ? language?.region?.save : language?.region?.add_btn}
              </button>
              {update && (
                <button
                  onClick={() => setUpdate(false)}
                  className="btn flex-1 cencel "
                >
                  {language?.region?.cancel}
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
                selectLabel={beforeFiltering?.city?.name}
                optionLabel={(option) => option?.name}
                onChange={(option) =>
                  setBeforeFiltering({ ...beforeFiltering, city: option })
                }
                tabelFilterIgnoreText={language?.table?.any}
                onIgnore={() =>
                  setBeforeFiltering({ ...beforeFiltering, city: "" })
                }
                url="Cities"
                label={language?.people?.city}
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
            deleteUrl="Regions"
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

export default Region;
