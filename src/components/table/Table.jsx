import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import "./table.css";
import axios from "axios";
import { baseURL } from "../../context/context";
import { Context } from "./../../context/context";
import Filters from "./Filters";
import { useLocation } from "react-router-dom";
import Loading from "../loading/Loading";
import useLanguage from "../../hooks/useLanguage";
const Table = ({
  tabelData,
  allData,
  setSelectedItems,
  selectedItems,
  selectable,
  columns = [],
  dataLength,
  loading = true,
  currentPage,
  setPage,
  deleteUrl,
  getData,
  getSearchData,
  ...props
}) => {
  const [overlay, setOverlay] = useState(false);
  const header = useMemo(
    () =>
      columns.map(
        (th) =>
          !th.hidden && (
            <th key={th.headerName}>
              {th.headerName}
              {th.sort && (
                <i
                  className="fa-solid fa-chevron-down sort"
                  onClick={(e) =>
                    e.target.parentElement.classList.toggle("sort")
                  }
                ></i>
              )}
            </th>
          )
      ),
    [columns]
  );

  const checkOne = useCallback(
    (e, element) => {
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
    },
    [setSelectedItems]
  );

  const rows = useMemo(
    () =>
      tabelData.map((row) => (
        <tr key={row._id}>
          {columns.map((column, i) =>
            i === 0 && selectable ? (
              <td key={i}>
                <div
                  onClick={(target) => {
                    target.stopPropagation();
                    checkOne(target, row);
                  }}
                  className={`checkbox`}
                ></div>
              </td>
            ) : (
              !column.hidden && (
                <td key={column.name} className={column.className}>
                  {column.getCell ? column.getCell(row) : row[column.name]}
                </td>
              )
            )
          )}
        </tr>
      )),
    [tabelData, columns, selectable, checkOne]
  );

  const context = useContext(Context);
  const limit = context?.limit;
  const token = context.userDetails.token;
  const [hasFltr, setHasFltr] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();

  const createPags = useMemo(() => {
    const pages = Math.ceil(dataLength / limit);
    if (pages <= 1) return;
    let h3Pages = [];
    for (let i = 0; i < pages; i++) {
      h3Pages.push(
        <h3
          onClick={(e) => !loading && updateData(e)}
          data-page={i + 1}
          key={i}
          className={`${i === 0 ? "active" : ""}`}
        >
          {i + 1}
        </h3>
      );
    }
    return h3Pages;
  }, [limit, dataLength]);

  function updateData(e) {
    if (currentPage !== +e.target.dataset.page) {
      setPage(+e.target.dataset.page);
    }
  }

  useEffect(() => {
    const pages = document.querySelectorAll(".pagination h3");
    if (pages) {
      pages.forEach((e) => e.classList.remove("active"));

      pages[currentPage - 1]?.classList.add("active");
    }
  }, [currentPage]);

  useEffect(() => {
    const handleClick = () => {
      if (overlay) {
        setOverlay(false);
        if (selectedItems.length < 2) setSelectedItems([]);
      }
      hasFltr && setHasFltr(false);
      const optionDiv = document.querySelector(
        "div.table tbody td i.options.active-div"
      );
      optionDiv && optionDiv.classList.remove("active-div");
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [overlay, hasFltr, selectedItems]);

  const checkAll = (e) => {
    const allActiveSelectors = document.querySelectorAll("td .checkbox.active");
    const allSelectors = document.querySelectorAll("td .checkbox");

    if (
      allActiveSelectors.length >= 0 &&
      allActiveSelectors.length !== allSelectors.length
    ) {
      allSelectors.forEach((e) => e.classList.add("active"));
      e.target.classList.add("active");
      setSelectedItems(allData);
    } else {
      allSelectors.forEach((e) => e.classList.remove("active"));
      e.target.classList.remove("active");
      setSelectedItems([]);
    }
  };

  const deleteData = async () => {
    setOverlay(false);
    setDataLoading(true);
    try {
      if (selectedItems.length > 1) {
        const data = await axios.patch(
          `${baseURL}/${deleteUrl}/deActivate-many`,
          { ids: selectedItems },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (data.status === 200) {
          setOverlay(false);
          if (
            allData.length - selectedItems.length === 0 &&
            currentPage !== 1
          ) {
            setPage(1);
          } else props.filters.search ? getSearchData() : getData();
        }
      } else {
        const data = await axios.patch(
          `${baseURL}/${deleteUrl}/deActivate/${selectedItems[0]}`,
          [],
          { headers: { Authorization: "Bearer " + token } }
        );
        if (data.status === 200) {
          setOverlay(false);
          if (
            allData.length - selectedItems.length === 0 &&
            currentPage !== 1
          ) {
            setPage(1);
          } else props.filters.search ? getSearchData() : getData();
        }
      }
    } catch (error) {
      console.log(error);
      alert("somthing want error");
    } finally {
      setDataLoading(false);
    }
  };
  const updateLimit = (e) => {
    if (parseInt(e.target.value) !== limit) {
      context?.setLimit(parseInt(e.target.value));
      setPage(1);
    }
  };
  const [beforSubmit, setBeforeSubmit] = useState("");

  const [data, setData] = useState({
    data: {
      Countries: [],
      Cities: [],
      Governments: [],
      Villages: [],
      Regions: [],
      Streets: [],
    },
    searchData: {
      Countries: [],
      Cities: [],
      Governments: [],
      Villages: [],
      Regions: [],
      Streets: [],
    },
    dataWithProps: {
      Countries: [],
      Cities: [],
      Governments: [],
      Villages: [],
      Regions: [],
      Streets: [],
    },
  });

  return (
    <>
      {dataLoading && <Loading />}
      {hasFltr && (
        <Filters
          fltr={{
            fltr: props.filters?.filters,
            setFilters: props.filters?.setFilters,
          }}
          dataArray={{ data, setData }}
          hasFltr={{ hasFltr, setHasFltr }}
          page={{ setPage }}
        />
      )}

      {overlay && (
        <div className="overlay">
          <div onClick={(e) => e.stopPropagation()}>
            <h1>
              {language?.table?.are_you_sure_delete}({selectedItems.length})
              {language?.table?.items}
            </h1>
            <div className="flex gap-10 wrap">
              <div onClick={deleteData} className="delete-all overlay-btn">
                <i className="fa-solid fa-trash"></i> {language?.table?.delete}
              </div>
              <div
                onClick={() => {
                  selectedItems.length === 1 && setSelectedItems([]);
                  setOverlay(false);
                }}
                className="delete-all cencel overlay-btn"
              >
                <i className="fa-solid fa-ban"></i> {language?.table?.cancel}
              </div>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.filters.setSearch(beforSubmit);
          setPage(1);
        }}
        className="flex align-center justify-end gap-10 table-search"
      >
        {!location.pathname.includes("/backup") && (
          <>
            <input
              type="text"
              placeholder={`${
                props.searchInpPlacecholder
                  ? props.searchInpPlacecholder
                  : language?.table?.serach_by_name
              }`}
              value={beforSubmit}
              onInput={(e) => {
                e.target.value === "" && props.filters.setSearch("");
                setBeforeSubmit(e.target.value);
              }}
              required
            />

            <button className="btn center gap-10">
              <span>{language?.table?.search_btn}</span>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </>
        )}
        <i
          title="filters"
          onClick={(e) => {
            setHasFltr(true);
            e.stopPropagation();
          }}
          className="fa-solid fa-sliders filter"
        ></i>
      </form>
      <div className="table">
        <table className={loading || tabelData ? "loading" : ""}>
          <thead>
            <tr>
              {selectable && (
                <th>
                  {allData.length > 0 && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        checkAll(e);
                      }}
                      className="checkbox select-all"
                    ></div>
                  )}
                </th>
              )}
              {header}
              <th>
                <select onChange={updateLimit} value={limit}>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody className={loading || tabelData ? "relative" : ""}>
            {loading ? (
              <div className="table-loading"> {language?.table?.loading}</div>
            ) : rows.length > 0 ? (
              <>{rows}</>
            ) : (
              <div className="table-loading">{language?.table?.no_results}</div>
            )}
          </tbody>
        </table>
      </div>

      {selectedItems?.length > 0 && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOverlay(true);
          }}
          className="gap-10 delete-all"
        >
          <i className="fa-solid fa-trash"></i> {language?.table?.delete} (
          {selectedItems.length}){language?.table?.items}
        </div>
      )}
      <div className="pagination flex">{createPags}</div>
    </>
  );
};

export default Table;
