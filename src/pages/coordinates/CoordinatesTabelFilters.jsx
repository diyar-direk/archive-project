import { useCallback, useMemo, useState } from "react";
import TabelFilterDiv from "./../../components/tabelFilterData/TabelFilterDiv";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getInfinityFeatchApis } from "../../infintyFeatchApis";

const CoordinatesTabelFilters = ({ filter, setFilter, setIsopen, setPage }) => {
  const [beforeFiltering, setBeforeFiltering] = useState({ ...filter } || {});

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
    ];

    return arrayOfApis.map((input) => (
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
      {apisSelcteFilter}
    </TabelFilterDiv>
  );
};

export default CoordinatesTabelFilters;
