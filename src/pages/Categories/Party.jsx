import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import { date } from "../../context/context";
import SendData from "./../../components/response/SendData";
import "../../components/form.css";
import Loading from "../../components/loading/Loading";
const Party = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allPeople = useRef([]);
  const [slectedItems, setSelectedItems] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const response = useRef(true);
  const context = useContext(Context);
  const limit = context?.limit;
  const [responseOverlay, setResponseOverlay] = useState(false);
  const ref = useRef(null);
  const [formLoading, setFormLoading] = useState(false);
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
  const [form, setForm] = useState({ name: "" });
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
  }, [page , limit]);

  const getData = async () => {
    setLoading(true);
    setData([]);
    setSelectedItems([]);
    document.querySelector("th .checkbox")?.classList.remove("active");
    let url = `${baseURL}/Parties?active=true&limit=${limit}&page=${page}`;

    try {
      const data = await axios.get(url);

      dataLength.current = data.data.numberOfActiveParties;
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
    setFormLoading(true);
    try {
      const formData = { ...form };
      console.log(formData);

      if (update) {
        const data = await axios.patch(
          `${baseURL}/Parties/${update._id}`,
          formData
        );

        if (data.status === 200) {
          responseFun(true);
        }
        setUpdate(false);
      } else {
        const data = await axios.post(`${baseURL}/Parties`, formData);
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
    finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      {responseOverlay && (
        <SendData data={`country`} response={response.current} />
      )}
           {formLoading && <Loading />}
      <h1 className="title">Party</h1>
      <div className="flex align-start gap-20 wrap">
        <form onSubmit={handleSubmit} className="addresses">
          <h1>{update ? "update this country" : "add new Party"}</h1>
          <label htmlFor="name">Party name</label>
          <input
            ref={ref}
            className="inp"
            required
            placeholder="please write a Party name"
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
          <Table
            header={header}
            loading={loading}
            page={{ page: page, setPage, dataLength: dataLength.current }}
            data={{ data: tableData, allData: allPeople.current }}
            items={{ slectedItems: slectedItems, setSelectedItems }}
            overlay={{ overlay: overlay, setOverlay }}
            delete={{ url: "Parties", getData }}
          />
        </div>
      </div>
    </>
  );
};

export default Party;
