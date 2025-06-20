import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { baseURL, Context, date } from "../../context/context";
import Table from "./../../components/table/Table";
import { Link } from "react-router-dom";
import "./profile.css";
import MediaComponent from "../../components/MediaComponent";
import useLanguage from "../../hooks/useLanguage";
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
const columns = [
  { name: "id", headerName: "ID", hidden: true },
  {
    name: "image",
    headerName: "profile",
    getCell: (e) => (
      <Link to={`/dashboard/people/${e._id}`} className="center">
        {e.image ? (
          <MediaComponent
            className="photo"
            src={e.image}
            type="image"
            showUserIcon
          />
        ) : (
          <i className="photo fa-solid fa-user"></i>
        )}
      </Link>
    ),
  },
  {
    name: "name",
    headerName: "name",
    className: "name",
    sort: true,
    getCell: (row) => (
      <Link to={`/dashboard/people/${row._id}`} className="name">
        {row.firstName} {row.fatherName} {row.surName}
      </Link>
    ),
  },
  { name: "gender", headerName: "gender" },
  { name: "motherName", headerName: "motherName" },
  { name: "maritalStatus", headerName: "maritalStatus" },
  { name: "occupation", headerName: "occupation" },
  {
    name: "birthDate",
    headerName: "birthDate",
    getCell: (e) => date(e.birthDate),
  },
  {
    name: "placeOfBirth",
    headerName: "placeOfBirth",
  },
  {
    name: "country",
    headerName: "country",
    getCell: (e) => e.countryId?.name,
  },
  {
    name: "city",
    headerName: "city",
    getCell: (e) => e.cityId?.name,
    hidden: true,
  },
  {
    name: "government",
    headerName: "government",
    getCell: (e) => e.governmentId?.name,
    hidden: true,
  },
  {
    name: "phone",
    headerName: "phone",
  },
  {
    name: "email",
    headerName: "email",
  },
  {
    name: "createdAt",
    headerName: "createdAt",
    sort: true,
    getCell: (row) => date(row.createdAt),
  },
  {
    name: "options",
    headerName: "options",
    className: "visible",
    getCell: (e) => (
      <>
        <i onClick={openOptions} className="options fa-solid fa-ellipsis"></i>
        <div className="options has-visit">
          <Link
            to={`/dashboard/update_person/${e._id}`}
            className="flex update"
          >
            <i className="fa-regular fa-pen-to-square"></i>
            language?.table?.update
          </Link>
          <Link to={`${e._id}`} className="flex visit">
            <i className="fa-solid fa-circle-user"></i>
            language?.table?.visit
          </Link>
        </div>
      </>
    ),
  },
];
const People = () => {
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
    language?.people?.name,
    language?.people?.gender,
    language?.people?.motherName,
    language?.people?.marital_status,
    language?.people?.occupation,
    language?.people?.place_date_of_birth,
    language?.people?.place_of_residence,
    language?.people?.government,
    language?.people?.phone,
    language?.people?.email,
    language?.people?.created_at,
  ];

  useEffect(() => {
    if (!search) getData();
  }, [page, filters, search, limit]);

  const getData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);

    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/people?active=true&limit=${limit}&page=${page}`;
    const params = new URLSearchParams();

    context.userDetails.role === "user" &&
      params.append("sectionId", context.userDetails.sectionId);

    Object.keys(filters).forEach((key) => {
      if (key !== "date" && filters[key]) {
        params.append(
          filters[key]._id ? `${key}Id` : key,
          filters[key]._id || filters[key]
        );
      }
    });

    filters.date.from && filters.date.to
      ? (url += `&createdAt[gte]=${filters.date.from}&createdAt[lte]=${filters.date.to}`)
      : filters.date.from && !filters.date.to
      ? (url += `&createdAt[gte]=${filters.date.from}`)
      : !filters.date.from &&
        filters.date.to &&
        (url += `&createdAt[lte]=${filters.date.to}`);
    url += `&${params.toString()}`;

    try {
      const data = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dataLength.current = data.data.numberOfActivePeople;

      allPeople.current = data.data.people.map((e) => e._id);
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

    setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/people/search?active=true&limit=${limit}&page=${page}`;
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  return (
    <>
      <h1 className="title"> {language?.header?.people} </h1>
      <Table
        columns={columns}
        selectable
        loading={loading}
        currentPage={page}
        setPage={setPage}
        allData={allPeople.current}
        selectedItems={slectedItems}
        setSelectedItems={setSelectedItems}
        filters={{ filters, setFilters, search, setSearch }}
        getData={getData}
        getSearchData={getSearchData}
        deleteUrl="people"
        dataLength={dataLength.current}
        tabelData={data}
      />
    </>
  );
};

export default People;
