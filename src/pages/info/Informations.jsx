import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { baseURL, Context, date, nextJoin } from "../../context/context";
import Table from "./../../components/table/Table";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
const Informations = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allPeople = useRef([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const limit = context?.limit;
  const token = context.userDetails.token;
  const { language } = useLanguage();
  const [filters, setFilters] = useState({
    country: "",
    government: "",
    city: "",
    villag: "",
    date: {
      from: "",
      to: "",
    },
    credibility: "",
  });

  const [search, setSearch] = useState("");

  const header = [
    language?.information?.subject,
    language?.information?.details,
    language?.information?.credibility,
    language?.information?.adress,
    language?.information?.government,
    language?.information?.people,
    language?.information?.source,
    language?.information?.parties,
    language?.information?.events,
    language?.information?.created_at,
  ];

  useEffect(() => {
    if (!search) getData();
  }, [page, filters, search, limit]);

  const getData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);

    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/Information?active=true&limit=${limit}&page=${page}`;
    context.userDetails.role === "user" &&
      (url += `&sectionId=${context.userDetails.sectionId}`);
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
      dataLength.current = data.data.numberOfActiveInformations;

      allPeople.current = data.data.informations.map((e) => e._id);
      setData(data.data.informations);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search) return;
    const timeOut = setTimeout(() => getSearchData(), 500);
    return () => clearTimeout(timeOut);
  }, [page, filters, search, limit]);

  const getSearchData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/Information/search?active=true&limit=${limit}&page=${page}`;
    context.userDetails.role === "user" &&
      (url += `&sectionId=${context.userDetails.sectionId}`);
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

  const openOptions = (e) => {
    e.stopPropagation();
    const div = document.querySelectorAll("div.table tbody td i.options");
    div.forEach((ele) => {
      if (ele !== e.target) {
        ele.classList.remove("active-div");
      }
    });
    e.target.classList.toggle("active-div");
  };

  const tableData = data?.map((e) => {
    return (
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
        <td>{e.subject}</td>
        <td>
          <Link to={`${e._id}`} className="name">
            {e.details}
          </Link>
        </td>
        <td> {e.credibility} </td>
        <td>
          {e.countryId?.name} / {e.cityId?.name} / {e.regionId?.name}
        </td>
        <td> {e.governmentId?.name} </td>
        <td>
          {e.people?.map((person, i) => {
            const arr = [];
            if (i < 3)
              arr.push(
                <Link
                  className="name"
                  key={i}
                  to={`/dashboard/people/${person._id}`}
                >
                  {e.people[i + 1]
                    ? `${person.firstName} ${person.surName} , `
                    : `${person.firstName} ${person.surName}`}
                </Link>
              );
            else if (i === 3) arr.push(<span key={i}>...</span>);
            return arr;
          })}
        </td>
        <td>{nextJoin(e.sources, "source_name")}</td>
        <td>{nextJoin(e.parties, "name")}</td>
        <td>{nextJoin(e.events, "name")}</td>
        <td> {date(e.createdAt)} </td>
        <td style={{ overflow: "visible" }}>
          <i onClick={openOptions} className="options fa-solid fa-ellipsis"></i>
          <div className="options has-visit">
            <div
              onClick={(event) => {
                event.stopPropagation();
                setOverlay(true);
                const allSelectors = document.querySelectorAll(".checkbox");
                allSelectors.forEach((e) => e.classList.remove("active"));
                setSelectedItems([e._id]);
              }}
              className="flex delete"
            >
              <i className="fa-solid fa-trash"></i>{" "}
              {language?.information?.delete}
            </div>
            <Link
              to={`/dashboard/update_info/${e._id}`}
              className="flex update"
            >
              <i className="fa-regular fa-pen-to-square"></i>
              {language?.information?.update}
            </Link>
            <Link to={`${e._id}`} className="flex visit">
              <i className="fa-solid fa-eye"> </i>{" "}
              {language?.information?.details}
            </Link>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <>
      <h1 className="title">{language?.header?.information}</h1>
      <Table
        header={header}
        searchInpPlacecholder={language?.information?.search_by_subject}
        loading={loading}
        page={{ page: page, setPage, dataLength: dataLength.current }}
        data={{ data: tableData, allData: allPeople.current }}
        items={{ slectedItems: slectedItems, setSelectedItems }}
        filters={{ filters, setFilters, search, setSearch }}
        overlay={{ overlay: overlay, setOverlay }}
        delete={{ getData, url: "Information", getSearchData }}
      />
    </>
  );
};

export default Informations;
