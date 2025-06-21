import { useCallback, useMemo } from "react";

const TabelHeader = ({
  selectable,
  allData,
  setSelectedItems,
  column,
  setSort,
}) => {
  const updateSortStatus = useCallback(
    (column) => {
      setSort((prev) => {
        return {
          ...prev,
          [column.name]: `${prev[column.name]?.startsWith("-") ? "" : "-"}${
            column.name
          }`,
        };
      });
    },
    [setSort]
  );
  const header = useMemo(
    () =>
      column.map(
        (th) =>
          !th.hidden && (
            <th key={th.headerName}>
              {th.headerName}
              {th.sort && (
                <i
                  className="fa-solid fa-chevron-down sort"
                  onClick={(e) => {
                    e.target.parentElement.classList.toggle("sort");
                    updateSortStatus(th);
                  }}
                ></i>
              )}
            </th>
          )
      ),
    [column, updateSortStatus]
  );
  const checkAll = (e) => {
    const allActiveSelectors = document.querySelectorAll("td .checkbox.active");
    const allSelectors = document.querySelectorAll("td .checkbox");

    if (
      allActiveSelectors.length >= 0 &&
      allActiveSelectors.length !== allSelectors.length
    ) {
      allSelectors.forEach((e) => e.classList.add("active"));
      e.target.classList.add("active");
      setSelectedItems(allData);
    } else {
      allSelectors.forEach((e) => e.classList.remove("active"));
      e.target.classList.remove("active");
      setSelectedItems([]);
    }
  };
  return (
    <thead>
      <tr>
        {selectable && (
          <th>
            {allData.length > 0 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  checkAll(e);
                }}
                className="checkbox select-all"
              ></div>
            )}
          </th>
        )}
        {header}
      </tr>
    </thead>
  );
};

export default TabelHeader;
