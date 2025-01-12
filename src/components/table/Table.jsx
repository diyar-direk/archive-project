import React, { memo, useContext, useEffect, useState } from "react";
import "./table.css";
import axios from "axios";
import { baseURL } from "../../context/context";
import { Context } from "./../../context/context";
import DatePicker from "react-datepicker";
import Filters from "./Filters";
const Table = (props) => {
  const header = props.header.map((th, i) => <th key={i}> {th} </th>);
  const context = useContext(Context);
  const limit = context?.limit;

  const [hasFltr, setHasFltr] = useState(false);

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
  });
  const [dataLoading, setDataLoading] = useState({
    Countries: true,
    Cities: true,
    Governments: true,
    Villages: true,
    Regions: true,
    Streets: true,
  });

  const keys = Object.keys(props.filters?.filters || "");
  const [fltr, setFltr] = useState(props.filters?.filters || {});

  const getFltrData = (e) => {
    if (data.data[e.target.title].length <= 0)
      axios
        .get(`${baseURL}/${[e.target.title]}?active=true`)
        .then((res) => {
          setData({
            ...data,
            data: { ...data.data, [e.target.title]: res.data.data },
            searchData: { ...data.searchData, [e.target.title]: res.data.data },
          });
        })
        .catch((err) => console.log(err))
        .finally(setDataLoading({ ...dataLoading, [e.target.title]: false }));
  };

  // useEffect(() => {
  //   if (
  //     keys?.includes("Countries") &&
  //     data.data.Countries.length === 0 &&
  //     hasFltr
  //   ) {
  //     axios
  //       .get(`${baseURL}/Countries?active=true`)
  //       .then((res) => {
  //         setData({
  //           ...data,
  //           data: { ...data.data, Countries: res.data.data },
  //           searchData: { ...data.searchData, Countries: res.data.data },
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, [hasFltr]);

  // useEffect(() => {
  //   let refreshData = { ...fltr };

  //   if (keys?.includes("government"))
  //     refreshData = { ...refreshData, government: "" };
  //   if (keys?.includes("city")) refreshData = { ...refreshData, city: "" };

  //   setFltr(refreshData);
  //   if (hasFltr) {
  //     let dataObj = { ...data };
  //     const promises = [];

  //     if (keys?.includes("government") && data.data.government.length === 0) {
  //       promises.push(
  //         axios
  //           .get(
  //             `${baseURL}/Governments?active=true${
  //               fltr.Countries ? `&Countries=${fltr?.Countries._id}` : ` `
  //             }`
  //           )
  //           .then((res) => {
  //             dataObj = {
  //               ...dataObj,
  //               data: { ...dataObj.data, government: res.data.data },
  //               searchData: {
  //                 ...dataObj.searchData,
  //                 government: res.data.data,
  //               },
  //             };
  //           })
  //           .catch((err) => console.log(err))
  //       );
  //     }

  //     if (keys?.includes("city") && data.data.city.length === 0) {
  //       promises.push(
  //         axios
  //           .get(
  //             `${baseURL}/Cities?active=true${
  //               fltr.Countries ? `&Countries=${fltr?.Countries._id}` : ` `
  //             }`
  //           )
  //           .then((res) => {
  //             console.log(res.data);

  //             dataObj = {
  //               ...dataObj,
  //               data: { ...dataObj.data, city: res.data.data },
  //               searchData: { ...dataObj.searchData, city: res.data.data },
  //             };
  //           })
  //           .catch((err) => console.log(err))
  //       );
  //     }

  //     Promise.all(promises)
  //       .then(() => {
  //         setData(dataObj);
  //       })
  //       .catch((err) => console.log("Error in one or more requests:", err));
  //   }
  // }, [fltr?.Countries, hasFltr]);

  // useEffect(() => {
  //   let refreshData = { ...fltr };

  //   if (keys?.includes("villag")) refreshData = { ...refreshData, villag: "" };
  //   if (keys?.includes("region")) refreshData = { ...refreshData, region: "" };
  //   if (keys?.includes("street")) refreshData = { ...refreshData, street: "" };

  //   setFltr(refreshData);
  //   if (hasFltr) {
  //     let dataObj = { ...data };
  //     const promises = [];
  //     if (
  //       keys?.includes("villag") &&
  //       data.data.villag.length === 0 &&
  //       fltr?.city
  //     ) {
  //       promises.push(
  //         axios
  //           .get(`${baseURL}/Villages?active=true&city=${fltr?.city._id}`)
  //           .then((res) => {
  //             dataObj = {
  //               ...dataObj,
  //               data: { ...dataObj.data, villag: res.data.data },
  //               searchData: { ...dataObj.searchData, villag: res.data.data },
  //             };
  //           })
  //           .catch((err) => console.log(err))
  //       );
  //     }
  //     if (
  //       keys?.includes("street") &&
  //       data.data.street.length === 0 &&
  //       fltr?.city
  //     ) {
  //       promises.push(
  //         axios
  //           .get(`${baseURL}/Streets?active=true&city=${fltr?.city._id}`)
  //           .then((res) => {
  //             dataObj = {
  //               ...dataObj,
  //               data: { ...dataObj.data, street: res.data.data },
  //               searchData: { ...dataObj.searchData, street: res.data.data },
  //             };
  //           })
  //           .catch((err) => console.log(err))
  //       );
  //     }
  //     if (
  //       keys?.includes("region") &&
  //       data.data.region.length === 0 &&
  //       fltr?.city
  //     ) {
  //       promises.push(
  //         axios
  //           .get(`${baseURL}/Regions?active=true&city=${fltr?.city._id}`)
  //           .then((res) => {
  //             dataObj = {
  //               ...dataObj,
  //               data: { ...dataObj.data, region: res.data.data },
  //               searchData: { ...dataObj.searchData, region: res.data.data },
  //             };
  //           })
  //           .catch((err) => console.log(err))
  //       );
  //     }
  //     Promise.all(promises)
  //       .then(() => {
  //         setData(dataObj);
  //       })
  //       .catch((err) => console.log("Error in one or more requests:", err));
  //   }
  // }, [fltr?.city]);

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

  const refreshFilter = () => {
    let refresh = { ...fltr };
    for (let i in fltr) {
      if (
        (fltr[i] && i !== "date") ||
        (i === "date" && (fltr.date.from || fltr.date.to))
      ) {
        for (let i in fltr)
          i !== "date"
            ? (refresh[i] = "")
            : (refresh[i] = { form: "", to: "" });
        setFltr(refresh);
        break;
      }
    }
  };

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
              <span className="flex-1" onClick={refreshFilter}>
                refresh data
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

              {/* <Filters
                fltr={{ fltrKey: "Countries", fltr: "country", selectFilters }}
                data={{ data, setData }}
              /> */}

              {keys?.includes("country") && (
                <div className="select relative">
                  <div
                    title="Countries"
                    onClick={(e) => {
                      getFltrData(e);
                      openDiv(e);
                    }}
                    className="center gap-10 w-100"
                  >
                    <span className="pointer-none">
                      {fltr?.country ? fltr?.country.name : "all Countries"}
                    </span>
                    <i className="fa-solid fa-sort-down pointer-none"></i>
                  </div>
                  <article>
                    {dataLoading.Countries ? (
                      <p>loading ...</p>
                    ) : (
                      <>
                        <input
                          type="text"
                          className="fltr-search"
                          placeholder="search for Countries ..."
                          onInput={(inp) => {
                            const filteredCountries =
                              data.data.Countries.filter((e) =>
                                e.name
                                  .toLowerCase()
                                  .includes(inp.target.value.toLowerCase())
                              );
                            setData({
                              ...data,
                              searchData: {
                                ...data.searchData,
                                Countries: filteredCountries,
                              },
                            });
                          }}
                        />
                        {data.searchData.Countries.length > 0 && (
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
                        {data.searchData.Countries.map((itm, i) => (
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
                        {data.searchData.Countries.length <= 0 && (
                          <p>no data</p>
                        )}
                      </>
                    )}
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
                    <input
                      type="text"
                      className="fltr-search"
                      placeholder="search for Governments ..."
                      onInput={(inp) => {
                        const filteredCountries = data.data.Governments.filter(
                          (e) =>
                            e.name
                              .toLowerCase()
                              .includes(inp.target.value.toLowerCase())
                        );
                        setData({
                          ...data,
                          searchData: {
                            ...data.searchData,
                            Governments: filteredCountries,
                          },
                        });
                      }}
                    />
                    {data.searchData.Governments.length > 0 && (
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
                    {data.searchData.Governments.map((itm, i) => (
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
                    {data.searchData.Governments.length <= 0 && <p>no data</p>}
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
                    <input
                      type="text"
                      className="fltr-search"
                      placeholder="search for city ..."
                      onInput={(inp) => {
                        const filteredCountries = data.data.Cities.filter((e) =>
                          e.name
                            .toLowerCase()
                            .includes(inp.target.value.toLowerCase())
                        );
                        setData({
                          ...data,
                          searchData: {
                            ...data.searchData,
                            Cities: filteredCountries,
                          },
                        });
                      }}
                    />
                    {data.searchData.Cities.length > 0 && (
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
                    {data.searchData.Cities.map((itm, i) => (
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
                    {data.searchData.Cities.length <= 0 && <p>no data</p>}
                  </article>
                </div>
              )}

              {keys?.includes("region") && (
                <div className="select relative">
                  <div onClick={openDiv} className="center gap-10 w-100">
                    <span className="pointer-none">
                      {fltr?.region ? fltr?.region.name : "all regiones"}
                    </span>
                    <i className="fa-solid fa-sort-down pointer-none"></i>
                  </div>
                  <article>
                    <input
                      type="text"
                      className="fltr-search"
                      placeholder="search for region ..."
                      onInput={(inp) => {
                        const filteredCountries = data.data.Regions.filter(
                          (e) =>
                            e.name
                              .toLowerCase()
                              .includes(inp.target.value.toLowerCase())
                        );
                        setData({
                          ...data,
                          searchData: {
                            ...data.searchData,
                            Regions: filteredCountries,
                          },
                        });
                      }}
                    />
                    {data.searchData.Regions.length > 0 && (
                      <h2
                        data-name="region"
                        data-data=""
                        onClick={(e) => {
                          selectFilters(e);
                          removeClass(e);
                        }}
                      >
                        all regiones
                      </h2>
                    )}
                    {data.searchData.Regions.map((itm, i) => (
                      <h2
                        key={i}
                        data-name="region"
                        onClick={(e) => {
                          selectFilters(e, itm);
                          removeClass(e);
                        }}
                      >
                        {itm.name}
                      </h2>
                    ))}
                    {data.searchData.Regions.length <= 0 && <p>no data</p>}
                  </article>
                </div>
              )}

              {keys?.includes("street") && (
                <div className="select relative">
                  <div onClick={openDiv} className="center gap-10 w-100">
                    <span className="pointer-none">
                      {fltr?.street ? fltr?.street.name : "all streetes"}
                    </span>
                    <i className="fa-solid fa-sort-down pointer-none"></i>
                  </div>
                  <article>
                    <input
                      type="text"
                      className="fltr-search"
                      placeholder="search for street ..."
                      onInput={(inp) => {
                        const filteredCountries = data.data.Streets.filter(
                          (e) =>
                            e.name
                              .toLowerCase()
                              .includes(inp.target.value.toLowerCase())
                        );
                        setData({
                          ...data,
                          searchData: {
                            ...data.searchData,
                            Streets: filteredCountries,
                          },
                        });
                      }}
                    />
                    {data.searchData.Streets.length > 0 && (
                      <h2
                        data-name="street"
                        data-data=""
                        onClick={(e) => {
                          selectFilters(e);
                          removeClass(e);
                        }}
                      >
                        all streetes
                      </h2>
                    )}
                    {data.searchData.Streets.map((itm, i) => (
                      <h2
                        key={i}
                        data-name="street"
                        onClick={(e) => {
                          selectFilters(e, itm);
                          removeClass(e);
                        }}
                      >
                        {itm.name}
                      </h2>
                    ))}
                    {data.searchData.Streets.length <= 0 && <p>no data</p>}
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
                    <input
                      type="text"
                      className="fltr-search"
                      placeholder="search for villag ..."
                      onInput={(inp) => {
                        const filteredCountries = data.data.Villages.filter(
                          (e) =>
                            e.name
                              .toLowerCase()
                              .includes(inp.target.value.toLowerCase())
                        );
                        setData({
                          ...data,
                          searchData: {
                            ...data.searchData,
                            Villages: filteredCountries,
                          },
                        });
                      }}
                    />
                    {data.searchData.Villages.length > 0 && (
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
                    {data.searchData.Villages.map((itm, i) => (
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
                    {data.searchData.Villages.length <= 0 && <p>no data</p>}
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
          search <i className="fa-solid fa-magnifying-glass"></i>
        </button>
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
        props.items?.slectedItems?.length > 1 && (
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
