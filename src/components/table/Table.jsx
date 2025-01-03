import React, { memo, useContext, useEffect, useState } from "react";
import "./table.css";
import axios from "axios";
import { baseURL } from "../../context/context";
import { Context } from "./../../context/context";
import DatePicker from "react-datepicker";
const Table = (props) => {
  const header = props.header.map((th, i) => <th key={i}> {th} </th>);
  const context = useContext(Context);
  const limit = context?.limit;

  const [hasFltr, setHasFltr] = useState(false);

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
  const [fltr, setFltr] = useState(props.filters?.filters || {});

  useEffect(() => {
    if (keys?.includes("country") && data.country.length === 0 && hasFltr) {
      axios
        .get(`${baseURL}/Countries?active=true`)
        .then((res) => {
          setData({ ...data, country: res.data.data });
          setSeacrhData({ ...searchData, country: res.data.data });
        })
        .catch((err) => console.log(err));
    }
  }, [hasFltr]);

  useEffect(() => {
    if (keys?.includes("government")) {
      setFltr({ ...fltr, government: "" });
      if (hasFltr && fltr?.country)
        axios
          .get(
            `${baseURL}/Governments?active=true&country=${fltr?.country._id}`
          )
          .then((res) => {
            setData({ ...data, government: res.data.data });
            setSeacrhData({ ...searchData, government: res.data.data });
          })
          .catch((err) => console.log(err));
    }
  }, [fltr?.country]);

  useEffect(() => {
    if (keys?.includes("city")) {
      setFltr({ ...fltr, city: "" });
      if (hasFltr && fltr?.government) {
        axios
          .get(
            `${baseURL}/Cities?active=true&government=${fltr?.government?._id}`
          )
          .then((res) => {
            setData({ ...data, city: res.data.data });
            setSeacrhData({ ...searchData, city: res.data.data });
          })
          .catch((err) => console.log(err));
      }
    }
  }, [fltr?.government]);

  useEffect(() => {
    if (keys?.includes("villag")) setFltr({ ...fltr, villag: "" });
    if (hasFltr) {
      let dataObj = { ...data };
      const promises = [];
      if (keys?.includes("villag") && data.villag.length === 0 && fltr?.city) {
        promises.push(
          axios
            .get(`${baseURL}/Villages?active=true&city=${fltr?.city._id}`)
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
  }, [fltr?.city]);

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
      hasFltr && setHasFltr(false);
      const optionDiv = document.querySelector(
        "div.table tbody td i.options.active-div"
      );
      optionDiv && optionDiv.classList.remove("active-div");
      const fltrSelect = document.querySelector(".filters .select div.active");
      fltrSelect && fltrSelect.classList.remove("active");
      const cencel = document.querySelector(".overlay .cencel-fltr");
      cencel && setFltr(props.filters.filters);
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [props.overlay, hasFltr, props.items]);

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
      ...fltr,
      [e?.target?.dataset?.name]: itm ? itm : e?.target?.dataset?.data,
    };

    if (fltr[e?.target?.dataset?.name] !== obj[e?.target?.dataset?.name]) {
      setFltr(obj);
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
            props.filters.search
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
    parseInt(e.target.value) !== limit &&
      context?.setLimit(parseInt(e.target.value));
  };
  const [beforSubmit, setBeforeSubmit] = useState("");

  return (
    <>
      {hasFltr && (
        <div className="overlay">
          <div onClick={(e) => e.stopPropagation()} className="table-fltr">
            <div className="center wrap date-fltr gap-20">
              <div className="relative flex-1 center gap-10">
                <span>from:</span>
                <DatePicker
                  placeholderText="date from"
                  selected={fltr.date.from}
                  showIcon
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={90}
                  onChange={(e) =>
                    setFltr({ ...fltr, date: { ...fltr.date, from: e } })
                  }
                  maxDate={new Date()}
                />
              </div>
              <div className="center flex-1 gap-10 relative">
                <span>to:</span>
                <DatePicker
                  placeholderText="date to"
                  selected={fltr.date.to}
                  showIcon
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={90}
                  maxDate={new Date()}
                  minDate={fltr.date.from}
                  onChange={(e) =>
                    setFltr({ ...fltr, date: { ...fltr.date, to: e } })
                  }
                />
              </div>
              <span
                className="flex-1"
                onClick={(e) =>
                  setFltr({ ...fltr, date: { from: "", to: "" } })
                }
              >
                clear
              </span>
            </div>

            <div className="filters">
              {keys.includes("gender") && (
                <div className="select relative">
                  <div onClick={openDiv} className="center gap-10 w-100">
                    <span className="pointer-none">
                      {fltr?.gender ? fltr?.gender : "all gender"}
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

              {keys.includes("maritalStatus") && (
                <div className="select relative">
                  <div onClick={openDiv} className="center gap-10 w-100">
                    <span className="pointer-none">
                      {fltr?.maritalStatus
                        ? fltr?.maritalStatus
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
                      {fltr?.country ? fltr?.country.name : "all Countries"}
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

              {keys?.includes("government") && (
                <div className="select relative">
                  <div onClick={openDiv} className="center gap-10 w-100">
                    <span className="pointer-none">
                      {fltr?.government
                        ? fltr?.government.name
                        : "all Governments"}
                    </span>
                    <i className="fa-solid fa-sort-down pointer-none"></i>
                  </div>
                  <article>
                    {fltr?.country && (
                      <>
                        <input
                          type="text"
                          className="fltr-search"
                          placeholder="search for government ..."
                          onInput={(inp) => {
                            const filteredCountries = data.government.filter(
                              (e) =>
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
                      </>
                    )}

                    {!fltr?.country && <p>please select country first</p>}
                  </article>
                </div>
              )}

              {keys?.includes("city") && (
                <div className="select relative">
                  <div onClick={openDiv} className="center gap-10 w-100">
                    <span className="pointer-none">
                      {fltr?.city ? fltr?.city.name : "all Cities"}
                    </span>
                    <i className="fa-solid fa-sort-down pointer-none"></i>
                  </div>
                  <article>
                    {fltr?.government && (
                      <>
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
                      </>
                    )}
                    {!fltr?.government && <p>please select governemnt</p>}
                  </article>
                </div>
              )}

              {keys?.includes("villag") && (
                <div className="select relative">
                  <div onClick={openDiv} className="center gap-10 w-100">
                    <span className="pointer-none">
                      {fltr?.villag ? fltr?.villag.name : "all Villages"}
                    </span>
                    <i className="fa-solid fa-sort-down pointer-none"></i>
                  </div>
                  <article>
                    {fltr?.city && (
                      <>
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
                      </>
                    )}
                    {!fltr?.city && <p>please select city</p>}
                  </article>
                </div>
              )}
            </div>

            <div className="gap-10 center filters-setting">
              <span
                onClick={() => {
                  props.page.setPage(1);
                  props.filters?.setFilters(fltr);
                  setHasFltr(false);
                }}
              >
                okay
              </span>
              <span
                className="cencel-fltr"
                onClick={() => {
                  setHasFltr(false);
                  setFltr(props.filters?.filters);
                }}
              >
                cencel
              </span>
            </div>
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.filters.setSearch(beforSubmit);
        }}
        className="flex center gap-10 table-search"
      >
        <input
          type="text"
          placeholder="search by name"
          value={beforSubmit}
          onInput={(e) => {
            e.target.value === "" && props.filters.setSearch("");
            setBeforeSubmit(e.target.value);
          }}
          required
        />

        <button className="btn center gap-10">
          search <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <i
          onClick={(e) => {
            setHasFltr(true);
            e.stopPropagation();
          }}
          className="fa-solid fa-sliders filter"
        ></i>
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

export default memo(Table);
