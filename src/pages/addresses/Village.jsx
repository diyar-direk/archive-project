import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import { date } from "../../context/context";
import SendData from "./../../components/response/SendData";
import "../../components/form.css";
import Loading from "../../components/loading/Loading";
const Village = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allPeople = useRef([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const response = useRef(true);
  const [fltr, setFltr] = useState(false);
  const [error, setError] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [filters, setFilters] = useState({
    country: "",
    government: "",
    city: "",
  });
  const context = useContext(Context);
  const limit = context?.limit;
  const [inputsFltr, setInputsFltr] = useState({
    search: "",
    date: "",
  });
  const [responseOverlay, setResponseOverlay] = useState(false);
  const ref = useRef(null);
  const [fltrSelect, setFltrSelect] = useState({ data: [], searchData: [] });

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

  const header = ["name", "city", "creat at"];
  const [form, setForm] = useState({ name: "", city: "" });
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (update) {
      ref.current.focus();
      setForm(update);
    } else {
      setForm({ name: "", city: "" });
    }
    error && setError(false);
  }, [update]);

  useEffect(() => {
    getData();
  }, [page, filters.city ,limit ,inputsFltr.date]);

  useEffect(() => {
    axios
      .get(`${baseURL}/Cities?active=true`)
      .then((res) => {
        setFltrSelect({ data: res.data.data, searchData: res.data.data });
      })
      .catch((err) => console.log(err));
  }, []);

  const getData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/Villages?active=true&limit=${limit}&page=${page}`;
    inputsFltr.date && (url += `&createdAt[gte]=${inputsFltr.date}`);
    filters.city && (url += `&city=${filters.city._id}`);

    try {
      const data = await axios.get(url);

      dataLength.current = data.data.numberOfActiveVillages;
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

  const tableData = data?.map((e) => (
    <tr key={e._id}>
      <td>
        <div
          onClick={(target) => {
            target.stopPropagation();
            checkOne(target, e._id);
          }}
          className="checkbox"
        ></div>
      </td>
      <td>{e.name}</td>
      <td>{e.city?.name}</td>
      <td>{date(e.createdAt)}</td>
      <td>
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
      </td>
    </tr>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    if (!form.city) {
      setError("Please select a city");
    } else
      try {
        const formData = { ...form, city: form.city._id };

        if (update) {
          const data = await axios.patch(
            `${baseURL}/Villages/${update._id}`,
            formData
          );

          if (data.status === 200) {
            responseFun(true);
          }
          setUpdate(false);
        } else {
          const data = await axios.post(`${baseURL}/Villages`, formData);
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
      }
    finally {
      setFormLoading(false);
    }
  };

  const openDiv = (e) => {
    e.stopPropagation();
    const allDivs = document.querySelectorAll(
      ".overlay .filters .select div.active"
    );
    allDivs.forEach(
      (ele) => ele !== e.target && ele.classList.remove("active")
    );
    e.target.classList.toggle("active");
  };

  return (
    <>
      {responseOverlay && (
        <SendData data={`country`} response={response.current} />
      )}
        {formLoading && <Loading />}
      <h1 className="title">villages</h1>
      <div className="flex align-start gap-20 wrap">
        <form onSubmit={handleSubmit} className="addresses">
          <h1>{update ? "update this country" : "add new Village"}</h1>
          <label htmlFor="name">Village name</label>
          <input
            ref={ref}
            className="inp"
            required
            placeholder="please write a Village name"
            value={form.name}
            type="text"
            onInput={(e) => setForm({ ...form, name: e.target.value })}
            id="name"
          />
          <label> city</label>

          <div className="select relative">
            <div onClick={openDiv} className="inp center gap-10 w-100">
              <span className="pointer-none">
                {form.city ? form.city.name : "select city"}
              </span>
              <i className="fa-solid fa-sort-down pointer-none"></i>
            </div>
            <article>
              <input
                onClick={(e) => e.stopPropagation()}
                type="text"
                className="fltr-search"
                placeholder="search for city ..."
                onInput={(inp) => {
                  const filteredCountries = fltrSelect.data.filter((e) =>
                    e.name
                      .toLowerCase()
                      .includes(inp.target.value.toLowerCase())
                  );

                  setFltrSelect({
                    ...fltrSelect,
                    searchData: filteredCountries,
                  });
                }}
              />

              {fltrSelect.searchData.map((itm, i) => (
                <h2
                  key={i}
                  onClick={() => {
                    setForm({ ...form, city: itm });
                    error && setError(false);
                  }}
                >
                  {itm.name}
                </h2>
              ))}

              {fltrSelect.searchData.length <= 0 && <p>no data</p>}
            </article>
          </div>
          {error && <p className="error"> {error} </p>}
          <div className="flex wrap gap-10">
            <button className={`${update ? "save" : ""} btn flex-1`}>
              {update ? "save" : "add"}
            </button>
            {update && (
              <button
                onClick={() => setUpdate(false)}
                className="btn flex-1 cencel "
              >
                cencel
              </button>
            )}
          </div>
        </form>
        <div className="flex-1">
          <Table
            header={header}  
            loading={loading}
            page={{ page: page, setPage, dataLength: dataLength.current }}
            data={{ data: tableData, allData: allPeople.current }}
            items={{ slectedItems: slectedItems, setSelectedItems }}
            overlay={{ overlay: overlay, setOverlay }}
            delete={{ url: "Villages", getData }}
            hasFltr={{ fltr: fltr, setFltr }}
            filters={{ filters, setFilters, inputsFltr, setInputsFltr }}
          />
        </div>
      </div>
    </>
  );
};

export default Village;
