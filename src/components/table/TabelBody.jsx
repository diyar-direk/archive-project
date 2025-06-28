import { useCallback, useContext, useMemo } from "react";
import useLanguage from "../../hooks/useLanguage";
import { Context } from "../../context/context";

const TabelBody = ({
  loading,
  column,
  tabelData,
  selectable,
  selectedItems,
  setSelectedItems,
  setOverlay,
  setUpdate,
  setBackupOverlay,
}) => {
  const context = useContext(Context);
  const { language } = useLanguage();

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
  const renderCell = useCallback(
    (column, row) => {
      if (column.getCell) {
        switch (column.type) {
          case "actions":
            return column.getCell(
              row,
              setOverlay,
              setSelectedItems,
              selectable,
              setUpdate
            );
          case "backup":
            return column.getCell(row, setBackupOverlay);
          case "usersPage":
            return column.getCell(row, context.userDetails._id, language);
          default:
            return column.getCell(row);
        }
      }
      return row[column.name];
    },
    [language, context, selectedItems, setOverlay, setSelectedItems, selectable]
  );

  const rows = useMemo(
    () =>
      tabelData.map((row) => (
        <tr key={row._id}>
          {selectable && (
            <td>
              {context.userDetails._id !== row._id && (
                <div
                  onClick={() => checkOne(row._id)}
                  className={`checkbox ${
                    selectedItems.includes(row._id) ? "active" : ""
                  }`}
                ></div>
              )}
            </td>
          )}
          {column.map(
            (column) =>
              !column.hidden && (
                <td key={column.name} className={column.className}>
                  {(column.hideColumnIf
                    ? !column.hideColumnIf(row, context.userDetails._id)
                    : true) && renderCell(column, row)}
                </td>
              )
          )}
        </tr>
      )),
    [
      tabelData,
      column,
      checkOne,
      renderCell,
      selectable,
      selectedItems,
      context.userDetails._id,
    ]
  );

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
