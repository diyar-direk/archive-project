import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { baseURL, Context, date } from "../../context/context";
import Table from "./../../components/table/Table";
import { Link } from "react-router-dom";
import "./profile.css";
const People = (props) => {
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
    gender: "",
    maritalStatus: "",
    country: "",
    government: "",
    city: "",
    villag: "",
    date: {
      from: "",
      to: "",
    },
  });

  const [search, setSearch] = useState("");

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
    "create at",
  ];

  useEffect(() => {
    if (!search) getData();
  }, [page, filters, search, limit]);

  const getData = async () => {
    setLoading(true);
    setData([]);
    !props?.workSpace && setSelectedItems([]);

    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/people?active=true&limit=${limit}&page=${page}`;
    const keys = Object.keys(filters);
    !props?.workSpace &&
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
      dataLength.current = data.data.numberOfActivePeople;

      allPeople.current = !props?.workSpace
        ? data.data.people.map((e) => e._id)
        : data.data.people.map((e) => e);
      setData(data.data.people);
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
    !props?.workSpace && setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/people/search?active=true&limit=${limit}&page=${page}`;
    const keys = Object.keys(filters);
    !props?.workSpace &&
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
      allPeople.current = data.data.data.map((e) =>
        !props?.workSpace ? e._id : e
      );
      setData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const checkOne = (e, element, status = false) => {
    e.target.classList.toggle("active");
    if (e.target.classList.contains("active")) {
      if (props?.workSpace && !status) {
        props.people.setForm({
          ...props.people.form,
          people: [...new Set([...props.people.form.people, element])],
        });
      } else setSelectedItems((prevSelected) => [...prevSelected, element]);
      const allActiveSelectors = document.querySelectorAll(
        "td .checkbox.active"
      );
      const allSelectors = document.querySelectorAll("td .checkbox");
      if (allSelectors.length === allActiveSelectors.length)
        document.querySelector("th .checkbox").classList.add("active");
    } else {
      if (props?.workSpace) {
        props?.people?.setForm({
          ...props.people.form,
          people: props.people.form.people.filter(
            (item) => item._id !== element._id
          ),
        });
      } else
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
    const status = props?.people?.form?.people?.some(
      (person) => person._id === e._id
    );

    return (
      <tr key={e._id}>
        <td>
          <div
            onClick={(target) => {
              target.stopPropagation();
              checkOne(target, !props?.workSpace ? e._id : e, status);
            }}
            className={`${status ? "active" : ""} checkbox`}
          ></div>
        </td>
        <td>
          <Link to={`/people/${e._id}`}>
            {e.photo ? (
              <img src={e.photo} className="photo" alt="" />
            ) : (
              <i className="photo fa-solid fa-user"></i>
            )}
          </Link>
        </td>
        <td>
          <Link to={`/people/${e._id}`} className="name">
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
        <td> {date(e.createdAt)} </td>
        <td>
          {!props?.workSpace && (
            <>
              <i
                onClick={openOptions}
                className="options fa-solid fa-ellipsis"
              ></i>
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
            </>
          )}
        </td>
      </tr>
    );
  });

  return (
    <>
      {!props?.workSpace && <h1 className="title"> people </h1>}
      <Table
        header={header}
        workSpace={{ workSpace: props?.workSpace, infoForm: props?.people }}
        loading={loading}
        page={{ page: page, setPage, dataLength: dataLength.current }}
        data={{ data: tableData, allData: allPeople.current }}
        items={{ slectedItems: slectedItems, setSelectedItems }}
        filters={{ filters, setFilters, search, setSearch }}
        overlay={{ overlay: overlay, setOverlay }}
        delete={{ getData, url: "people", getSearchData }}
      />
    </>
  );
};

export default People;
