import { useCallback, useContext, useMemo } from "react";
import { Context } from "../../context/context";

const TabelHeader = ({
  selectable,
  allData,
  setSelectedItems,
  column,
  setSort,
}) => {
  const updateSortStatus = useCallback(
    (column, e) => {
      setSort((prev) => {
        const prevStatus = prev[column.name]?.startsWith("-");
        e.target.parentElement.className = prevStatus ? "a-z" : "z-a";
        return {
          ...prev,
          [column.name]: `${prevStatus ? "" : "-"}${column.name}`,
        };
      });
    },
    [setSort]
  );
  const context = useContext(Context);
  const { role } = context.userDetails;

  const header = useMemo(
    () =>
      column.map(
        (th) =>
          !th.hidden &&
          (!th.onlyAdminCanSee || role === "admin") && (
            <th key={th.headerName}>
              {th.headerName}
              {th.sort && (
                <i
                  className="fa-solid fa-chevron-right sort"
                  onClick={(e) => {
                    updateSortStatus(th, e);
                  }}
                ></i>
              )}
            </th>
          )
      ),
    [column, updateSortStatus, role]
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
