import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { baseURL, Context } from "../../context/context";
import DatePicker from "react-datepicker";

const Filters = (props) => {
  const [dataLoading, setDataLoading] = useState({
    Countries: false,
    Cities: false,
    Governments: false,
    Villages: false,
    Regions: false,
    Streets: false,
  });

  const [fltr, setFltr] = useState(props.fltr.fltr || {});

  const keys = Object.keys(fltr);
  const context = useContext(Context);
  const token = context.userDetails.token;

  const arrayOfKeys = [
    { fltrKey: "gender", backendKey: "gender" },
    { fltrKey: "credibility", backendKey: "credibility" },
    { fltrKey: "source_credibility", backendKey: "source_credibility" },
    { fltrKey: "role", backendKey: "role" },
    { fltrKey: "maritalStatus", backendKey: "maritalStatus" },
    { fltrKey: "country", backendKey: "Countries" },
    { fltrKey: "government", backendKey: "Governments" },
    { fltrKey: "city", backendKey: "Cities" },
    { fltrKey: "region", backendKey: "Regions" },
    { fltrKey: "villag", backendKey: "Villages" },
  ];

  useEffect(() => {
    const handleClick = () => {
      const fltrSelect = document.querySelector(".filters .select div.active");
      fltrSelect && fltrSelect.classList.remove("active");
      const cencel = document.querySelector(".overlay .cencel-fltr");
      cencel && setFltr(props?.fltr?.fltr);
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [props.hasFltr.hasFltr]);

  function selectFilters(e, itm) {
    const obj = {
      ...fltr,
      [e?.target?.dataset?.name]: itm ? itm : e?.target?.dataset?.data,
    };

    if (fltr[e?.target?.dataset?.name] !== obj[e?.target?.dataset?.name]) {
    }
    setFltr(obj);
  }

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
  const refreshData = (targetKey) => {
    props.dataArray.setData({
      ...props.dataArray.data,
      searchData:
        props.dataArray.data.dataWithProps[targetKey].length > 0
          ? props.dataArray.data.dataWithProps
          : props.dataArray.data.data,
    });
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
  const removeClass = (e) => {
    e.target.parentNode.parentNode.children[0].classList.remove("active");
  };

  const getFltrData = async (key) => {
    let url = `${baseURL}/${key}?active=true`;

    if (props.dataArray.data.data[key]?.length <= 0) {
      setDataLoading({ ...dataLoading, [key]: true });
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const currentData = props.dataArray.data;

        const updatedData = {
          data: {
            ...currentData?.data,
            [key]: res.data.data,
          },
          dataWithProps: {
            ...currentData?.data,
            [key]: res.data.data,
          },
          searchData: {
            ...currentData?.searchData,
            [key]: res.data.data,
          },
        };

        if (
          (key === "Cities" || key === "Governments") &&
          keys.includes("country") &&
          fltr.country._id
        ) {
          updatedData.searchData[key] = updatedData.searchData[key].filter(
            (item) => fltr.country._id === item.country._id
          );
          updatedData.dataWithProps[key] = updatedData.dataWithProps[
            key
          ].filter((item) => fltr.country._id === item.country._id);
        } else if (
          (key === "Villages" || key === "Regions" || key === "Streets") &&
          fltr.city._id
        ) {
          updatedData.searchData[key] = updatedData.searchData[key].filter(
            (item) => fltr.city._id === item.city._id
          );
          updatedData.dataWithProps[key] = updatedData.dataWithProps[
            key
          ].filter((item) => fltr.city._id === item.city._id);
        }

        props.dataArray.setData(updatedData);
      } catch (err) {
        console.log(err);
      } finally {
        setDataLoading({ ...dataLoading, [key]: false });
      }
    }
  };

  useEffect(() => {
    let obj = { ...fltr };
    keys.includes("city") && (obj = { ...obj, city: "" });
    keys.includes("government") && (obj = { ...obj, government: "" });
    setFltr(obj);
    if (
      (fltr.country && keys.includes("city")) ||
      (fltr.country && keys.includes("government"))
    ) {
      props.dataArray.setData({
        ...props.dataArray.data,
        searchData: {
          ...props.dataArray.data.searchData,
          Cities: props.dataArray.data.searchData.Cities.filter(
            (city) => fltr.country._id === city.country._id
          ),
          Governments: props.dataArray.data.searchData.Governments.filter(
            (government) => fltr.country._id === government.country._id
          ),
        },
        dataWithProps: {
          ...props.dataArray.data.searchData,
          Cities: props.dataArray.data.searchData.Cities.filter(
            (city) => fltr.country._id === city.country._id
          ),
          Governments: props.dataArray.data.searchData.Governments.filter(
            (government) => fltr.country._id === government.country._id
          ),
        },
      });
    } else if (
      (!fltr.country && keys.includes("city")) ||
      (!fltr.country && keys.includes("government"))
    ) {
      props.dataArray.setData({
        ...props.dataArray.data,
        searchData: {
          ...props.dataArray.data.searchData,
          Cities: props.dataArray.data.data.Cities,
          Governments: props.dataArray.data.data.Governments,
        },
        dataWithProps: {
          ...props.dataArray.data.searchData,
          Cities: props.dataArray.data.data.Cities,
          Governments: props.dataArray.data.data.Governments,
        },
      });
    }
  }, [fltr.country]);

  useEffect(() => {
    let obj = { ...fltr };

    keys.includes("region") && (obj = { ...obj, region: "" });
    keys.includes("street") && (obj = { ...obj, street: "" });
    keys.includes("villag") && (obj = { ...obj, villag: "" });

    setFltr(obj);
    if (
      (fltr.city && keys.includes("region")) ||
      (fltr.city && keys.includes("street")) ||
      (fltr.city && keys.includes("villag"))
    ) {
      props.dataArray.setData({
        ...props.dataArray.data,
        searchData: {
          ...props.dataArray.data.searchData,
          Streets: props.dataArray.data.searchData.Streets.filter(
            (city) => fltr.city._id === city.city._id
          ),
          Regions: props.dataArray.data.searchData.Regions.filter(
            (government) => fltr.city._id === government.city._id
          ),
          Villages: props.dataArray.data.searchData.Villages.filter(
            (government) => fltr.city._id === government.city._id
          ),
        },
        dataWithProps: {
          ...props.dataArray.data.searchData,
          Streets: props.dataArray.data.searchData.Streets.filter(
            (city) => fltr.city._id === city.city._id
          ),
          Regions: props.dataArray.data.searchData.Regions.filter(
            (government) => fltr.city._id === government.city._id
          ),
          Villages: props.dataArray.data.searchData.Villages.filter(
            (government) => fltr.city._id === government.city._id
          ),
        },
      });
    } else if (
      (!fltr.city && keys.includes("region")) ||
      (!fltr.city && keys.includes("street")) ||
      (!fltr.city && keys.includes("villag"))
    ) {
      props.dataArray.setData({
        ...props.dataArray.data,
        searchData: {
          ...props.dataArray.data.searchData,
          Villages: props.dataArray.data.data.Villages,
          Streets: props.dataArray.data.data.Streets,
          Regions: props.dataArray.data.data.Regions,
        },
        dataWithProps: {
          ...props.dataArray.data.searchData,
          Villages: props.dataArray.data.data.Villages,
          Streets: props.dataArray.data.data.Streets,
          Regions: props.dataArray.data.data.Regions,
        },
      });
    }
  }, [fltr.city]);

  const fltrData = keys?.map((e) => {
    if (e !== "date") {
      const targetKey = arrayOfKeys?.filter((key) => key?.fltrKey === e)[0];

      return (
        <div key={e} className="select relative">
          <div
            title={targetKey.backendKey}
            onClick={(target) => {
              if (
                e !== "gender" &&
                e !== "maritalStatus" &&
                e !== "role" &&
                e !== "source_credibility" &&
                e !== "credibility"
              ) {
                getFltrData(targetKey.backendKey);
                refreshData(targetKey.backendKey);
              }
              openDiv(target);
            }}
            className="center gap-10 w-100"
          >
            <span className="pointer-none">
              {fltr[e]
                ? fltr[e]?.name
                  ? fltr[e]?.name
                  : fltr[e]
                : `all ${targetKey.backendKey}`}
            </span>
            <i className="fa-solid fa-sort-down pointer-none"></i>
          </div>
          {e === "gender" ? (
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
          ) : e === "maritalStatus" ? (
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
          ) : e === "role" ? (
            <article>
              <h2
                data-name="role"
                data-data=""
                onClick={(e) => {
                  selectFilters(e);
                  removeClass(e);
                }}
              >
                all roles
              </h2>
              <h2
                data-name="role"
                data-data="admin"
                onClick={(e) => {
                  selectFilters(e);
                  removeClass(e);
                }}
              >
                admin
              </h2>
              <h2
                data-name="role"
                data-data="user"
                onClick={(e) => {
                  selectFilters(e);
                  removeClass(e);
                }}
              >
                user
              </h2>
            </article>
          ) : e !== "source_credibility" || e !== "credibility" ? (
            <article>
              <h2
                data-name={e}
                data-data=""
                onClick={(e) => {
                  selectFilters(e);
                  removeClass(e);
                }}
              >
                all credibility
              </h2>
              <h2
                data-name={e}
                data-data="High"
                onClick={(e) => {
                  selectFilters(e);
                  removeClass(e);
                }}
              >
                High
              </h2>
              <h2
                data-name={e}
                data-data="Medium"
                onClick={(e) => {
                  selectFilters(e);
                  removeClass(e);
                }}
              >
                Medium
              </h2>
              <h2
                data-name={e}
                data-data="Low"
                onClick={(e) => {
                  selectFilters(e);
                  removeClass(e);
                }}
              >
                Low
              </h2>
            </article>
          ) : (
            <article>
              {dataLoading[targetKey.backendKey] ? (
                <p>loading ...</p>
              ) : (
                <>
                  {props.dataArray.data?.data[targetKey.backendKey].length !==
                    0 && (
                    <input
                      type="text"
                      className="fltr-search"
                      placeholder={`search for ${targetKey.backendKey} ...`}
                      onInput={(inp) => {
                        const filteredCountries =
                          props.dataArray.data.dataWithProps[
                            targetKey.backendKey
                          ].filter((e) =>
                            e.name
                              .toLowerCase()
                              .includes(inp.target.value.toLowerCase())
                          );
                        props.dataArray.setData({
                          ...props.dataArray.data,
                          searchData: {
                            ...props.dataArray.data.searchData,
                            [targetKey.backendKey]: filteredCountries,
                          },
                        });
                      }}
                    />
                  )}
                  {props.dataArray.data?.searchData[targetKey.backendKey]
                    ?.length > 0 && (
                    <h2
                      data-name={e}
                      data-data=""
                      onClick={(e) => {
                        selectFilters(e);
                        removeClass(e);
                      }}
                    >
                      all {targetKey.backendKey}
                    </h2>
                  )}
                  {props.dataArray.data?.searchData[targetKey.backendKey]?.map(
                    (itm, i) => (
                      <h2
                        key={i}
                        data-name={e}
                        onClick={(e) => {
                          selectFilters(e, itm);
                          removeClass(e);
                        }}
                      >
                        {itm.name}
                      </h2>
                    )
                  )}
                  {props.dataArray.data?.searchData[targetKey.backendKey]
                    ?.length <= 0 && <p>no data</p>}
                </>
              )}
            </article>
          )}
        </div>
      );
    }
  });

  return (
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
          <i
            title="refresh data"
            onClick={refreshFilter}
            className="fa-solid fa-rotate-right"
          ></i>
        </div>

        <div className="filters">{fltrData}</div>

        <div className="gap-10 center filters-setting">
          <span
            onClick={() => {
              props?.page?.setPage(1);
              props?.fltr?.setFilters(fltr);
              props?.hasFltr?.setHasFltr(false);
            }}
          >
            okay
          </span>
          <span
            className="cencel-fltr"
            onClick={() => {
              props.hasFltr.setHasFltr(false);
              setFltr(props.fltr?.fltr);
            }}
          >
            cancel
          </span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
