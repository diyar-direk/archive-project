import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { baseURL, Context, date } from "../../context/context";
import Table from "./../../components/table/Table";
import { Link } from "react-router-dom";
const Coordinates = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allPeople = useRef([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const limit = context?.limit;
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
    "coordinates",
    "place",
    "government",
    "street",
    "region",
    "source",
    "note",
    "create at",
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
      const data = await axios.get(url);
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
      const data = await axios.post(url, {
        search: search,
      });
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
        <td>{e.coordinates}</td>
        <td>
          {e.countryId.name} / {e.cityId.name}
        </td>
        <td> {e.governmentId?.name} </td>

        <td>{e.streetId?.name}</td>
        <td>{e.regionId?.name}</td>
        <td>{e.sources?.name}</td>
        <td>{e?.note}</td>
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
            <Link className="update fa-regular fa-pen-to-square"></Link>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <>
      <h1 className="title"> Coordinates </h1>
      <Table
        header={header}
        searchInpPlacecholder={`search by coordinates`}
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
