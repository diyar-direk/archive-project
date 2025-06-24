import { useCallback, useMemo, useState } from "react";

document.addEventListener("click", () => {
  document.querySelector(".show-rows > article.active") &&
    document
      .querySelector(".show-rows > article.active")
      .classList.remove("active");
});
const ShowRows = ({ columns, setColumns }) => {
  const [search, setSearch] = useState("");
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
      columns.map((column) =>
        !search ? (
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
        )
      ),
    [columns, updateRows, search]
  );

  return (
    <div className="show-rows relative">
      <i
        className="fa-solid fa-ellipsis-vertical"
        onClick={(e) => {
          e.stopPropagation();
          document
            .querySelector(".show-rows > article")
            .classList.toggle("active");
        }}
      />
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
          columns avibel: <span> {inputs.length}</span>
        </h4>
      </article>
    </div>
  );
};

export default ShowRows;
