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
import SourcesTabelFilters from "./SourcesTabelFilters";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import InputWithLabel from "../../components/inputs/InputWithLabel";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { getInfinityFeatchApis } from "./../../utils/infintyFeatchApis";
import { dateFormatter } from "./../../utils/dateFormatter";
const columns = [
  {
    name: "source_name",
    headerName: (lang) => lang?.source?.source_name,
    sort: true,
  },
  {
    name: "source_credibility",
    headerName: (lang) => lang?.source?.source_credibility,
    getCell: (row, lang) => lang?.enums?.credibility[row.source_credibility],
  },
  {
    name: "createdAt",
    headerName: (lang) => lang?.source?.created_at,
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
const Sources = () => {
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
    field: "",
    source_credibility: "",
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
    source_name: "",
    field: "",
    source_credibility: "High",
  });
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (update) {
      ref.current.focus();
      setForm(update);
    } else {
      setForm({ source_name: "", source_credibility: "High" });
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
      const { data } = await axios.get(`${baseURL}/Sources`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      dataLength.current =
        data[search ? "numberOfActiveResults" : "numberOfActiveSources"];
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
    if (!form.source_credibility) {
      return setError(language?.error?.please_selecet_credibility);
    } else if (!form.field) {
      return setError(language?.error?.please_selecet_field);
    }
    setFormLoading(true);
    try {
      const formData = { ...form };
      if (update) {
        const data = await axios.patch(
          `${baseURL}/Sources/${update._id}`,
          formData,
          { headers: { Authorization: "Bearer " + token } }
        );

        if (data.status === 200) {
          responseFun(true);
        }
        setUpdate(false);
      } else {
        const data = await axios.post(`${baseURL}/Sources`, formData, {
          headers: { Authorization: "Bearer " + token },
        });
        if (data.status === 201) {
          responseFun(true);
        }
      }

      setForm({ source_name: "", source_credibility: "High", field: "" });
      setError(false);
      getData();
    } catch (error) {
      console.log(error);
      if (error.response?.status === 400) responseFun("reapeted data");
      else responseFun(false);
    } finally {
      setFormLoading(false);
    }
  };

  const sourceCredibilityOptions = useMemo(() => {
    const arrayOfOptionsInput = [
      {
        name: "source_credibility",
        label: language?.information?.credibility,
        placeholder: ` ${language?.information?.select_credibility}`,
        options: [
          {
            onSelectOption: () =>
              setForm({ ...form, source_credibility: "High" }),
            text: language?.information?.high,
          },
          {
            text: language?.information?.medium,
            onSelectOption: () =>
              setForm({ ...form, source_credibility: "Medium" }),
          },
          {
            text: language?.information?.low,
            onSelectOption: () =>
              setForm({ ...form, source_credibility: "Low" }),
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
        <SendData data={language?.header?.source} response={response.current} />
      )}
      {formLoading && <Loading />}
      <h1 className="title">{language?.header?.sources}</h1>
      <div className="flex align-start gap-20 wrap">
        {context.userDetails.isAdmin && (
          <form onSubmit={handleSubmit} className="addresses">
            <h1>
              {update
                ? language?.source?.update_source
                : language?.source?.add_new_source}
            </h1>
            <InputWithLabel
              label={language?.source?.source_name}
              ref={ref}
              required
              placeholder={language?.source?.source_name_placeholder}
              value={form.source_name}
              onInput={(e) => setForm({ ...form, source_name: e.target.value })}
              id="name"
            />

            {sourceCredibilityOptions}
            <SelectInputApi
              fetchData={getInfinityFeatchApis}
              selectLabel={language?.source?.select_field}
              optionLabel={(option) => option?.name}
              onChange={(option) => setForm({ ...form, field: option })}
              onIgnore={() => setForm({ ...form, field: "" })}
              url="Fields"
              label={language?.source?.field}
              value={form?.field?.name}
            />
            {error && <p className="error"> {error} </p>}
            <div className="flex wrap gap-10">
              <button className={`${update ? "save" : ""} btn flex-1`}>
                {update ? language?.source?.save : language?.source?.add_btn}
              </button>
              {update && (
                <button
                  onClick={() => setUpdate(false)}
                  className="btn flex-1 cencel "
                >
                  {language?.source?.cancel}
                </button>
              )}
            </div>
          </form>
        )}
        <div className="flex-1">
          {openFiltersDiv && (
            <SourcesTabelFilters
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
            deleteUrl="Sources"
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

export default Sources;
