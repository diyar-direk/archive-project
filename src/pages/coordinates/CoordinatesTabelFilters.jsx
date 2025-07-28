import { useCallback, useContext, useMemo, useState } from "react";
import TabelFilterDiv from "./../../components/tabelFilterData/TabelFilterDiv";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getInfinityFeatchApis } from "../../utils/infintyFeatchApis";
import { Context } from "../../context/context";
import useLanguage from "../../hooks/useLanguage";

const CoordinatesTabelFilters = ({ filter, setFilter, setIsopen, setPage }) => {
  const [beforeFiltering, setBeforeFiltering] = useState({ ...filter } || {});
  const context = useContext(Context);
  const { role } = context.userDetails;
  const { language } = useLanguage();
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

  const apisSelcteFilter = useMemo(() => {
    const arrayOfApis = [
      {
        name: "countryId",
        label: language?.header?.country,
        selectLabel: beforeFiltering?.countryId?.name,
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
        name: "sources",
        label: language?.header?.source,
        selectLabel: beforeFiltering?.sources?.source_name,
        onChange: (option) =>
          setBeforeFiltering({ ...beforeFiltering, sources: option }),
        optionLabel: (option) => option?.source_name,
        url: "Sources",
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
            tabelFilterIgnoreText={language?.table?.any}
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
      {apisSelcteFilter}
    </TabelFilterDiv>
  );
};

export default CoordinatesTabelFilters;
