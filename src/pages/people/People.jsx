import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseURL, date, limit } from "../../context/context";
import Table from "./../../components/table/Table";
import { Link } from "react-router-dom";
import "./profile.css"
const People = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const [fltr, setFltr] = useState(false);
  const allPeople = useRef([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    gender: "",
    country: "",
    government: "",
    city: "",
    villag: "",
  });

  const header = [
    "",
    "name",
    "gender",
    "mother Name",
    "marital status",
    "occupation",
    "place & date of birth",
    "Place of residence",
    "government",
    "phone",
    "email",
  ];

  useEffect(() => {
    getData();
  }, [page, filters]);

  const getData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);

    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/people?active=true&limit=${limit}&page=${page}`;
    const keys = Object.keys(filters);
    keys.forEach(
      (key) =>
        filters[key] &&
        (url += `&${filters[key]._id ? key + "Id" : key}=${
          filters[key]._id ? filters[key]._id : filters[key]
        }`)
    );

    try {
      const data = await axios.get(url);
      dataLength.current = data.data.numberOfActivePeople;

      allPeople.current = data.data.people.map((e) => e._id);
      setData(data.data.people);
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
          <Link to={`${e._id}`}>
            {e.photo ? (
              <img src={e.photo} className="photo" alt="" />
            ) : (
              <i className="photo fa-solid fa-user"></i>
            )}
          </Link>
        </td>
        <td>
          <Link to={`${e._id}`} className="name">
            {e.firstName} {e.fatherName} {e.surName}
          </Link>
        </td>
        <td> {e.gender} </td>
        <td> {e.motherName} </td>
        <td> {e.maritalStatus} </td>
        <td> {e.occupation} </td>
        <td>
          {e.placeOfBirth} {date(e.birthDate)}
        </td>
        <td>
          {e.countryId.name} / {e.cityId.name}
        </td>
        <td> {e.governmentId.name} </td>
        <td> {e.phone} </td>
        <td> {e.email} </td>
        <td>
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
              <i className="fa-solid fa-trash"></i> delete
            </div>
            <Link to={`${e._id}`} className="flex update">
              <i className="fa-regular fa-pen-to-square"></i>
              update
            </Link>
            <Link to={`${e._id}`} className="flex visit">
              <i className="fa-solid fa-circle-user"></i> visit
            </Link>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <>
      <h1 className="title"> people </h1>

      <form className="flex center gap-10 table-search">
        <input type="text" placeholder="search by name" required />
        <button className="btn"> search</button>
        <i
          onClick={(e) => {
            setFltr(true);
            e.stopPropagation();
          }}
          className="fa-solid fa-sliders filter"
        ></i>
      </form>

      <Table
        header={header}
        loading={loading}
        page={{ page: page, setPage, dataLength: dataLength.current }}
        data={{ data: tableData, allData: allPeople.current }}
        items={{ slectedItems: slectedItems, setSelectedItems }}
        hasFltr={{ fltr: fltr, setFltr }}
        filters={{ filters, setFilters }}
        overlay={{ overlay: overlay, setOverlay }}
      />
    </>
  );
};

export default People;
