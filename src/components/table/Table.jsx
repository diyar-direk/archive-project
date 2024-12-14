import React from "react";
import "./table.css";
const Table = (props) => {
  const header = props.header.map((th, i) => <th key={i}> {th} </th>);

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

  return (
    <>
      {props.hasFltr.fltr && (
        <div className="overlay">
          <div onClick={(e) => e.stopPropagation()} className="filters">
            <div className="select relative">
              <div
                onClick={(e) => e.target.classList.toggle("active")}
                className="center gap-10 w-100"
              >
                <span> all gender </span>
                <i className="fa-solid fa-sort-down"></i>
              </div>
              <article>
                <h2 onClick={removeClass}>female</h2>
                <h2 onClick={removeClass}>male</h2>
              </article>
            </div>
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
            {props.data?.data ? (
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
