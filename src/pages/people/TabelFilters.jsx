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
    [beforeFiltering]
  );

  const handleParentChange = useCallback(
    (name, option) => {
      const updated = { ...beforeFiltering };

      if (name === "countryId") {
        if (updated.countyId?.country !== option._id) updated.countyId = "";
        if (updated.governorateId?.country !== option._id)
          updated.governorateId = "";
        if (updated.cityId?.country !== option._id) updated.cityId = "";
        updated.streetId = "";
        updated.regionId = "";
        updated.villageId = "";
      }

      if (name === "countyId") {
        if (updated.cityId?.county !== option._id) updated.cityId = "";
        updated.streetId = "";
        updated.regionId = "";
        updated.villageId = "";
        updated.countryId = option.country;
      }

      if (name === "governorateId") {
        if (updated.cityId?.governorate !== option._id) updated.cityId = "";
        updated.streetId = "";
        updated.regionId = "";
        updated.villageId = "";
        updated.countryId = option.country;
      }

      if (name === "cityId") {
        if (updated.streetId?.city !== option._id) updated.streetId = "";
        if (updated.regionId?.city !== option._id) updated.regionId = "";
        if (updated.villageId?.city !== option._id) updated.villageId = "";
        const parentDataUpdate =
          option.parent === "Governorate"
            ? { governorateId: option.parentId, countyId: "" }
            : { countyId: option.parentId, governorateId: "" };
        Object.assign(updated, parentDataUpdate);
      }

      updated[name] = option;
      setBeforeFiltering(updated);
    },
    [beforeFiltering]
  );

  const staticFilters = useMemo(() => {
    const staticFilter = [
      {
        name: "gender",
        ifemptyLabel: language?.table?.all_genders,
        values: [
          { value: "", label: language?.table?.all_genders },
          { value: "Female", label: language?.table?.female },
          { value: "Male", label: language?.table?.male },
        ],
      },
      {
        name: "maritalStatus",
        ifemptyLabel: language?.people?.all_marital_status,
        values: [
          { value: "", label: language?.people?.all_marital_status },
          { value: "Married", label: language?.table?.married },
          { value: "Single", label: language?.table?.single },
          { value: "Other", label: language?.table?.other },
        ],
      },
    ];
    return staticFilter.map((itm) => (
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
  }, [language, openDives, updateFilters, beforeFiltering]);

  const apisSelcteFilter = useMemo(() => {
    const arrayOfApis = [
      {
        name: "countryId",
        selectLabel: beforeFiltering?.countryId?.name,
        onChange: (option) => handleParentChange("countryId", option),
        tabelFilterIgnoreText: "any country",
        url: "Countries",
      },
      {
        name: "countyId",
        selectLabel: beforeFiltering?.countyId?.name,
        onChange: (option) => handleParentChange("countyId", option),
        tabelFilterIgnoreText: "any county",
        url: "Counties",
      },
      {
        name: "governorateId",
        selectLabel: beforeFiltering?.governorateId?.name,
        onChange: (option) => handleParentChange("governorateId", option),
        tabelFilterIgnoreText: "any governorate",
        url: "Governorates",
      },
      {
        name: "cityId",
        selectLabel: beforeFiltering?.cityId?.name,
        onChange: (option) => handleParentChange("cityId", option),
        tabelFilterIgnoreText: "any city",
        url: "Cities",
      },
      {
        name: "streetId",
        selectLabel: beforeFiltering?.streetId?.name,
        onChange: (option) =>
          setBeforeFiltering((prev) => ({
            ...prev,
            streetId: option,
          })),
        tabelFilterIgnoreText: "any street",
        url: "Streets",
      },
      {
        name: "regionId",
        selectLabel: beforeFiltering?.regionId?.name,
        onChange: (option) =>
          setBeforeFiltering((prev) => ({
            ...prev,
            regionId: option,
          })),
        tabelFilterIgnoreText: "any region",
        url: "Regions",
      },
      {
        name: "villageId",
        selectLabel: beforeFiltering?.villageId?.name,
        onChange: (option) =>
          setBeforeFiltering((prev) => ({
            ...prev,
            villageId: option,
          })),
        tabelFilterIgnoreText: "any village",
        url: "Villages",
      },
      {
        name: "sources",
        selectLabel: beforeFiltering?.sources?.source_name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, sources: option }),
        tabelFilterIgnoreText: "any source",
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
  }, [beforeFiltering, handleParentChange]);

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
