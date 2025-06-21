import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { baseURL, Context, date } from "../../context/context";
import Table from "./../../components/table/Table";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
const Coordinates = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allPeople = useRef([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const limit = context?.limit;
  const { language } = useLanguage();
  const [filters, setFilters] = useState({
    country: "",
    government: "",
    city: "",
    villag: "",
    region: "",
    date: {
      from: "",
      to: "",
    },
  });

  const [search, setSearch] = useState("");

  const header = [
    language?.coordinates?.coordinates,
    language?.coordinates?.adress,
    language?.coordinates?.government,
    language?.coordinates?.street,
    language?.coordinates?.region,
    language?.coordinates?.source,
    language?.coordinates?.notes,
    language?.coordinates?.created_at,
  ];

  useEffect(() => {
    if (!search) getData();
  }, [page, filters, search, limit]);

  const getData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);

    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/Coordinates?active=true&limit=${limit}&page=${page}`;
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

      dataLength.current = data.data.numberOfActiveCoordinates;

      allPeople.current = data.data.data.map((e) => e._id);
      setData(data.data.data);
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
    let url = `${baseURL}/Coordinates/search?active=true&limit=${limit}&page=${page}`;
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
        <td>
          <Link className="name" to={`/dashboard/coordinate/${e._id}`}>
            {e.coordinates}
          </Link>
        </td>
        <td>
          {e.countryId.name} / {e.cityId.name}
        </td>
        <td> {e.governmentId?.name} </td>

        <td>{e.streetId?.name}</td>
        <td>{e.regionId?.name}</td>
        <td>{e.sources?.source_name}</td>
        <td>{e?.note}</td>
        <td>{date(e.createdAt)}</td>
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
              <i className="fa-solid fa-trash"></i>
              {language?.coordinates?.delete}
            </div>
            <Link
              to={`/dashboard/coordinates/${e._id}`}
              className="flex update"
            >
              <i className="fa-regular fa-pen-to-square"></i>
              {language?.coordinates?.update}
            </Link>
            <Link to={`/dashboard/coordinate/${e._id}`} className="flex visit">
              <i className="fa-solid fa-eye"> </i>
              {language?.coordinates?.details}
            </Link>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <>
      <h1 className="title"> {language?.header?.coordinates} </h1>
      <Table
        header={header}
        searchInpPlacecholder={language?.coordinates?.search_by_coordinates}
        loading={loading}
        page={{ page: page, setPage, dataLength: dataLength.current }}
        data={{ data: tableData, allData: allPeople.current }}
        items={{ slectedItems: slectedItems, setSelectedItems }}
        filters={{ filters, setFilters, search, setSearch }}
        overlay={{ overlay: overlay, setOverlay }}
        delete={{ getData, url: "Coordinates", getSearchData }}
      />
    </>
  );
};

export default Coordinates;
