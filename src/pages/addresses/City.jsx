import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL } from "../../context/context";
import axios from "axios";
import { date } from "../../context/context";
import SendData from "./../../components/response/SendData";
import "../../components/form/form.css";
import { Context } from "./../../context/context";
import Loading from "../../components/loading/Loading";
import FormSelect from "../../components/form/FormSelect";
import useFeatchData from "../../hooks/useFeatchData";
import useLanguage from "../../hooks/useLanguage";
const City = () => {
  const [overlay, setOverlay] = useState(false);
  const response = useRef(true);
  const [error, setError] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { language } = useLanguage();
  const [filters, setFilters] = useState({
    country: "",
    date: {
      from: "",
      to: "",
    },
  });
  const {
    data,
    dataLength,
    allPeople,
    getData,
    page,
    setPage,
    slectedItems,
    setSelectedItems,
    loading,
  } = useFeatchData({
    URL: "Cities",
    filters,
    search,
    numberOf: "numberOfActiveCities",
  });
  const context = useContext(Context);
  const token = context.userDetails.token;

  const [responseOverlay, setResponseOverlay] = useState(false);
  const ref = useRef(null);

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

  const header = [
    language?.city?.city_name,
    language?.city?.country,
    language?.city?.created_at,
  ];
  const [form, setForm] = useState({
    name: "",
    countryId: "",
  });

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (update) {
      ref.current.focus();
      setForm(update);
    } else {
      setForm({
        name: "",
        countryId: "",
      });
    }
    error && setError(false);
  }, [update]);

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
      <td>{e.name}</td>
      <td>{e?.country?.name}</td>
      <td>{date(e.createdAt)}</td>
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
                setUpdate({ name: e.name, countryId: e.country, _id: e._id });
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
    if (!form.countryId) {
      setError(language?.error?.please_selecet_country);
    } else {
      setFormLoading(true);
      try {
        const formData = { name: form.name, country: form.countryId._id };

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

        setForm({
          name: "",
          countryId: "",
        });
        getData();
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else responseFun(false);
      } finally {
        setFormLoading(false);
      }
    }
  };

  return (
    <>
      {responseOverlay && (
        <SendData data={`country`} response={response.current} />
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
            <label htmlFor="name">{language?.city?.city_name}</label>
            <input
              ref={ref}
              className="inp"
              required
              placeholder={language?.city?.city_name_placeholder}
              value={form.name}
              type="text"
              onInput={(e) => setForm({ ...form, name: e.target.value })}
              id="name"
            />

            <FormSelect
              formKey="country"
              error={{ error, setError }}
              form={{ form, setForm }}
            />
            {error && <p className="error"> {error} </p>}
            <div className="flex wrap gap-10">
              <button className={`${update ? "save" : ""} btn flex-1`}>
                {update ? language?.city?.save : language?.city?.add_btn}
              </button>
              {update && (
                <button
                  onClick={() => setUpdate(false)}
                  className="btn flex-1 cencel "
                >
                  {language?.city?.cancel}
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
            page={{ page: page, setPage, dataLength: dataLength }}
            data={{ data: tableData, allData: allPeople }}
            items={{ slectedItems: slectedItems, setSelectedItems }}
            overlay={{ overlay: overlay, setOverlay }}
            delete={{ url: "cities", getData }}
            filters={{ search, setSearch, filters, setFilters }}
          />
        </div>
      </div>
    </>
  );
};

export default City;
