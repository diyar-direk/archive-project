import { useCallback, useEffect, useMemo, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import TabelFilterDiv from "./../../components/tabelFilterData/TabelFilterDiv";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getInfinityFeatchApis } from "../../utils/infintyFeatchApis";

const CitiesFilters = ({ filter, setFilter, setIsopen, setPage }) => {
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

  const updateFilters = useCallback(
    (name, value) => {
      setBeforeFiltering({ ...beforeFiltering, [name]: value });
    },
    [beforeFiltering]
  );

  const staticFilters = useMemo(() => {
    const staticFilter = [
      {
        name: "parent",
        ifemptyLabel: "any parent",
        label: "parent",
        values: [
          { value: "Governorate", label: "Governorate" },
          { value: "County", label: "County" },
        ],
      },
    ];
    return staticFilter.map((itm) => (
      <div className="tabel-filter-select select relative" key={itm.name}>
        <label> {itm.label} </label>
        <div onClick={openDives} className="center gap-10 w-100">
          <span className="pointer-none">
            {beforeFiltering[itm.name] || itm.ifemptyLabel}
          </span>
          <i className="fa-solid fa-sort-down pointer-none" />
        </div>
        <article>
          <h2
            onClick={(e) => {
              updateFilters(itm.name, "");
              closeDiv(e);
            }}
          >
            {itm.ifemptyLabel}
          </h2>
          {itm.values.map((value) => (
            <h2
              key={value.value}
              onClick={(e) => {
                updateFilters(itm.name, value.value);
                closeDiv(e);
              }}
            >
              {value.label}
            </h2>
          ))}
        </article>
      </div>
    ));
  }, [language, openDives, updateFilters, beforeFiltering, closeDiv]);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    setReset(true);
  }, [setReset, beforeFiltering.parent]);

  return (
    <TabelFilterDiv
      setFilter={setFilter}
      setIsopen={setIsopen}
      setPage={setPage}
      beforeFiltering={beforeFiltering}
      setBeforeFiltering={setBeforeFiltering}
    >
      {staticFilters}
      {beforeFiltering.parent && (
        <SelectInputApi
          className="tabel-filter-select"
          isTabelsFilter
          fetchData={getInfinityFeatchApis}
          selectLabel={`select ${beforeFiltering.parent}`}
          optionLabel={(option) => option?.name}
          onChange={(option) =>
            setBeforeFiltering({ ...beforeFiltering, parentId: option })
          }
          onIgnore={() =>
            setBeforeFiltering({ ...beforeFiltering, parentId: "" })
          }
          url={
            beforeFiltering.parent === "Governorate"
              ? "Governorates"
              : "Counties"
          }
          label={beforeFiltering.parent}
          value={beforeFiltering?.parentId?.name}
          reset={reset}
          setReset={setReset}
          tabelFilterIgnoreText={`any ${beforeFiltering.parent}`}
        />
      )}
    </TabelFilterDiv>
  );
};

export default CitiesFilters;
