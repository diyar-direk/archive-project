import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import "./table.css";
import axios from "axios";
import { baseURL } from "../../context/context";
import { Context } from "./../../context/context";
import Filters from "./Filters";
import { useLocation } from "react-router-dom";
import Loading from "../loading/Loading";
import useLanguage from "../../hooks/useLanguage";
import TabelHeader from "./TabelHeader";
import TabelBody from "./TabelBody";
import Pagination from "./Pagination";
import ShowRows from "./ShowRows";
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
  const [columnsState, setColumnsState] = useState(columns);

  const header = useMemo(
    () =>
      columnsState.map(
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
    [columnsState]
  );

  const checkOne = useCallback(
    (elementId) => {
      if (!selectedItems.some((id) => id === elementId)) {
        setSelectedItems((prevSelected) => [...prevSelected, elementId]);
      } else {
        setSelectedItems((prevSelected) =>
          prevSelected.filter((item) => item !== elementId)
        );
      }
    },
    [setSelectedItems, selectedItems]
  );

  const rows = useMemo(
    () =>
      tabelData.map((row) => (
        <tr key={row._id}>
          {columnsState.map((column, i) =>
            i === 0 && selectable ? (
              <>
                <td key={i}>
                  <div
                    onClick={() => checkOne(row._id)}
                    className={`checkbox ${
                      selectedItems.some((id) => id === row._id) ? "active" : ""
                    }`}
                  ></div>
                </td>
                <td key={column.name} className={column.className}>
                  {column.getCell ? column.getCell(row) : row[column.name]}
                </td>
              </>
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
    [tabelData, columnsState, selectable, checkOne, selectedItems]
  );

  const context = useContext(Context);
  const token = context.userDetails.token;
  const [hasFltr, setHasFltr] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();

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
        <ShowRows columns={columnsState} setColumns={setColumnsState} />
      </form>

      <div className="table">
        <table className={loading || tabelData ? "loading" : ""}>
          <TabelHeader
            selectable={selectable}
            allData={allData}
            setSelectedItems={setSelectedItems}
            header={header}
          />
          <TabelBody loading={loading} rows={rows} />
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
      <Pagination
        dataLength={dataLength}
        currentPage={currentPage}
        loading={loading}
        setPage={setPage}
      />
    </>
  );
};

export default Table;
