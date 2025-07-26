import { useCallback, useContext, useMemo, useState } from "react";
import { Context } from "./../../context/context";
import useLanguage from "../../hooks/useLanguage";

document.addEventListener("click", () => {
  document.querySelector(".show-rows > article.active") &&
    document
      .querySelector(".show-rows > article.active")
      .classList.remove("active");
});
const ShowRows = ({ columns, setColumns }) => {
  const [search, setSearch] = useState("");
  const context = useContext(Context);
  const { language } = useLanguage();
  const { role } = context.userDetails;
  const updateRows = useCallback(
    (column) => {
      const updated = columns.map((col) =>
        col.name === column.name ? { ...col, hidden: !col.hidden } : col
      );
      setColumns(updated);
    },
    [columns, setColumns]
  );

  const inputs = useMemo(
    () =>
      columns.map(
        (column) =>
          (!column.onlyAdminCanSee || role === "admin") &&
          (!search ? (
            <div key={column.name}>
              <input
                type="checkbox"
                className="c-pointer"
                id={column.name}
                checked={!column.hidden}
                onChange={() => updateRows(column)}
              />
              <label htmlFor={column.name}>
                {column.headerName}
                {typeof column.headerName === "function"
                  ? column.headerName(language)
                  : column.headerName}
              </label>
            </div>
          ) : (
            (column.name.includes(search) ||
              column.headerName.includes(search)) && (
              <div key={column.name}>
                <input
                  type="checkbox"
                  className="c-pointer"
                  id={column.name}
                  checked={!column.hidden}
                  onChange={() => updateRows(column)}
                />
                <label htmlFor={column.name}>{column.headerName}</label>
              </div>
            )
          ))
      ),
    [columns, updateRows, search, role]
  );

  return (
    <div className="show-rows relative">
      <div
        onClick={(e) => {
          e.stopPropagation();
          document
            .querySelector(".show-rows > article")
            .classList.toggle("active");
        }}
        className="table-form-icons"
      >
        <i className="fa-solid fa-ellipsis" />
        <span>{language.table.columns}</span>
      </div>
      <article onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="search"
          placeholder="search for rows"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
        {inputs}
        <h4>
          {language.table.columns_available} <span> {inputs.length}</span>
        </h4>
      </article>
    </div>
  );
};

export default ShowRows;
