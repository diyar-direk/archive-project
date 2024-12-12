import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseURL, limit } from "../../context/context";
import Table from "./../../components/table/Table";

const People = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const [fltr, setFltr] = useState(false);

  const header = [
    "name",
    "gender",
    "mother Name",
    "marital status",
    "occupation",
    "place of birth",
    "birth date",
    "country",
    "city",
    "street",
  ];

  useEffect(() => {
    getPeople();
  }, [page]);

  const getPeople = async () => {
    try {
      const data = await axios.get(
        `${baseURL}/api/people?active=true&limit=${limit}&page=${page}`
      );
      dataLength.current = data.data.numberOfActivePeople;
      console.log(data.data);
      setData(data.data.people);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="title"> people </h1>

      <form className="flex center gap-10 table-search">
        <input type="text" placeholder="search by name" />
        <input type="text" placeholder="search by name" />
        <input type="text" placeholder="search by name" />
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
        data={data}
        dataLength={dataLength.current}
        setPage={setPage}
        page={page}
        hasFltr={fltr}
        setHasFltr={setFltr}
      />
    </>
  );
};

export default People;
