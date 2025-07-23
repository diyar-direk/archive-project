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
        ifemptyLabel: language?.table?.all_genders,
        label: "gender",
        values: [
          { value: "Female", label: language?.table?.female },
          { value: "Male", label: language?.table?.male },
        ],
      },
      {
        name: "maritalStatus",
        label: "maritalStatus",
        ifemptyLabel: language?.people?.all_marital_status,
        values: [
          { value: "Married", label: language?.table?.married },
          { value: "Single", label: language?.table?.single },
          { value: "Other", label: language?.table?.other },
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
        name: "countryId",
        label: "country",
        selectLabel: beforeFiltering?.countryId?.name,
        onChange: (option) => handleParentChange("countryId", option),
        tabelFilterIgnoreText: "any country",
        url: "Countries",
      },
      {
        name: "countyId",
        label: "county",
        selectLabel: beforeFiltering?.countyId?.name,
        onChange: (option) => handleParentChange("countyId", option),
        tabelFilterIgnoreText: "any county",
        url: "Counties",
      },
      {
        label: "Government",
        name: "governorateId",
        selectLabel: beforeFiltering?.governorateId?.name,
        onChange: (option) => handleParentChange("governorateId", option),
        tabelFilterIgnoreText: "any governorate",
        url: "Governorates",
      },
      {
        name: "cityId",
        label: "city",
        selectLabel: beforeFiltering?.cityId?.name,
        onChange: (option) => handleParentChange("cityId", option),
        tabelFilterIgnoreText: "any city",
        url: "Cities",
      },
      {
        name: "streetId",
        label: "street",
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
        label: "region",
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
        label: "village",
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
        label: "sources",
        selectLabel: beforeFiltering?.sources?.source_name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, sources: option }),
        tabelFilterIgnoreText: "any source",
        optionLabel: (option) => option?.source_name,
        url: "Sources",
      },
      {
        name: "sectionId",
        label: "section",
        selectLabel: beforeFiltering?.sectionId?.name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, sectionId: option }),
        tabelFilterIgnoreText: "any section",
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
  }, [beforeFiltering, handleParentChange, role]);

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
