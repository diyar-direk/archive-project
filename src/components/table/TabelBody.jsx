import { useCallback, useMemo } from "react";
import useLanguage from "../../hooks/useLanguage";

const TabelBody = ({
  loading,
  column,
  tabelData,
  selectable,
  selectedItems,
  setSelectedItems,
  setOverlay,
}) => {
  const checkOne = useCallback(
    (elementId) => {
      if (!selectedItems.some((id) => id === elementId)) {
        setSelectedItems((prevSelected) => [...prevSelected, elementId]);
      } else {
        setSelectedItems((prevSelected) =>
          prevSelected.filter((item) => item !== elementId)
        );
      }
    },
    [setSelectedItems, selectedItems]
  );
  const rows = useMemo(
    () =>
      tabelData.map((row) => (
        <tr key={row._id}>
          {selectable && (
            <td>
              <div
                onClick={() => checkOne(row._id)}
                className={`checkbox ${
                  selectedItems.some((id) => id === row._id) ? "active" : ""
                }`}
              ></div>
            </td>
          )}
          {column.map(
            (column) =>
              !column.hidden && (
                <td key={column.name} className={column.className}>
                  {column.getCell
                    ? column.type === "actions"
                      ? column.getCell(
                          row,
                          setOverlay,
                          setSelectedItems,
                          selectable
                        )
                      : column.getCell(row)
                    : row[column.name]}
                </td>
              )
          )}
        </tr>
      )),
    [
      tabelData,
      column,
      selectable,
      checkOne,
      selectedItems,
      setOverlay,
      setSelectedItems,
    ]
  );
  const { language } = useLanguage();
  return (
    <tbody className={loading || rows ? "relative" : ""}>
      {loading ? (
        <div className="table-loading"> {language?.table?.loading}</div>
      ) : rows.length > 0 ? (
        <>{rows}</>
      ) : (
        <div className="table-loading">{language?.table?.no_results}</div>
      )}
    </tbody>
  );
};

export default TabelBody;
