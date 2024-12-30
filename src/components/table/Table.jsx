import React, { useContext, useEffect, useState } from "react";
import "./table.css";
import axios from "axios";
import { baseURL } from "../../context/context";
import { Context } from "./../../context/context";
const Table = (props) => {
  const header = props.header.map((th, i) => <th key={i}> {th} </th>);
  const context = useContext(Context);
  const limit = context?.limit;

  const [data, setData] = useState({
    country: [],
    city: [],
    government: [],
    villag: [],
  });
  const [searchData, setSeacrhData] = useState({
    country: [],
    city: [],
    villag: [],
    government: [],
  });

  const keys = Object.keys(props.filters?.filters || "");

  useEffect(() => {
    if (
      keys?.includes("country") &&
      data.country.length === 0 &&
      props.hasFltr?.fltr
    ) {
      axios
        .get(`${baseURL}/Countries?active=true`)
        .then((res) => {
          setData({ ...data, country: res.data.data });
          setSeacrhData({ ...searchData, country: res.data.data });
        })
        .catch((err) => console.log(err));
    }
  }, [props.hasFltr?.fltr]);

  useEffect(() => {
    if (keys?.includes("government")) {
      props.filters?.setFilters({ ...props.filters?.filters, government: "" });
      if (props.hasFltr?.fltr && props.filters?.filters?.country)
        axios
          .get(
            `${baseURL}/Governments?active=true&country=${props.filters?.filters?.country._id}`
          )
          .then((res) => {
            setData({ ...data, government: res.data.data });
            setSeacrhData({ ...searchData, government: res.data.data });
          })
          .catch((err) => console.log(err));
    }
  }, [props.filters?.filters?.country]);

  useEffect(() => {
    if (keys?.includes("city")) {
      props.filters?.setFilters({ ...props.filters?.filters, city: "" });
      if (props.hasFltr?.fltr && props.filters?.filters?.government) {
        axios
          .get(
            `${baseURL}/Cities?active=true&government=${props.filters?.filters?.government._id}`
          )
          .then((res) => {
            setData({ ...data, city: res.data.data });
            setSeacrhData({ ...searchData, city: res.data.data });
          })
          .catch((err) => console.log(err));
      }
    }
  }, [props.filters?.filters?.government]);

  useEffect(() => {
    if (keys?.includes("villag"))
      props.filters?.setFilters({ ...props.filters?.filters, villag: "" });
    if (props.hasFltr?.fltr) {
      let dataObj = { ...data };
      const promises = [];
      if (
        keys?.includes("villag") &&
        data.villag.length === 0 &&
        props.filters?.filters?.city
      ) {
        promises.push(
          axios
            .get(
              `${baseURL}/Villages?active=true&city=${props.filters?.filters?.city._id}`
            )
            .then((res) => {
              dataObj = { ...dataObj, villag: res.data.data };
            })
            .catch((err) => console.log(err))
        );
      }
      Promise.all(promises)
        .then(() => {
          setData(dataObj);
          setSeacrhData(dataObj);
        })
        .catch((err) => console.log("Error in one or more requests:", err));
    }
  }, [props.filters?.filters?.city]);

  const createPags = (limit, dataLength) => {
    const pages = Math.ceil(dataLength / limit);
    if (pages <= 1) return;
    let h3Pages = [];
    for (let i = 0; i < pages; i++) {
      h3Pages.push(
        <h3
          onClick={updateData}
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
      if (props.overlay.overlay) {
        props.overlay.setOverlay(false);

        if (props.items.slectedItems.length < 2)
          props.items.setSelectedItems([]);
      }
      props.hasFltr?.fltr && props.hasFltr?.setFltr(false);
      const optionDiv = document.querySelector(
        "div.table tbody td i.options.active-div"
      );
      optionDiv && optionDiv.classList.remove("active-div");
      const fltrSelect = document.querySelector(".filters .select div.active");
      fltrSelect && fltrSelect.classList.remove("active");
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [props.overlay, props.hasFltr, props.items]);

  const removeClass = (e) => {
    e.target.parentNode.parentNode.children[0].classList.remove("active");
  };

  const checkAll = (e) => {
    const allActiveSelectors = document.querySelectorAll("td .checkbox.active");
    const allSelectors = document.querySelectorAll("td .checkbox");

    props.items.setSelectedItems([]);

    if (
      allActiveSelectors.length >= 0 &&
      allActiveSelectors.length !== allSelectors.length
    ) {
      allSelectors.forEach((e) => e.classList.add("active"));
      e.target.classList.add("active");
      props.items.setSelectedItems(props.data.allData);
    } else {
      allSelectors.forEach((e) => e.classList.remove("active"));
      e.target.classList.remove("active");
      props.items.setSelectedItems([]);
    }
  };

  const openDiv = (e) => {
    const allDivs = document.querySelectorAll(
      ".overlay .filters .select div.active"
    );
    allDivs.forEach(
      (ele) => ele !== e.target && ele.classList.remove("active")
    );
    e.target.classList.toggle("active");
  };

  function selectFilters(e, itm) {
    const obj = {
      ...props.filters?.filters,
      [e.target.dataset.name]: itm ? itm : e.target.dataset.data,
    };
    if (
      props.filters?.filters[e.target.dataset.name] !==
      obj[e.target.dataset.name]
    ) {
      props.filters?.setFilters(obj);
      props.page.setPage(1);
    }
  }

  const deleteData = async () => {
    try {
      if (props.items.slectedItems.length > 1) {
        const data = await axios.patch(
          `${baseURL}/${props.delete.url}/deActivate-many`,
          { ids: props.items.slectedItems }
        );
        if (data.status === 200) {
          props.overlay.setOverlay(false);
          if (
            props.data.allData.length - props.items.slectedItems.length === 0 &&
            props.page.page !== 1
          ) {
            props.page.setPage(1);
          } else
            props.filters.inputsFltr.search
              ? props.delete.getSearchData()
              : props.delete.getData();
        }
      } else {
        const data = await axios.patch(
          `${baseURL}/${props.delete.url}/deActivate/${props.items.slectedItems[0]}`,
          []
        );
        if (data.status === 200) {
          props.overlay.setOverlay(false);
          if (
            props.data.allData.length - props.items.slectedItems.length === 0 &&
            props.page.page !== 1
          ) {
            props.page.setPage(1);
          } else
            props.filters.inputsFltr.search
              ? props.delete.getSearchData()
              : props.delete.getData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateLimit = (e) => {
    parseInt(e.target.value) !== limit &&
      context?.setLimit(parseInt(e.target.value));
  };

  return (
    <>
      {props.hasFltr?.fltr && (
        <div className="overlay">
          <div onClick={(e) => e.stopPropagation()} className="filters">
            {(props.filters?.filters?.gender ||
              props.filters?.filters?.gender === "") && (
              <div className="select relative">
                <div onClick={openDiv} className="center gap-10 w-100">
                  <span className="pointer-none">
                    {props.filters?.filters?.gender
                      ? props.filters?.filters?.gender
                      : "all gender"}
                  </span>
                  <i className="fa-solid fa-sort-down pointer-none"></i>
                </div>
                <article>
                  <h2
                    data-name="gender"
                    data-data=""
                    onClick={(e) => {
                      selectFilters(e);
                      removeClass(e);
                    }}
                  >
                    all gender
                  </h2>
                  <h2
                    data-name="gender"
                    data-data="Female"
                    onClick={(e) => {
                      selectFilters(e);
                      removeClass(e);
                    }}
                  >
                    female
                  </h2>
                  <h2
                    data-name="gender"
                    data-data="Male"
                    onClick={(e) => {
                      selectFilters(e);
                      removeClass(e);
                    }}
                  >
                    male
                  </h2>
                </article>
              </div>
            )}

            {(props.filters?.filters?.maritalStatus ||
              props.filters?.filters?.maritalStatus === "") && (
              <div className="select relative">
                <div onClick={openDiv} className="center gap-10 w-100">
                  <span className="pointer-none">
                    {props.filters?.filters?.maritalStatus
                      ? props.filters?.filters?.maritalStatus
                      : "all marital"}
                  </span>
                  <i className="fa-solid fa-sort-down pointer-none"></i>
                </div>
                <article>
                  <h2
                    data-name="maritalStatus"
                    data-data=""
                    onClick={(e) => {
                      selectFilters(e);
                      removeClass(e);
                    }}
                  >
                    all marital
                  </h2>
                  <h2
                    data-name="maritalStatus"
                    data-data="Married"
                    onClick={(e) => {
                      selectFilters(e);
                      removeClass(e);
                    }}
                  >
                    Married
                  </h2>
                  <h2
                    data-name="maritalStatus"
                    data-data="Single"
                    onClick={(e) => {
                      selectFilters(e);
                      removeClass(e);
                    }}
                  >
                    Single
                  </h2>
                  <h2
                    data-name="maritalStatus"
                    data-data="Other"
                    onClick={(e) => {
                      selectFilters(e);
                      removeClass(e);
                    }}
                  >
                    Other
                  </h2>
                </article>
              </div>
            )}

            {keys?.includes("country") && (
              <div className="select relative">
                <div onClick={openDiv} className="center gap-10 w-100">
                  <span className="pointer-none">
                    {props.filters?.filters?.country
                      ? props.filters?.filters?.country.name
                      : "all Countries"}
                  </span>
                  <i className="fa-solid fa-sort-down pointer-none"></i>
                </div>
                <article>
                  <input
                    type="text"
                    className="fltr-search"
                    placeholder="search for country ..."
                    onInput={(inp) => {
                      const filteredCountries = data.country.filter((e) =>
                        e.name
                          .toLowerCase()
                          .includes(inp.target.value.toLowerCase())
                      );
                      setSeacrhData({
                        ...searchData,
                        country: filteredCountries,
                      });
                    }}
                  />
                  {searchData.country.length > 0 && (
                    <h2
                      data-name="country"
                      data-data=""
                      onClick={(e) => {
                        selectFilters(e);
                        removeClass(e);
                      }}
                    >
                      all country
                    </h2>
                  )}
                  {searchData.country.map((itm, i) => (
                    <h2
                      key={i}
                      data-name="country"
                      onClick={(e) => {
                        selectFilters(e, itm);
                        removeClass(e);
                      }}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {searchData.country.length <= 0 && <p>no data</p>}
                </article>
              </div>
            )}

            {keys?.includes("government") &&
              props.filters?.filters?.country && (
                <div className="select relative">
                  <div onClick={openDiv} className="center gap-10 w-100">
                    <span className="pointer-none">
                      {props.filters?.filters?.government
                        ? props.filters?.filters?.government.name
                        : "all Governments"}
                    </span>
                    <i className="fa-solid fa-sort-down pointer-none"></i>
                  </div>
                  <article>
                    <input
                      type="text"
                      className="fltr-search"
                      placeholder="search for government ..."
                      onInput={(inp) => {
                        const filteredCountries = data.government.filter((e) =>
                          e.name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                        );
                        setSeacrhData({
                          ...searchData,
                          government: filteredCountries,
                        });
                      }}
                    />
                    {searchData.government.length > 0 && (
                      <h2
                        data-name="government"
                        data-data=""
                        onClick={(e) => {
                          selectFilters(e);
                          removeClass(e);
                        }}
                      >
                        all government
                      </h2>
                    )}
                    {searchData.government.map((itm, i) => (
                      <h2
                        key={i}
                        data-name="government"
                        onClick={(e) => {
                          selectFilters(e, itm);
                          removeClass(e);
                        }}
                      >
                        {itm.name}
                      </h2>
                    ))}
                    {searchData.government.length <= 0 && <p>no data</p>}
                  </article>
                </div>
              )}

            {keys?.includes("city") && props.filters?.filters?.government && (
              <div className="select relative">
                <div onClick={openDiv} className="center gap-10 w-100">
                  <span className="pointer-none">
                    {props.filters?.filters?.city
                      ? props.filters?.filters?.city.name
                      : "all Cities"}
                  </span>
                  <i className="fa-solid fa-sort-down pointer-none"></i>
                </div>
                <article>
                  <input
                    type="text"
                    className="fltr-search"
                    placeholder="search for city ..."
                    onInput={(inp) => {
                      const filteredCountries = data.city.filter((e) =>
                        e.name
                          .toLowerCase()
                          .includes(inp.target.value.toLowerCase())
                      );
                      setSeacrhData({
                        ...searchData,
                        city: filteredCountries,
                      });
                    }}
                  />
                  {searchData.city.length > 0 && (
                    <h2
                      data-name="city"
                      data-data=""
                      onClick={(e) => {
                        selectFilters(e);
                        removeClass(e);
                      }}
                    >
                      all city
                    </h2>
                  )}
                  {searchData.city.map((itm, i) => (
                    <h2
                      key={i}
                      data-name="city"
                      onClick={(e) => {
                        selectFilters(e, itm);
                        removeClass(e);
                      }}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {searchData.city.length <= 0 && <p>no data</p>}
                </article>
              </div>
            )}

            {keys?.includes("villag") && props.filters?.filters?.city && (
              <div className="select relative">
                <div onClick={openDiv} className="center gap-10 w-100">
                  <span className="pointer-none">
                    {props.filters?.filters?.villag
                      ? props.filters?.filters?.villag.name
                      : "all Villages"}
                  </span>
                  <i className="fa-solid fa-sort-down pointer-none"></i>
                </div>
                <article>
                  <input
                    type="text"
                    className="fltr-search"
                    placeholder="search for villag ..."
                    onInput={(inp) => {
                      const filteredCountries = data.villag.filter((e) =>
                        e.name
                          .toLowerCase()
                          .includes(inp.target.value.toLowerCase())
                      );
                      setSeacrhData({
                        ...searchData,
                        villag: filteredCountries,
                      });
                    }}
                  />
                  {searchData.villag.length > 0 && (
                    <h2
                      data-name="villag"
                      data-data=""
                      onClick={(e) => {
                        selectFilters(e);
                        removeClass(e);
                      }}
                    >
                      all villages
                    </h2>
                  )}
                  {searchData.villag.map((itm, i) => (
                    <h2
                      key={i}
                      data-name="villag"
                      onClick={(e) => {
                        selectFilters(e, itm);
                        removeClass(e);
                      }}
                    >
                      {itm.name}
                    </h2>
                  ))}
                  {searchData.villag.length <= 0 && <p>no data</p>}
                </article>
              </div>
            )}
          </div>
        </div>
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

      <form className="flex center gap-10 table-search">
        <input
          type="text"
          placeholder="search by name"
          value={props.filters.inputsFltr.search}
          onInput={(e) =>
            props.filters.setInputsFltr({
              ...props.filters.inputsFltr,
              search: e.target.value,
            })
          }
        />
        <input
          type="month"
          value={props.filters.inputsFltr.date}
          onInput={(e) =>
            props.filters.setInputsFltr({
              ...props.filters.inputsFltr,
              date: e.target.value,
            })
          }
        />
        {(props.hasFltr?.fltr || props.hasFltr?.fltr === false) && (
          <i
            onClick={(e) => {
              props.hasFltr?.setFltr(true);
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
              <th>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    checkAll(e);
                  }}
                  className="checkbox select-all"
                ></div>
              </th>
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

      {props.items?.slectedItems?.length > 1 && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            props.overlay.setOverlay(true);
          }}
          className="gap-10 delete-all"
        >
          <i className="fa-solid fa-trash"></i> delete all (
          {props.items.slectedItems.length})
        </div>
      )}
      <div className="pagination flex">
        {createPags(limit, props.page.dataLength)}
      </div>
    </>
  );
};

export default Table;
