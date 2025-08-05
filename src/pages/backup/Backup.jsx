import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import "./backup.css";
import Loading from "../../components/loading/Loading";
import useLanguage from "../../hooks/useLanguage";
import TabelFilterDiv from "../../components/tabelFilterData/TabelFilterDiv";
import { dateFormatter } from "./../../utils/dateFormatter";
const columns = [
  { name: "root", headerName: (lang) => lang?.backUps?.root },
  {
    name: "createdAt",
    headerName: (lang) => lang?.backUps?.created_at,
    sort: true,
    getCell: (e) => dateFormatter(e.createdAt, "fullDate"),
  },
  {
    name: "useBackup",
    headerName: (lang) => lang?.backUps?.use_this_backup,
    getCell: (e, setOverlay, lang) => (
      <p
        onClick={() => {
          setOverlay({ isActive: true, root: e });
        }}
        style={{ color: "#27c12d", fontWeight: "500" }}
        className="c-pointer text-capitalize"
      >
        {lang?.backUps?.use_this_backup}
      </p>
    ),
    type: "backup",
  },
];
const Backup = () => {
  const [data, setData] = useState([]);
  const dataLength = useRef(0);
  const [page, setPage] = useState(1);
  const allPeople = useRef([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const token = context.userDetails.token;
  const limit = context?.limit;
  const { language } = useLanguage();
  const [sort, setSort] = useState({});
  const [openFiltersDiv, setOpenFiltersDiv] = useState(false);
  const [filters, setFilters] = useState({
    date: {
      from: "",
      to: "",
    },
  });

  const getData = useCallback(async () => {
    setLoading(true);
    setData([]);
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("page", page);
    if (filters.date.from) params.append("createdAt[gte]", filters.date.from);
    if (filters.date.to) params.append("createdAt[lte]", filters.date.to);
    if (Object.keys(sort).length) {
      const sortParams = Object.values(sort)
        .map((v) => v)
        .join(",");
      params.append("sort", sortParams);
    }
    try {
      const { data } = await axios.get(`${baseURL}/backup/roots`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      dataLength.current = data.numberOfroots;
      allPeople.current = data.data?.map((e) => e._id);
      setData(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, filters, limit, sort]);

  useEffect(() => {
    getData();
  }, [page, filters, limit, sort, getData]);

  const [dataLoading, setDataLoading] = useState(false);
  const [form, setForm] = useState({
    username: context.userDetails.username,
    password: "",
  });

  const [overlay, setOverlay] = useState({});

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
  const [beforeFiltering, setBeforeFiltering] = useState({
    date: { from: "", to: "" },
  });

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
                <h1>
                  {
                    language?.backUps
                      ?.which_operation_would_you_like_to_proceed_with
                  }
                </h1>
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
                    {language?.backUps?.replace}
                  </div>
                  <div
                    onClick={() =>
                      setOverlay({ ...overlay, form: true, type: "restore" })
                    }
                    className="delete-all save overlay-btn"
                  >
                    <i className="fa-solid fa-window-restore"></i>
                    {language?.backUps?.restore}
                  </div>
                </div>
              </>
            ) : overlay.form && !overlay.showStatus ? (
              <form onSubmit={handleSubmit} className="backup center gap-10">
                <input
                  autoFocus
                  type="password"
                  required
                  placeholder={language?.backUps?.please_your_enter_password}
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
                  <span>{language?.backUps?.warning}</span>
                  {language?.backUps?.about_deleting_database}
                </h1>
                <div className="flex w-100 center gap-20">
                  <div
                    onClick={handleYes}
                    className="save delete-all overlay-btn"
                  >
                    <i className="fa-solid fa-check"></i>
                    {language?.backUps?.accept}
                  </div>
                  <div
                    onClick={() => {
                      setOverlay({});
                    }}
                    className="delete-all overlay-btn"
                  >
                    <i className="fa-solid fa-ban"></i>
                    {language?.backUps?.cancel}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <h1 className="title">{language?.header?.backUps}</h1>
      <button
        onClick={createBackup}
        className="center create-backup gap-2 btn save"
      >
        {language?.backUps?.create_new_backup}
        <i className="fa-solid fa-plus"></i>
      </button>
      <div className="flex-1">
        {openFiltersDiv && (
          <TabelFilterDiv
            setFilter={setFilters}
            setIsopen={setOpenFiltersDiv}
            setPage={setPage}
            beforeFiltering={beforeFiltering}
            setBeforeFiltering={setBeforeFiltering}
          />
        )}
        <Table
          columns={columns}
          loading={loading}
          currentPage={page}
          setPage={setPage}
          allData={allPeople.current}
          getData={getData}
          dataLength={dataLength.current}
          tabelData={data}
          setSort={setSort}
          openFiltersDiv={openFiltersDiv}
          setOpenFiltersDiv={setOpenFiltersDiv}
          setBackupOverlay={setOverlay}
        />
      </div>
    </>
  );
};

export default Backup;
