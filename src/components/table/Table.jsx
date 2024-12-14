import React, { useEffect, useRef, useState } from "react";
import "./table.css";
import axios from "axios";
import { baseURL } from "../../context/context";
const Table = (props) => {
  const header = props.header.map((th, i) => <th key={i}> {th} </th>);
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

  const fltr = useRef(0);

  useEffect(() => {
    if (props.hasFltr.fltr && fltr.current === 0) {
      const keys = Object.keys(props.filters.filters);
      let dataObj = { ...data };

      const promises = [];

      if (keys.includes("country")) {
        promises.push(
          axios
            .get(`${baseURL}/Countries`)
            .then((res) => {
              dataObj = { ...dataObj, country: res.data.data };
            })
            .catch((err) => console.log(err))
        );
      }

      if (keys.includes("city")) {
        promises.push(
          axios
            .get(`${baseURL}/Cities`)
            .then((res) => {
              dataObj = { ...dataObj, city: res.data.data };
            })
            .catch((err) => console.log(err))
        );
      }

      if (keys.includes("government")) {
        promises.push(
          axios
            .get(`${baseURL}/Governments`)
            .then((res) => {
              dataObj = { ...dataObj, government: res.data.data };
            })
            .catch((err) => console.log(err))
        );
      }
      if (keys.includes("villag")) {
        promises.push(
          axios
            .get(`${baseURL}/Villages`)
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
          fltr.current++;
        })
        .catch((err) => console.log("Error in one or more requests:", err));
    }
  }, [props.hasFltr.fltr]);

  const createPags = (limit, dataLength) => {
    const pages = Math.ceil(dataLength / limit);
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
      const pages = document.querySelectorAll(".pagination h3");
      pages.forEach((e) => e.classList.remove("active"));
      e.target.classList.add("active");
      props.page.setPage(+e.target.dataset.page);
    }
  }

  window.addEventListener("click", () => {
    const overlay = document.querySelector(".overlay");
    overlay && props.hasFltr.setFltr(false);
    const fltrSelect = document.querySelector(".filters .select div.active");

    fltrSelect && fltrSelect.classList.remove("active");
  });

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

  function selectFilters(e) {
    props.filters.setFilters({
      ...props.filters.filters,
      [e.target.dataset.name]: e.target.dataset.data,
    });
    e.target.parentNode.parentNode.children[0].children[0].textContent =
      e.target.textContent;
  }

  return (
    <>
      {props.hasFltr.fltr && (
        <div className="overlay">
          <div onClick={(e) => e.stopPropagation()} className="filters">
            {(props.filters.filters.gender ||
              props.filters.filters.gender === "") && (
              <div className="select relative">
                <div onClick={openDiv} className="center gap-10 w-100">
                  <span className="pointer-none"> all gender </span>
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
                    data-data="female"
                    onClick={(e) => {
                      selectFilters(e);
                      removeClass(e);
                    }}
                  >
                    female
                  </h2>
                  <h2
                    data-name="gender"
                    data-data="male"
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

            {(props.filters.filters.country ||
              props.filters.filters.country === "") && (
              <div className="select relative">
                <div onClick={openDiv} className="center gap-10 w-100">
                  <span className="pointer-none"> all Countries </span>
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
                      data-data={itm._id}
                      onClick={(e) => {
                        selectFilters(e);
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

            {(props.filters.filters.city ||
              props.filters.filters.city === "") && (
              <div className="select relative">
                <div onClick={openDiv} className="center gap-10 w-100">
                  <span className="pointer-none"> all Cities </span>
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
                      data-data={itm._id}
                      onClick={(e) => {
                        selectFilters(e);
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

            {(props.filters.filters.government ||
              props.filters.filters.government === "") && (
              <div className="select relative">
                <div onClick={openDiv} className="center gap-10 w-100">
                  <span className="pointer-none"> all Governments </span>
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
                      data-data={itm._id}
                      onClick={(e) => {
                        selectFilters(e);
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

            {(props.filters.filters.villag ||
              props.filters.filters.villag === "") && (
              <div className="select relative">
                <div onClick={openDiv} className="center gap-10 w-100">
                  <span className="pointer-none"> all Villages </span>
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
                      data-data={itm._id}
                      onClick={(e) => {
                        selectFilters(e);
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
      <div className="table">
        <table className={props.loading || props.data?.data ? "loading" : ""}>
          <thead>
            <tr>
              <th>
                <div onClick={checkAll} className="checkbox select-all"></div>
              </th>
              {header}
              <th></th>
            </tr>
          </thead>
          <tbody
            className={props.loading || props.data?.data ? "relative" : ""}
          >
            {props.loading && <div className="table-loading"> loading ...</div>}
            {props.data?.data?.length > 0 ? (
              props.data.data
            ) : (
              <div className="table-loading"> no data</div>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination flex">
        {createPags(10, props.page.dataLength)}
      </div>
    </>
  );
};

export default Table;
