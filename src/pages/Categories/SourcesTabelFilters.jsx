import { useCallback, useMemo, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import TabelFilterDiv from "./../../components/tabelFilterData/TabelFilterDiv";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getInfinityFeatchApis } from "../../utils/infintyFeatchApis";

const SourcesTabelFilters = ({ filter, setFilter, setIsopen, setPage }) => {
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
        name: "source_credibility",
        ifemptyLabel: language?.table?.any,
        label: language?.source?.source_credibility,
        values: [
          { value: "High", label: language?.enums?.source_credibility?.High },
          {
            value: "Medium",
            label: language?.enums?.source_credibility?.Medium,
          },
          { value: "Low", label: language?.enums?.source_credibility?.Low },
        ],
      },
    ];
    return staticFilter.map((itm) => (
      <div className="tabel-filter-select select relative" key={itm.name}>
        <label> {itm.label} </label>
        <div onClick={openDives} className="center gap-10 w-100">
          <span className="pointer-none">
            {beforeFiltering[itm.name]
              ? language?.enums?.credibility[beforeFiltering[itm.name]]
              : itm.ifemptyLabel}
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

  return (
    <TabelFilterDiv
      setFilter={setFilter}
      setIsopen={setIsopen}
      setPage={setPage}
      beforeFiltering={beforeFiltering}
      setBeforeFiltering={setBeforeFiltering}
    >
      {staticFilters}
      <SelectInputApi
        className="tabel-filter-select"
        isTabelsFilter
        fetchData={getInfinityFeatchApis}
        selectLabel={beforeFiltering?.field?.name}
        optionLabel={(option) => option?.name}
        onChange={(option) => updateFilters("field", option)}
        tabelFilterIgnoreText={language?.table?.any}
        onIgnore={() => setBeforeFiltering({ ...beforeFiltering, field: "" })}
        url="Fields"
        label={language?.source?.field}
      />
    </TabelFilterDiv>
  );
};

export default SourcesTabelFilters;
