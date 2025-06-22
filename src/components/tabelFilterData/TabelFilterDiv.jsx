import DateFilter from "../../components/tabelFilterData/DateFilter";
import useLanguage from "../../hooks/useLanguage";

const TabelFilterDiv = ({
  filter,
  setFilter,
  setIsopen,
  children,
  setPage,
}) => {
  const { language } = useLanguage();

  return (
    <div className="overlay">
      <div onClick={(e) => e.stopPropagation()} className="table-fltr">
        <DateFilter filter={filter} setFilter={setFilter} />
        <div className="filters"> {children} </div>

        <div className="gap-10 center filters-setting">
          <span
            onClick={() => {
              setPage(1);
              //   props?.fltr?.setFilters(fltr);
              setIsopen(false);
            }}
          >
            {language?.table?.okay}
          </span>
          <span
            className="cencel-fltr"
            onClick={() => {
              setIsopen(false);
            }}
          >
            {language?.table?.cancel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TabelFilterDiv;
