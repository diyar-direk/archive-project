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
  const updateCitiesChildren = useCallback(
    (option, name) =>
      setBeforeFiltering(() => {
        const cityId = option.city._id;
        const updatedData = beforeFiltering.streetId.city._id !== cityId?"":"";
        return { ...beforeFiltering, [name]: option };
      }),
    [setBeforeFiltering, beforeFiltering]
  );

  const apisSelcteFilter = useMemo(() => {
    const arrayOfApis = [
      {
        name: "countryId",
        selectLabel: beforeFiltering?.countryId?.name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, countryId: option }),
        tabelFilterIgnoreText: "any country",
        url: "Countries",
      },
      {
        name: "countyId",
        selectLabel: beforeFiltering?.countyId?.name,
        onChange: (option) =>
          setBeforeFiltering({
            ...beforeFiltering,
            countyId: option,
            countryId: option.country,
          }),
        tabelFilterIgnoreText: "any county",
        url: "Counties",
      },
      {
        name: "governorateId",
        selectLabel: beforeFiltering?.governorateId?.name,
        onChange: (option) =>
          setBeforeFiltering({
            ...beforeFiltering,
            governorateId: option,
            countryId: option.country,
          }),
        tabelFilterIgnoreText: "any governorateId",
        url: "Governorates",
      },
      {
        name: "cityId",
        selectLabel: beforeFiltering?.cityId?.name,
        onChange: (option) =>
          setBeforeFiltering(() => {
            const parentDataUpdate =
              option.parent === "Governorate"
                ? { governorateId: option.parentId, countyId: "" }
                : { countyId: option.parentId, governorateId: "" };
            return {
              ...beforeFiltering,
              cityId: option,
              ...parentDataUpdate,
            };
          }),
        tabelFilterIgnoreText: "any city",
        url: "Cities",
      },
      {
        name: "streetId",
        selectLabel: beforeFiltering?.streetId?.name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, streetId: option }),
        tabelFilterIgnoreText: "any Streets",
        url: "Streets",
      },
      {
        name: "regionId",
        selectLabel: beforeFiltering?.regionId?.name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, regionId: option }),
        tabelFilterIgnoreText: "any Regions",
        url: "Regions",
      },
      {
        name: "villageId",
        selectLabel: beforeFiltering?.villageId?.name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, villageId: option }),
        tabelFilterIgnoreText: "any village",
        url: "Villages",
      },
      {
        name: "sources",
        selectLabel: beforeFiltering?.sources?.source_name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, sources: option }),
        tabelFilterIgnoreText: "any sources",
        optionLabel: (option) => option?.source_name,
        url: "Sources",
      },
    ];
    return arrayOfApis.map((input) => (
      <SelectInputApi
        key={input.name}
        className="tabel-filter-select"
        isTabelsFilter
        fetchData={getAddressesApi}
        selectLabel={input.selectLabel}
        optionLabel={
          input.optionLabel ? input.optionLabel : (option) => option?.name
        }
        onChange={input.onChange}
        tabelFilterIgnoreText={input.tabelFilterIgnoreText}
        onIgnore={() =>
          setBeforeFiltering({ ...beforeFiltering, [input.name]: "" })
        }
        url={input.url}
      />
    ));
  }, [setBeforeFiltering, beforeFiltering]);

  return (
    <TabelFilterDiv
      setFilter={setFilter}
      setIsopen={setIsopen}
      setPage={setPage}
      beforeFiltering={beforeFiltering}
      setBeforeFiltering={setBeforeFiltering}
    >
      {staticFilters}
      {apisSelcteFilter}
    </TabelFilterDiv>
  );
};

export default TabelFilters;
