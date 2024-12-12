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
    if (props.Page !== +e.target.dataset.page) {
      const pages = document.querySelectorAll(".pagination h3");
      pages.forEach((e) => e.classList.remove("active"));
      e.target.classList.add("active");
      props.setPage(+e.target.dataset.page);
    }
  }

  window.addEventListener("click", () => {
    const overlay = document.querySelector(".overlay");
    overlay && props.setHasFltr(false);
    const fltrSelect = document.querySelector(".filters .select div.active");

    fltrSelect && fltrSelect.classList.remove("active");
  });

  const removeClass = (e) => {
    e.target.parentNode.parentNode.children[0].classList.remove("active");
  };

  return (
    <>
      {props.hasFltr && (
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
        <table>
          <thead>
            <tr>
              <th></th>
              {header}
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
            </tr>
            <tr>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
              <td>j</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="pagination flex">{createPags(10, props.dataLength)}</div>
    </>
  );
};

export default Table;
