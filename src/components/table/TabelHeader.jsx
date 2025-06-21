const TabelHeader = ({ selectable, allData, setSelectedItems, header }) => {
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
