import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import { date } from "../../context/context";
import SendData from "./../../components/response/SendData";
import "../../components/form/form.css";
import Loading from "../../components/loading/Loading";
import useLanguage from "../../hooks/useLanguage";

const Sources = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allPeople = useRef([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const response = useRef(true);
  const { language } = useLanguage();
  const [responseOverlay, setResponseOverlay] = useState(false);
  const ref = useRef(null);
  const [formLoading, setFormLoading] = useState(false);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const [filters, setFilters] = useState({
    date: {
      from: "",
      to: "",
    },
    source_credibility: "",
  });
  const [search, setSearch] = useState("");
  const limit = context?.limit;
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
    const div = document.querySelector("form.addresses .select .inp.active");
    div && div.classList.remove("active");
  });

  const header = [
    language?.source?.source_name,
    language?.source?.created_at,
    language?.source?.source_credibility,
  ];
  const [form, setForm] = useState({
    source_name: "",
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

  useEffect(() => {
    if (!search) getData();
  }, [page, limit, search, filters]);

  const getData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/Sources?active=true&limit=${limit}&page=${page}`;
    const keys = Object.keys(filters);
    keys.forEach(
      (key) =>
        key !== "date" &&
        filters[key] &&
        (url += `&${filters[key]._id ? key + "Id" : key}=${
          filters[key]._id ? filters[key]._id : filters[key]
        }`)
    );
    filters.date.from && filters.date.to
      ? (url += `&createdAt[gte]=${filters.date.from}&createdAt[lte]=${filters.date.to}`)
      : filters.date.from && !filters.date.to
      ? (url += `&createdAt[gte]=${filters.date.from}`)
      : !filters.date.from &&
        filters.date.to &&
        (url += `&createdAt[lte]=${filters.date.to}`);
    try {
      const data = await axios.get(url, {
        headers: { Authorization: "Bearer " + token },
      });

      dataLength.current = data.data.numberOfActiveSources;
      allPeople.current = data.data.data.map((e) => e._id);
      setData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const checkOne = (e, element) => {
    e.target.classList.toggle("active");
    if (e.target.classList.contains("active")) {
      setSelectedItems((prevSelected) => [...prevSelected, element]);
      const allActiveSelectors = document.querySelectorAll(
        "td .checkbox.active"
      );
      const allSelectors = document.querySelectorAll("td .checkbox");
      if (allSelectors.length === allActiveSelectors.length)
        document.querySelector("th .checkbox").classList.add("active");
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((item) => item !== element)
      );
      document.querySelector("th .checkbox").classList.remove("active");
    }
  };
  useEffect(() => {
    if (!search) return;
    const timeOut = setTimeout(() => getSearchData(), 500);
    return () => clearTimeout(timeOut);
  }, [page, search, filters, limit]);

  const getSearchData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/Sources/search?active=true&limit=${limit}&page=${page}`;

    const keys = Object.keys(filters);
    keys.forEach(
      (key) =>
        key !== "date" &&
        filters[key] &&
        (url += `&${filters[key]._id ? key + "Id" : key}=${
          filters[key]._id ? filters[key]._id : filters[key]
        }`)
    );
    filters.date.from && filters.date.to
      ? (url += `&createdAt[gte]=${filters.date.from}&createdAt[lte]=${filters.date.to}`)
      : filters.date.from && !filters.date.to
      ? (url += `&createdAt[gte]=${filters.date.from}`)
      : !filters.date.from &&
        filters.date.to &&
        (url += `&createdAt[lte]=${filters.date.to}`);

    try {
      const data = await axios.post(
        url,
        {
          search: search,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      dataLength.current = data.data.numberOfActiveResults;
      allPeople.current = data.data.data.map((e) => e._id);
      setData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const tableData = data?.map((e) => (
    <tr key={e._id}>
      {context.userDetails.isAdmin && (
        <td>
          <div
            onClick={(target) => {
              target.stopPropagation();
              checkOne(target, e._id);
            }}
            className="checkbox"
          ></div>
        </td>
      )}
      <td>{e.source_name}</td>
      <td>{date(e.createdAt)}</td>
      <td>{e.source_credibility}</td>
      <td>
        {context.userDetails.isAdmin && (
          <div className="center gap-10 actions">
            <i
              onClick={(event) => {
                event.stopPropagation();
                setOverlay(true);
                const allSelectors = document.querySelectorAll(".checkbox");
                allSelectors.forEach((e) => e.classList.remove("active"));
                setSelectedItems([e._id]);
              }}
              className="delete fa-solid fa-trash"
            ></i>
            <i
              onClick={() => {
                setUpdate(e);
              }}
              className="update fa-regular fa-pen-to-square"
            ></i>
          </div>
        )}
      </td>
    </tr>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      setForm({ source_name: "", source_credibility: "High" });
      getData();
    } catch (error) {
      console.log(error);
      if (error.response?.status === 400) responseFun("reapeted data");
      else responseFun(false);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      {responseOverlay && (
        <SendData data={`country`} response={response.current} />
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
            <label htmlFor="source_name">{language?.source?.source_name}</label>
            <input
              ref={ref}
              className="inp"
              required
              placeholder={language?.source?.source_name_placeholder}
              value={form.source_name}
              type="text"
              onInput={(e) => setForm({ ...form, source_name: e.target.value })}
              id="source_name"
            />

            <label htmlFor="source_credibility">
              {language?.source?.source_credibility}
            </label>
              <select
                className="inp center gap-10 w-100"
                id="source_credibility"
                value={form.source_credibility}
                onChange={(e) =>
                  setForm({ ...form, source_credibility: e.target.value })
                }
              >
                <option value="High">{language?.source?.high}</option>
                <option value="Medium">{language?.source?.medium}</option>
                <option value="Low">{language?.source?.low}</option>
              </select>

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
          <Table
            hideActionForUser={!context.userDetails.isAdmin}
            header={header}
            loading={loading}
            page={{ page: page, setPage, dataLength: dataLength.current }}
            data={{ data: tableData, allData: allPeople.current }}
            items={{ slectedItems: slectedItems, setSelectedItems }}
            overlay={{ overlay: overlay, setOverlay }}
            delete={{ url: "Sources", getData, getSearchData }}
            filters={{ search, setSearch, filters, setFilters }}
          />
        </div>
      </div>
    </>
  );
};

export default Sources;
