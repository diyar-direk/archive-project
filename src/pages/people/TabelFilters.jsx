import { useMemo } from "react";
import useLanguage from "../../hooks/useLanguage";
import TabelFilterDiv from "./../../components/tabelFilterData/TabelFilterDiv";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { getPeopleApi } from "./api";
const TabelFilters = ({ filter, setFilter, setIsopen, setPage }) => {
  const { language } = useLanguage();

  const staticFilters = useMemo(() => {
    const staticFilter = [
      {
        name: "gender",
        values: [
          { value: "", label: language?.table?.all_genders },
          { value: "female", label: language?.table?.female },
          { value: "male", label: language?.table?.male },
        ],
      },
      {
        name: "maritalStatus",
        values: [
          { value: "", label: language?.people?.all_marital_status },
          { value: "married", label: language?.table?.married },
          { value: "single", label: language?.table?.single },
          { value: "other", label: language?.table?.other },
        ],
      },
    ];
    const items = staticFilter.map((itm) => (
      <div className="select relative active" key={itm.name}>
        <div className="center gap-10 w-100">
          <span className="pointer-none">{itm.name}</span>
          <i className="fa-solid fa-sort-down pointer-none" />
        </div>
        <article>
          {itm.values.map((value) => (
            <h2 key={value.value}> {value.label} </h2>
          ))}
        </article>
      </div>
    ));
    return items;
  }, [language]);

  return (
    <TabelFilterDiv
      setFilter={setFilter}
      filter={filter}
      setIsopen={setIsopen}
      setPage={setPage}
    >
      {staticFilters}
      <SelectInputApi
        className="tabel-filters"
        fetchData={getPeopleApi}
        selectLabel={"people"}
        optionLabel={(option) => option?.firstName}
        onChange={(option) => setFilter({ ...filter, role: option?._id })}
        value={filter.people}
        onIgnore={() => setFilter({ ...filter, people: "" })}
      />
    </TabelFilterDiv>
  );
};

export default TabelFilters;
