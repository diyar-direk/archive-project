import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import { date } from "../../context/context";
import "./backup.css";
import Loading from "../../components/loading/Loading";
const Backup = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const context = useContext(Context);
  const [form, setForm] = useState({
    username: context.userDetails.username,
    password: "",
  });

  const limit = context?.limit;
  const token = context.userDetails.token;
  const [overlay, setOverlay] = useState({});
  const [filters, setFilters] = useState({
    date: {
      from: "",
      to: "",
    },
  });

  const header = ["root", "creat at"];

  useEffect(() => {
    getData();
  }, [page, limit, filters]);

  const getData = async () => {
    setLoading(true);
    setData([]);
    let url = `${baseURL}/backup/roots?limit=${limit}&page=${page}&sort=-createdAt`;
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
      dataLength.current = data.data.numberOfroots;

      setData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const countryData = data?.map((e) => (
    <tr key={e._id}>
      <td>{e.root}</td>
      <td>{date(e.createdAt)}</td>
      <td>
        <p
          onClick={() => {
            setOverlay({ isActive: true, root: e });
          }}
          style={{ color: "#27c12d", fontWeight: "500" }}
          className="c-pointer text-capitalize"
        >
          use this backup
        </p>
      </td>
    </tr>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/Users/login`, form);
      if (res.status === 200) {
        setOverlay({ ...overlay, showStatus: true });
        setForm({ ...form, password: "" });
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        alert("wrong username or password");
      } else alert("network error");
    }
  };

  const createBackup = async (e) => {
    const progresDiv = document.querySelector(".progres");
    progresDiv && (progresDiv.style.display = "flex");
    try {
      e.target.disabled = true;
      const response = await fetch(`${baseURL}/backup`, {
        method: "POST",
        headers: { Authorization: "Bearer " + context.userDetails.token },
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        } else if (
          decoder
            .decode(value, {
              stream: true,
            })
            .toLowerCase()
            .includes("error")
        ) {
          alert(
            decoder.decode(value, {
              stream: true,
            })
          );
          break;
        }

        document.querySelector(".progres > div > h4").innerHTML =
          decoder.decode(value, {
            stream: true,
          });
      }
      document.querySelector(".progres > div > span ").style.width = "100%";
      document.querySelector(".progres > div > h4").style.color = "white";
      document.querySelector(".progres > div > h4").innerHTML =
        "completed successfully";
    } catch (err) {
      alert(err);
    } finally {
      setTimeout(() => {
        document.querySelector(".progres > div > span ").style.width = "0%";
        progresDiv && (progresDiv.style.display = "none");
        document.querySelector(".progres > div > h4").style.color =
          "var(--font-color)";
        getData();
        e.target.disabled = false;
      }, 2000);
    }
  };

  const handleYes = async (e) => {
    e.stopPropagation();

    try {
      setDataLoading(true);
      setOverlay({});

      const response = await fetch(`${baseURL}/backup/${overlay.type}`, {
        method: "POST",
        body: JSON.stringify({ backupFolderPath: overlay.root.root }),
        headers: {
          Authorization: "Bearer " + context.userDetails.token,
          "Content-Type": "application/json",
        },
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        } else if (
          decoder
            .decode(value, {
              stream: true,
            })
            .toLowerCase()
            .includes("error")
        ) {
          alert(
            decoder.decode(value, {
              stream: true,
            })
          );
          break;
        }
        document.querySelector("div.loading.overlay >h1").innerHTML =
          decoder.decode(value, {
            stream: true,
          });
      }
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setDataLoading(false);
      getData();
    }
  };

  return (
    <>
      {dataLoading && <Loading />}
      {overlay?.isActive && (
        <div
          onClick={() => {
            setOverlay({});
          }}
          className="overlay"
        >
          <div onClick={(e) => e.stopPropagation()}>
            {!overlay.form && !overlay.showStatus ? (
              <>
                <h1>which operation would you like to proceed with</h1>
                <p
                  className="font-color"
                  style={{ marginBottom: "10px", fontWeight: "500" }}
                >
                  {overlay.root.root}
                </p>
                <div className="flex gap-10 wrap">
                  <div
                    onClick={() =>
                      setOverlay({ ...overlay, form: true, type: "replace" })
                    }
                    className="btn overlay-btn"
                  >
                    <i className="fa-solid fa-repeat"></i>
                    replace
                  </div>
                  <div
                    onClick={() =>
                      setOverlay({ ...overlay, form: true, type: "restore" })
                    }
                    className="delete-all save overlay-btn"
                  >
                    <i className="fa-solid fa-window-restore"></i>
                    restore
                  </div>
                </div>
              </>
            ) : overlay.form && !overlay.showStatus ? (
              <form onSubmit={handleSubmit} className="backup center gap-10">
                <input
                  autoFocus
                  type="password"
                  required
                  placeholder="please write your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  title="submit"
                  className="btn fa-solid fa-paper-plane"
                ></button>
              </form>
            ) : (
              <div className="flex warning center flex-direction gap-10 wrap">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <h1>
                  <span>warning</span> this might delete or modify the database
                </h1>
                <div className="flex w-100 center gap-20">
                  <div
                    onClick={handleYes}
                    className="save delete-all overlay-btn"
                  >
                    <i className="fa-solid fa-check"></i> yes
                  </div>
                  <div
                    onClick={() => {
                      setOverlay({});
                    }}
                    className="delete-all overlay-btn"
                  >
                    <i className="fa-solid fa-ban"></i> no
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <h1 className="title">back up</h1>
      <button
        onClick={createBackup}
        className="center create-backup gap-2 btn save"
      >
        create backup <i className="fa-solid fa-plus"></i>
      </button>
      <div className="flex-1">
        <Table
          hideActionForUser={true}
          header={header}
          loading={loading}
          page={{ page: page, setPage, dataLength: dataLength.current }}
          data={{ data: countryData }}
          filters={{ filters, setFilters }}
        />
      </div>
    </>
  );
};

export default Backup;
