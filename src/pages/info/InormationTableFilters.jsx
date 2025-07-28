import { useCallback, useContext, useMemo, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import TabelFilterDiv from "./../../components/tabelFilterData/TabelFilterDiv";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getPeopleApi } from "../people/api";
import { getInfinityFeatchApis } from "../../utils/infintyFeatchApis";
import { Context } from "../../context/context";

const InormationTableFilters = ({ filter, setFilter, setIsopen, setPage }) => {
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
        name: "credibility",
        label: "credibility",
        ifemptyLabel: "any credibility",
        values: [
          { value: "Low", label: "Low" },
          { value: "Medium", label: "Medium" },
          { value: "High", label: "High" },
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

  const apisSelcteFilter = useMemo(() => {
    const arrayOfApis = [
      {
        name: "people",
        label: language?.header?.person,
        selectLabel: beforeFiltering?.people
          ? `${beforeFiltering?.people?.firstName} ${beforeFiltering?.people?.fatherName} ${beforeFiltering?.people?.surName}`
          : "",
        optionLabel: (option) => {
          return `${option?.firstName} ${option?.fatherName} ${option?.surName}`;
        },
        onChange: (option) => handleParentChange("people", option),
        fetchData: getPeopleApi,
      },
      {
        name: "countryId",
        label: language?.header?.country,
        selectLabel: beforeFiltering?.countryId?.firstName,
        onChange: (option) => handleParentChange("countryId", option),
        url: "Countries",
      },
      {
        name: "countyId",
        label: language?.header?.county,
        selectLabel: beforeFiltering?.countyId?.name,
        onChange: (option) => handleParentChange("countyId", option),
        url: "Counties",
      },
      {
        name: "governorateId",
        label: language?.header?.government,
        selectLabel: beforeFiltering?.governorateId?.name,
        onChange: (option) => handleParentChange("governorateId", option),
        url: "Governorates",
      },
      {
        name: "cityId",
        label: language?.header?.city,
        selectLabel: beforeFiltering?.cityId?.name,
        onChange: (option) => handleParentChange("cityId", option),
        url: "Cities",
      },
      {
        name: "streetId",
        label: language?.header?.street,
        selectLabel: beforeFiltering?.streetId?.name,
        onChange: (option) =>
          setBeforeFiltering((prev) => ({
            ...prev,
            streetId: option,
          })),
        url: "Streets",
      },
      {
        name: "regionId",
        label: language?.header?.region,
        selectLabel: beforeFiltering?.regionId?.name,
        onChange: (option) =>
          setBeforeFiltering((prev) => ({
            ...prev,
            regionId: option,
          })),
        url: "Regions",
      },
      {
        name: "villageId",
        label: language?.header?.village,
        selectLabel: beforeFiltering?.villageId?.name,
        onChange: (option) =>
          setBeforeFiltering((prev) => ({
            ...prev,
            villageId: option,
          })),
        url: "Villages",
      },
      {
        name: "sectionId",
        label: language?.header?.section,
        selectLabel: beforeFiltering?.sectionId?.name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, sectionId: option }),
        url: "Sections",
        hideSelectoer: role !== "admin",
      },
      {
        name: "sources",
        label: language?.header?.source,
        selectLabel: beforeFiltering?.sources?.source_name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, sources: option }),
        optionLabel: (option) => option?.source_name,
        url: "Sources",
      },
      {
        name: "parties",
        label: language?.header?.party,
        selectLabel: beforeFiltering?.parties?.name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, parties: option }),
        url: "Parties",
      },
      {
        name: "events",
        label: language?.header?.event,
        selectLabel: beforeFiltering?.events?.name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, events: option }),
        url: "Events",
      },
    ];

    return arrayOfApis.map((input) => (
      <SelectInputApi
        key={input.name}
        label={input.label}
        className="tabel-filter-select"
        isTabelsFilter
        fetchData={input.fetchData ? input.fetchData : getInfinityFeatchApis}
        selectLabel={input.selectLabel}
        optionLabel={
          input.optionLabel ? input.optionLabel : (option) => option?.name
        }
        onChange={input.onChange}
        tabelFilterIgnoreText={language?.table?.any}
        onIgnore={() =>
          setBeforeFiltering({ ...beforeFiltering, [input.name]: "" })
        }
        url={input.url}
      />
    ));
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

export default InormationTableFilters;
