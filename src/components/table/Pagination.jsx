import { useCallback, useContext, useMemo } from "react";
import { Context } from "../../context/context";

const Pagination = ({ dataLength, currentPage, loading, setPage }) => {
  const { limit } = useContext(Context);
  const { setLimit } = useContext(Context);
  const updateLimit = useCallback(
    (e) => {
      if (parseInt(e.target.value) !== limit) {
        setLimit(parseInt(e.target.value));
        setPage(1);
      }
    },
    [limit, setLimit, setPage]
  );
  const updateData = useCallback(
    (e) =>
      currentPage !== +e.target.dataset.page && setPage(+e.target.dataset.page),
    [currentPage, setPage]
  );
  const createPags = useMemo(() => {
    const pages = Math.ceil(dataLength / limit);
    if (pages <= 1) return;
    let h3Pages = [];
    for (let i = 0; i < pages; i++) {
      h3Pages.push(
        <h3
          onClick={(e) => !loading && updateData(e)}
          data-page={i + 1}
          key={i}
          className={`${i === 0 ? "active" : ""}`}
        >
          {i + 1}
        </h3>
      );
    }
    return h3Pages;
  }, [limit, dataLength, loading, updateData]);
  return (
    <div>
      <div className="between table-pagination">
        <h2>
          all data length: <span> {dataLength} </span>
        </h2>

        <h2>
          rows on table:
          <select value={limit} onChange={updateLimit}>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </h2>
      </div>
      <div className="pagination flex">{createPags}</div>
    </div>
  );
};

export default Pagination;
