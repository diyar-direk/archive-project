import { useCallback, useMemo, useState } from "react";
import useLanguage from "../../../hooks/useLanguage";
import TabelFilterDiv from "../../../components/tabelFilterData/TabelFilterDiv";

const ExportFilters = ({
  filter,
  setFilter,
  setIsopen,
  setPage,
  expirationCount,
}) => {
  const { language } = useLanguage();
  const [beforeFiltering, setBeforeFiltering] = useState({ ...filter } || {});
  const openDives = useCallback((e) => {
    e.target.classList.toggle("active");
  }, []);
  const closeDiv = useCallback((e) => {
    const article = e.currentTarget.closest("article");
    if (!article) return;

    const wrapperDiv = article.closest(".tabel-filter-select");
    const firstDiv = wrapperDiv?.querySelector("div");

    if (firstDiv?.classList.contains("active")) {
      firstDiv.classList.remove("active");
    }
  }, []);

  const staticFilters = useMemo(() => {
    const staticFilter = [
      {
        name: "expirationDate",
        label: language?.exports?.expiration_date,
        ifemptyLabel: language?.table?.any,
        values: [{ value: "expired", label: language?.table?.expired }],
      },
    ];
    return staticFilter.map((itm) => (
      <div className="tabel-filter-select select relative" key={itm.name}>
        <label> {itm.label} </label>
        <div onClick={openDives} className="center gap-10 w-100">
          {expirationCount > 0 && (
            <span className="expired-exports pointer-none" />
          )}
          <span className="pointer-none">
            {beforeFiltering[itm.name]
              ? language?.table?.expired
              : itm.ifemptyLabel}
          </span>
          <i className="fa-solid fa-sort-down pointer-none" />
        </div>
        <article>
          <h2
            onClick={(e) => {
              setBeforeFiltering({
                ...beforeFiltering,
                expirationDate: "",
              });
              closeDiv(e);
            }}
          >
            {itm.ifemptyLabel}
          </h2>
          {itm.values.map((value) => (
            <h2
              key={value.value}
              onClick={(e) => {
                setBeforeFiltering({
                  ...beforeFiltering,
                  expirationDate: value.value,
                });
                closeDiv(e);
              }}
            >
              {value.label}
              {expirationCount > 0 && (
                <span className="expired-exports"> {expirationCount} </span>
              )}
            </h2>
          ))}
        </article>
      </div>
    ));
  }, [language, openDives, beforeFiltering, closeDiv, expirationCount]);

  return (
    <TabelFilterDiv
      setFilter={setFilter}
      setIsopen={setIsopen}
      setPage={setPage}
      beforeFiltering={beforeFiltering}
      setBeforeFiltering={setBeforeFiltering}
    >
      {staticFilters}
    </TabelFilterDiv>
  );
};

export default ExportFilters;
