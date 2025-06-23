import { useCallback, useMemo, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import TabelFilterDiv from "./../../components/tabelFilterData/TabelFilterDiv";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getAddressesApi } from "../addresses/api";
const TabelFilters = ({ filter, setFilter, setIsopen, setPage }) => {
  const { language } = useLanguage();
  const [beforeFiltering, setBeforeFiltering] = useState({ ...filter } || {});
  const openDives = useCallback((e) => {
    e.target.classList.toggle("active");
  }, []);
  const updateFilters = useCallback(
    (name, value) => {
      setBeforeFiltering({ ...beforeFiltering, [name]: value });
    },
    [setBeforeFiltering, beforeFiltering]
  );

  const staticFilters = useMemo(() => {
    const staticFilter = [
      {
        name: "gender",
        ifemptyLabel: language?.table?.all_genders,
        values: [
          { value: "", label: language?.table?.all_genders },
          { value: "female", label: language?.table?.female },
          { value: "male", label: language?.table?.male },
        ],
      },
      {
        name: "maritalStatus",
        ifemptyLabel: language?.people?.all_marital_status,
        values: [
          { value: "", label: language?.people?.all_marital_status },
          { value: "married", label: language?.table?.married },
          { value: "single", label: language?.table?.single },
          { value: "other", label: language?.table?.other },
        ],
      },
    ];
    const items = staticFilter.map((itm) => (
      <div className="tabel-filter-select select relative" key={itm.name}>
        <div onClick={openDives} className="center gap-10 w-100">
          <span className="pointer-none">
            {beforeFiltering[itm.name] || itm.ifemptyLabel}
          </span>
          <i className="fa-solid fa-sort-down pointer-none" />
        </div>
        <article>
          {itm.values.map((value) => (
            <h2
              key={value.value}
              onClick={() => updateFilters(itm.name, value.value)}
            >
              {value.label}
            </h2>
          ))}
        </article>
      </div>
    ));
    return items;
  }, [language, openDives, updateFilters, beforeFiltering]);

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
        fetchData={getAddressesApi}
        selectLabel={"people"}
        optionLabel={(option) => option?.name}
        onChange={(option) => setFilter({ ...filter, role: option?.name })}
        url="Cities"
      />
    </TabelFilterDiv>
  );
};

export default TabelFilters;
