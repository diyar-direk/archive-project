import { useCallback, useContext, useMemo, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import TabelFilterDiv from "./../../components/tabelFilterData/TabelFilterDiv";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getInfinityFeatchApis } from "../../utils/infintyFeatchApis";
import { Context } from "../../context/context";

const TabelFilters = ({ filter, setFilter, setIsopen, setPage }) => {
  const { language } = useLanguage();
  const [beforeFiltering, setBeforeFiltering] = useState({ ...filter } || {});
  const context = useContext(Context);
  const { role } = context.userDetails;

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
        ifemptyLabel: language?.table?.any,
        label: language?.people?.gender,
        enums: "gender",
        values: [
          { value: "Female", label: language?.people?.female },
          { value: "Male", label: language?.people?.male },
        ],
      },
      {
        name: "maritalStatus",
        label: language?.people?.marital_status,
        ifemptyLabel: language?.table?.all_marital_status,
        enums: "maritalStatus",
        values: [
          { value: "Married", label: language?.people?.married },
          { value: "Single", label: language?.people?.single },
          { value: "Other", label: language?.people?.other },
        ],
      },
    ];
    return staticFilter.map((itm) => (
      <div className="tabel-filter-select select relative" key={itm.name}>
        <label> {itm.label} </label>
        <div onClick={openDives} className="center gap-10 w-100">
          <span className="pointer-none">
            {beforeFiltering[itm.name]
              ? language?.enums[itm.enums][beforeFiltering[itm.name]]
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

  const apisSelcteFilter = useMemo(() => {
    const arrayOfApis = [
      {
        name: "countryId",
        label: language?.people?.country,
        selectLabel: beforeFiltering?.countryId?.name,
        onChange: (option) => handleParentChange("countryId", option),
        tabelFilterIgnoreText: language?.table?.any,
        url: "Countries",
      },
      {
        name: "countyId",
        label: language?.people?.county,
        selectLabel: beforeFiltering?.countyId?.name,
        onChange: (option) => handleParentChange("countyId", option),
        tabelFilterIgnoreText: language?.table?.any,
        url: "Counties",
      },
      {
        label: language?.people?.governerate,
        name: "governorateId",
        selectLabel: beforeFiltering?.governorateId?.name,
        onChange: (option) => handleParentChange("governorateId", option),
        tabelFilterIgnoreText: language?.table?.any,
        url: "Governorates",
      },
      {
        name: "cityId",
        label: language?.people?.city,
        selectLabel: beforeFiltering?.cityId?.name,
        onChange: (option) => handleParentChange("cityId", option),
        tabelFilterIgnoreText: language?.table?.any,
        url: "Cities",
      },
      {
        name: "streetId",
        label: language?.people?.street,
        selectLabel: beforeFiltering?.streetId?.name,
        onChange: (option) =>
          setBeforeFiltering((prev) => ({
            ...prev,
            streetId: option,
          })),
        tabelFilterIgnoreText: language?.table?.any,
        url: "Streets",
      },
      {
        name: "regionId",
        label: language?.people?.region,
        selectLabel: beforeFiltering?.regionId?.name,
        onChange: (option) =>
          setBeforeFiltering((prev) => ({
            ...prev,
            regionId: option,
          })),
        tabelFilterIgnoreText: language?.table?.any,
        url: "Regions",
      },
      {
        name: "villageId",
        label: language?.people?.village,
        selectLabel: beforeFiltering?.villageId?.name,
        onChange: (option) =>
          setBeforeFiltering((prev) => ({
            ...prev,
            villageId: option,
          })),
        tabelFilterIgnoreText: language?.table?.any,
        url: "Villages",
      },
      {
        name: "sources",
        label: language?.people?.source,
        selectLabel: beforeFiltering?.sources?.source_name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, sources: option }),
        tabelFilterIgnoreText: language?.table?.any,
        optionLabel: (option) => option?.source_name,
        url: "Sources",
      },
      {
        name: "sectionId",
        label: language?.people?.section,
        selectLabel: beforeFiltering?.sectionId?.name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, sectionId: option }),
        tabelFilterIgnoreText: language?.table?.any,
        url: "Sections",
        hideSelectoer: role !== "admin",
      },
    ];

    return arrayOfApis.map(
      (input) =>
        !input.hideSelectoer && (
          <SelectInputApi
            key={input.name}
            className="tabel-filter-select"
            isTabelsFilter
            fetchData={getInfinityFeatchApis}
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
            label={input.label}
          />
        )
    );
  }, [beforeFiltering, handleParentChange, role, language]);

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
