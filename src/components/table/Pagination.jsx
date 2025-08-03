import { useCallback, useContext, useMemo } from "react";
import { Context } from "../../context/context";
import useLanguage from "../../hooks/useLanguage";

const Pagination = ({ dataLength, currentPage, loading, setPage }) => {
  const { limit, setLimit } = useContext(Context);

  const { language } = useLanguage();
  const updateLimit = useCallback(
    (e) => {
      const newLimit = parseInt(e.target.value);
      if (newLimit !== limit) {
        setLimit(newLimit);
        setPage(1);
      }
    },
    [limit, setLimit, setPage]
  );

  const createPags = useMemo(() => {
    const pages = Math.ceil(dataLength / limit);
    if (pages <= 1) return;

    const maxVisible = 4;
    const h3Pages = [];

    const renderPage = (i) => (
      <h3
        key={i}
        onClick={() => {
          if (!loading && currentPage !== i) {
            setPage(i);
          }
        }}
        className={i === currentPage ? "active" : ""}
      >
        {i}
      </h3>
    );

    h3Pages.push(
      <button
        key="prev"
        disabled={currentPage === 1 || loading}
        title="prev page"
        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        className="pagination-arrows fa-solid fa-angles-left"
      ></button>
    );

    h3Pages.push(renderPage(1));

    const half = Math.floor(maxVisible / 2);
    let startPage = Math.max(2, currentPage - half);
    let endPage = Math.min(pages - 1, currentPage + half);

    const visibleCount = endPage - startPage + 1;
    if (visibleCount > maxVisible) {
      if (currentPage > pages / 2) {
        startPage = endPage - maxVisible + 1;
      } else {
        endPage = startPage + maxVisible - 1;
      }
    }

    if (startPage > 2) {
      h3Pages.push(
        <span key="dots-start" className="font-color">
          ...
        </span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      h3Pages.push(renderPage(i));
    }

    if (endPage < pages - 1) {
      h3Pages.push(
        <span key="dots-end" className="font-color">
          ...
        </span>
      );
    }

    h3Pages.push(renderPage(pages));

    h3Pages.push(
      <button
        key="next"
        disabled={currentPage === pages || loading}
        title="next page"
        onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
        className="pagination-arrows fa-solid fa-angles-right"
      ></button>
    );

    return h3Pages;
  }, [limit, dataLength, loading, currentPage, setPage]);

  return (
    <div className="between table-pagination">
      <h2>
        {language?.table.number_of_items} <span>{dataLength || 0}</span>
      </h2>

      <div className="pagination flex align-center">{createPags}</div>

      <h2>
        {language?.table.choose_number_rows}
        <select value={limit} onChange={updateLimit}>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </h2>
    </div>
  );
};

export default Pagination;
