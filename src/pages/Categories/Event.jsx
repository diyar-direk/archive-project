import React, { useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL, limit } from "../../context/context";
import axios from "axios";
import { date } from "../../context/context";
import SendData from "./../../components/response/SendData";
import "../../components/form.css";
const Event = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allPeople = useRef([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const response = useRef(true);
  
 

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
    const div = document.querySelector("form.addresses .select .inp.active");
    div && div.classList.remove("active");
  });

  const header = ["name", "creat at"];
  const [form, setForm] = useState({ name: ""});
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (update) {
      ref.current.focus();
      setForm(update);
    } else {
      setForm({ name: "" });
    }
  }, [update]);

  useEffect(() => {
    getData();
  }, [page]);



  const getData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/Events?active=true&limit=${limit}&page=${page}`;

    try {
      const data = await axios.get(url);
      dataLength.current = data.data.numberOfActiveEvents;
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
    
      try {
        const formData = { ...form };

        if (update) {
          const data = await axios.patch(
            `${baseURL}/Events/${update._id}`,
            formData
          );

          if (data.status === 200) {
            responseFun(true);
          }
          setUpdate(false);
        } else {
          const data = await axios.post(`${baseURL}/Events`, formData);
          if (data.status === 201) {
            responseFun(true);
          }
        }

        setForm({ name: "" });
        getData();
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else responseFun(false);
      }
  };



  return (
    <>
      {responseOverlay && (
        <SendData data={`country`} response={response.current} />
      )}
      <h1 className="title">Events</h1>
      <div className="flex align-start gap-20 wrap">
        <form onSubmit={handleSubmit} className="addresses">
          <h1>{update ? "update this country" : "add new Events"}</h1>
          <label htmlFor="name">Events name</label>
          <input
            ref={ref}
            className="inp"
            required
            placeholder="please write a Events name"
            value={form.name}
            type="text"
            onInput={(e) => setForm({ ...form, name: e.target.value })}
            id="name"
          />

          
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
          <form className="flex center gap-10 table-search">
            <input type="text" placeholder="search by name" required />
            <button className="btn"> search</button>
          </form>
          <Table
            header={header}
            loading={loading}
            page={{ page: page, setPage, dataLength: dataLength.current }}
            data={{ data: tableData, allData: allPeople.current }}
            items={{ slectedItems: slectedItems, setSelectedItems }}
            overlay={{ overlay: overlay, setOverlay }}
            delete={{ setData, url: "Events", getData }}
          />
        </div>
      </div>
    </>
  );
};

export default Event;