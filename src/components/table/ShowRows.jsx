import { useCallback, useMemo } from "react";

document.addEventListener("click", () => {
  document.querySelector(".show-rows > article.active") &&
    document
      .querySelector(".show-rows > article.active")
      .classList.remove("active");
});
const ShowRows = ({ columns, setColumns }) => {
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
      columns.map((column) => (
        <div key={column.name}>
          <input
            type="checkbox"
            id={column.name}
            checked={!column.hidden}
            onChange={() => updateRows(column)}
          />
          <label htmlFor={column.name}>{column.headerName}</label>
        </div>
      )),
    [columns, updateRows]
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
      <article onClick={(e) => e.stopPropagation()}>{inputs}</article>
    </div>
  );
};

export default ShowRows;
