import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import { date } from "../../context/context";
import SendData from "./../../components/response/SendData";
import Loading from "../../components/loading/Loading";
import useFeatchData from "../../hooks/useFeatchData";
import useLanguage from "../../hooks/useLanguage";

const Countries = () => {
  const [filters, setFilters] = useState({
    date: {
      from: "",
      to: "",
    },
  });
  const [search, setSearch] = useState("");
  const { language } = useLanguage();
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
    URL: "Countries",
    filters,
    search,
    numberOf: "numberOfActiveCountries",
  });

  const [overlay, setOverlay] = useState(false);
  const response = useRef(true);
  const [responseOverlay, setResponseOverlay] = useState(false);
  const ref = useRef(null);
  const [formLoading, setFormLoading] = useState(false);
  const context = useContext(Context);

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
  const token = context.userDetails.token;

  const header = [language?.country?.country_name, language?.country?.created_at];
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

  const checkOne = (e, element) => {
    e.target.classList.toggle("active");
    if (e.target.classList.contains("active")) {
      setSelectedItems((prevSelected) => [...prevSelected, element]);
      const allActiveSelectors = document.querySelectorAll(
        "td .checkbox.active"
      );
      const allSelectors = document.querySelectorAll("td .checkbox");
      if (allSelectors?.length === allActiveSelectors?.length)
        document.querySelector("th .checkbox").classList.add("active");
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((item) => item !== element)
      );
      document.querySelector("th .checkbox").classList.remove("active");
    }
  };

  const countryData = data?.map((e) => (
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
      if (update) {
        const data = await axios.patch(
          `${baseURL}/Countries/${update._id}`,
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
          `${baseURL}/Countries`,
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

  return (
    <>
      {responseOverlay && (
        <SendData data={`country`} response={response.current} />
      )}
      {formLoading && <Loading />}

      <h1 className="title">{language?.header?.countries}</h1>
      <div className="flex align-start gap-20 wrap">
        {context.userDetails.isAdmin && (
          <form onSubmit={handleSubmit} className="addresses">
            <h1>{update ? language?.country?.update_country : language?.country?.add_new_country}</h1>
            <label htmlFor="name">{language?.country?.country_name} </label>
            <input
              ref={ref}
              className="inp"
              required
              placeholder={language?.country?.country_name_placeholder}
              value={name}
              type="text"
              onInput={(e) => setName(e.target.value)}
              id="name"
            />
            <div className="flex wrap gap-10">
              <button className={`${update ? "save" : ""} btn flex-1`}>
                {update ? language?.country?.add_btn : language?.country?.save}
              </button>
              {update && (
                <button
                  onClick={() => setUpdate(false)}
                  className="btn flex-1 cencel"
                >
                  {language?.country?.cancel}
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
            data={{ data: countryData, allData: allPeople }}
            items={{ slectedItems: slectedItems, setSelectedItems }}
            overlay={{ overlay: overlay, setOverlay }}
            delete={{ url: "Countries", getData }}
            filters={{ search, setSearch, filters, setFilters }}
          />
        </div>
      </div>
    </>
  );
};

export default Countries;
