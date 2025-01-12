import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../../context/context";

const Filters = (props) => {
  console.log(props);

  const [dataLoading, setDataLoading] = useState({
    Countries: true,
    Cities: true,
    Governments: true,
    Villages: true,
    Regions: true,
    Streets: true,
  });
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

  const getFltrData = (e) => {
    if (props.data?.data?.data[e?.target?.title]?.length <= 0)
      axios
        .get(`${baseURL}/${[e.target.title]}?active=true`)
        .then((res) => {
          props.data?.setData({
            ...props.data.data,
            data: {
              ...props.data?.data?.data,
              [e.target.title]: res.data.data,
            },
            searchData: {
              ...props.data?.data?.searchData,
              [e.target.title]: res.data.data,
            },
          });
        })
        .catch((err) => console.log(err))
        .finally(setDataLoading({ ...dataLoading, [e.target.title]: false }));
  };
  return (
    <div className="select relative">
      <div
        title={props?.fltr?.fltrKey}
        onClick={(e) => {
          openDiv(e);
          getFltrData(e);
        }}
        className="center gap-10 w-100"
      >
        <span className="pointer-none">
          {props?.fltr[props?.fltr?.filter]
            ? props?.fltr?.fltr[props?.fltr?.filter]?.name
            : `all ${props?.fltr?.fltrKey}`}
        </span>
        <i className="fa-solid fa-sort-down pointer-none"></i>
      </div>
      <article>
        {dataLoading[props?.fltr?.fltrKey] ? (
          <p>loading ...</p>
        ) : (
          <>
            <input
              type="text"
              className="fltr-search"
              placeholder="search for Countries ..."
              onInput={(inp) => {
                const filteredCountries = props?.data?.data?.data[
                  props?.fltr.fltrKey
                ].filter((e) =>
                  e.name.toLowerCase().includes(inp.target.value.toLowerCase())
                );
                props?.data.setData({
                  ...props?.data?.data,
                  searchData: {
                    ...props?.data?.data?.searchData,
                    [props?.fltr?.fltrKey]: filteredCountries,
                  },
                });
              }}
            />
            {props?.data?.data?.searchData[props?.fltr?.fltrKey]?.length >
              0 && (
              <h2
                data-name={props?.fltr.filter}
                data-data=""
                onClick={(e) => {
                  props?.fltr?.selectFilters(e);
                  removeClass(e);
                }}
              >
                all country
              </h2>
            )}
            {props?.data.data?.searchData[props?.fltr.fltrKey]?.map(
              (itm, i) => (
                <h2
                  Key={i}
                  data-name={props?.fltr?.filter}
                  onClick={(e) => {
                    props?.fltr?.selectFilters(e, itm);
                    removeClass(e);
                  }}
                >
                  {itm.name}
                </h2>
              )
            )}
            {props?.data?.data.searchData[props?.fltr?.fltrKey].length <= 0 && (
              <p>no data</p>
            )}
          </>
        )}
      </article>
    </div>
  );
};

export default Filters;
