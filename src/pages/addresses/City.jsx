import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Table from "../../components/table/Table";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import SendData from "./../../components/response/SendData";
import "../../components/form/form.css";
import Loading from "../../components/loading/Loading";
import useLanguage from "../../hooks/useLanguage";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import CitiesFilters from "./CitiesFilters";
import InputWithLabel from "../../components/inputs/InputWithLabel";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { getInfinityFeatchApis } from "../../utils/infintyFeatchApis";
import { dateFormatter } from "../../utils/dateFormatter";
const columns = [
  { name: "name", headerName: "name", sort: true },
  { name: "parent", headerName: "parent" },
  {
    name: "parent name",
    headerName: "parent name",
    getCell: (row) => row.parentId.name,
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
const Cities = () => {
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
  const { language } = useLanguage();
  const [sort, setSort] = useState({});
  const { role } = context.userDetails;
  const [openFiltersDiv, setOpenFiltersDiv] = useState(false);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState({
    parentId: "",
    parent: "",
    date: {
      from: "",
      to: "",
    },
  });
  const [search, setSearch] = useState("");
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
  window.addEventListener("click", () => {
    const div = document.querySelector("form.addresses .selecte .inp.active");
    div && div.classList.remove("active");
  });
  const [form, setForm] = useState({
    parent: "",
    parentId: "",
    name: "",
  });
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (update) {
      ref.current.focus();
      setForm(update);
    } else {
      setForm({ parent: "", parentId: "", name: "" });
    }
  }, [update]);

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
      const { data } = await axios.get(`${baseURL}/Cities`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      dataLength.current =
        data[search ? "numberOfActiveResults" : "numberOfActiveCities"];
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.parent) {
      return setError(`please select parent`);
    } else if (!form.parentId) {
      return setError(`please select ${form.parent}`);
    }
    setFormLoading(true);
    try {
      const formData = { ...form };
      if (update) {
        const data = await axios.patch(
          `${baseURL}/Cities/${update._id}`,
          formData,
          { headers: { Authorization: "Bearer " + token } }
        );

        if (data.status === 200) {
          responseFun(true);
        }
        setUpdate(false);
      } else {
        const data = await axios.post(`${baseURL}/Cities`, formData, {
          headers: { Authorization: "Bearer " + token },
        });
        if (data.status === 201) {
          responseFun(true);
        }
      }

      setForm({ ...form, parentId: "", name: "" });
      getData();
      setError(false);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 400) responseFun("reapeted data");
      else responseFun(false);
    } finally {
      setFormLoading(false);
    }
  };
  const [reset, setReset] = useState(false);

  useEffect(() => {
    setReset(true);
  }, [setReset, form.parent]);

  const optionInputs = useMemo(() => {
    const arrayOfOptionsInput = [
      {
        name: "parent",
        label: "parent",
        placeholder: "select parent",
        options: [
          {
            onSelectOption: () =>
              setForm({ ...form, parent: "Governorate", parentId: "" }),
            text: "Governorate",
          },
          {
            text: "County",
            onSelectOption: () =>
              setForm({ ...form, parent: "County", parentId: "" }),
          },
        ],
      },
    ];
    return arrayOfOptionsInput.map((input) => (
      <SelectOptionInput
        key={input.name}
        label={input.label}
        placeholder={input.placeholder}
        value={form[input.name]}
        onIgnore={() => setForm({ ...form, [input.name]: "" })}
        options={input.options}
      />
    ));
  }, [language, form]);
  return (
    <>
      {responseOverlay && (
        <SendData data={language?.header?.city} response={response.current} />
      )}
      {formLoading && <Loading />}
      <h1 className="title">{language?.header?.cities}</h1>
      <div className="flex align-start gap-20 wrap">
        {context.userDetails.isAdmin && (
          <form onSubmit={handleSubmit} className="addresses">
            <h1>
              {update
                ? language?.city?.update_city
                : language?.city?.add_new_city}
            </h1>
            <InputWithLabel
              label={language?.city?.city_name}
              ref={ref}
              required
              placeholder={language?.city?.city_name_placeholder}
              value={form.name}
              onInput={(e) => setForm({ ...form, name: e.target.value })}
              id="name"
            />

            {optionInputs}

            {form.parent && (
              <SelectInputApi
                fetchData={getInfinityFeatchApis}
                selectLabel={`select ${form.parent}`}
                optionLabel={(option) => option?.name}
                onChange={(option) => setForm({ ...form, parentId: option })}
                onIgnore={() => setForm({ ...form, parentId: "" })}
                url={
                  form.parent === "Governorate" ? "Governorates" : "Counties"
                }
                label={form.parent}
                value={form?.parentId?.name}
                reset={reset}
                setReset={setReset}
              />
            )}
            {error && <p className="error"> {error} </p>}
            <div className="flex wrap gap-10">
              <button className={`${update ? "save" : ""} btn flex-1`}>
                {update ? language?.city?.save : language?.city?.add_btn}
              </button>
              {update && (
                <button
                  onClick={() => setUpdate(false)}
                  className="btn flex-1 cencel"
                >
                  {language?.city?.cancel}
                </button>
              )}
            </div>
          </form>
        )}
        <div className="flex-1">
          {openFiltersDiv && (
            <CitiesFilters
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
            deleteUrl="Cities"
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

export default Cities;
