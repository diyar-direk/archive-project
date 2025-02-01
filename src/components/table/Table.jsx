import React, { memo, useContext, useEffect, useState } from "react";
import "./table.css";
import axios from "axios";
import { baseURL } from "../../context/context";
import { Context } from "./../../context/context";
import Filters from "./Filters";
import { useLocation } from "react-router-dom";
const Table = (props) => {
  const header = props.header.map((th, i) => <th key={i}> {th} </th>);
  const context = useContext(Context);
  const limit = context?.limit;
  const token = context.userDetails.token;
  const [hasFltr, setHasFltr] = useState(false);
  const location = useLocation();

  const createPags = (limit, dataLength) => {
    const pages = Math.ceil(dataLength / limit);
    if (pages <= 1) return;
    let h3Pages = [];
    for (let i = 0; i < pages; i++) {
      h3Pages.push(
        <h3
          onClick={(e) => !props.loading && updateData(e)}
          data-page={i + 1}
          key={i}
          className={`${i === 0 ? "active" : ""}`}
        >
          {i + 1}
        </h3>
      );
    }
    return h3Pages;
  };

  function updateData(e) {
    if (props.page.page !== +e.target.dataset.page) {
      props.page.setPage(+e.target.dataset.page);
    }
  }

  useEffect(() => {
    const pages = document.querySelectorAll(".pagination h3");
    if (pages) {
      pages.forEach((e) => e.classList.remove("active"));

      pages[props.page.page - 1]?.classList.add("active");
    }
  }, [props.page.page]);

  useEffect(() => {
    const handleClick = () => {
      if (props?.overlay?.overlay) {
        props.overlay.setOverlay(false);
        if (props.items.slectedItems.length < 2)
          props.items.setSelectedItems([]);
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
  }, [props?.overlay, hasFltr, props.items]);

  const checkAll = (e) => {
    const allActiveSelectors = document.querySelectorAll("td .checkbox.active");
    const allSelectors = document.querySelectorAll("td .checkbox");

    if (
      allActiveSelectors.length >= 0 &&
      allActiveSelectors.length !== allSelectors.length
    ) {
      allSelectors.forEach((e) => e.classList.add("active"));
      e.target.classList.add("active");
      !props?.workSpace?.workSpace
        ? props.items.setSelectedItems(props.data.allData)
        : props.workSpace.infoForm.setForm({
            ...props.workSpace.infoForm.form,
            people: [
              ...props.workSpace.infoForm.form.people,
              ...props.data.allData.filter(
                (item) =>
                  !props.workSpace.infoForm.form.people.some(
                    (person) => person._id === item._id
                  )
              ),
            ],
          });
    } else {
      allSelectors.forEach((e) => e.classList.remove("active"));
      e.target.classList.remove("active");
      !props?.workSpace?.workSpace
        ? props.items.setSelectedItems([])
        : props.workSpace.infoForm.setForm({
            ...props.workSpace.infoForm.form,
            people: props.workSpace.infoForm.form.people.filter(
              (item) =>
                !props.data.allData.some(
                  (dataItem) => dataItem._id === item._id
                )
            ),
          });
    }
  };

  const deleteData = async () => {
    try {
      if (props.items.slectedItems.length > 1) {
        const data = await axios.patch(
          `${baseURL}/${props.delete.url}/deActivate-many`,
          { ids: props.items.slectedItems },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (data.status === 200) {
          props?.overlay?.setOverlay(false);
          if (
            props.data.allData.length - props.items.slectedItems.length === 0 &&
            props.page.page !== 1
          ) {
            props.page.setPage(1);
          } else
            props.filters.search
              ? props.delete.getSearchData()
              : props.delete.getData();
        }
      } else {
        const data = await axios.patch(
          `${baseURL}/${props.delete.url}/deActivate/${props.items.slectedItems[0]}`,
          [],
          { headers: { Authorization: "Bearer " + token } }
        );
        if (data.status === 200) {
          props?.overlay?.setOverlay(false);
          if (
            props.data.allData.length - props.items.slectedItems.length === 0 &&
            props.page.page !== 1
          ) {
            props.page.setPage(1);
          } else
            props.filters.search
              ? props.delete.getSearchData()
              : props.delete.getData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateLimit = (e) => {
    if (parseInt(e.target.value) !== limit) {
      context?.setLimit(parseInt(e.target.value));
      props.page.setPage(1);
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
      {hasFltr && (
        <Filters
          fltr={{
            fltr: props.filters?.filters,
            setFilters: props.filters?.setFilters,
          }}
          dataArray={{ data, setData }}
          hasFltr={{ hasFltr, setHasFltr }}
          page={{ setPage: props.page.setPage }}
        />
      )}

      {props.overlay?.overlay && (
        <div className="overlay">
          <div onClick={(e) => e.stopPropagation()}>
            <h1>
              are you sure yo want to delete ({props.items.slectedItems.length})
              itms
            </h1>
            <div className="flex gap-10 wrap">
              <div onClick={deleteData} className="delete-all overlay-btn">
                <i className="fa-solid fa-trash"></i> delete
              </div>
              <div
                onClick={() => {
                  props.items.slectedItems.length === 1 &&
                    props.items.setSelectedItems([]);
                  props.overlay.setOverlay(false);
                }}
                className="delete-all cencel overlay-btn"
              >
                <i className="fa-solid fa-ban"></i> cencel
              </div>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.filters.setSearch(beforSubmit);
          props.page.setPage(1);
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
                  : "search by name"
              }`}
              value={beforSubmit}
              onInput={(e) => {
                e.target.value === "" && props.filters.setSearch("");
                setBeforeSubmit(e.target.value);
              }}
              required
            />

            <button className="btn center gap-10">
              <span>search</span>{" "}
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </>
        )}
        {!props?.workSpace?.workSpace && (
          <i
            title="filters"
            onClick={(e) => {
              setHasFltr(true);
              e.stopPropagation();
            }}
            className="fa-solid fa-sliders filter"
          ></i>
        )}
      </form>
      <div className="table">
        <table className={props.loading || props.data?.data ? "loading" : ""}>
          <thead>
            <tr>
              {!props.hideActionForUser && (
                <th>
                  {props.data.allData.length > 0 && (
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
          <tbody
            className={props.loading || props.data?.data ? "relative" : ""}
          >
            {props.loading ? (
              <div className="table-loading"> loading ...</div>
            ) : props.data?.data?.length > 0 ? (
              props.data.data
            ) : (
              <div className="table-loading"> no data</div>
            )}
          </tbody>
        </table>
      </div>

      {!props?.workSpace?.workSpace &&
        props.items?.slectedItems?.length > 0 && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              props?.overlay?.setOverlay(true);
            }}
            className="gap-10 delete-all"
          >
            <i className="fa-solid fa-trash"></i> delete (
            {props.items.slectedItems.length}) Item
          </div>
        )}
      <div className="pagination flex">
        {createPags(limit, props.page.dataLength)}
      </div>
    </>
  );
};

export default memo(Table);
