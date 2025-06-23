import DateFilter from "../../components/tabelFilterData/DateFilter";
import useLanguage from "../../hooks/useLanguage";

const TabelFilterDiv = ({
  setFilter,
  setIsopen,
  children,
  setPage,
  beforeFiltering,
  setBeforeFiltering,
}) => {
  const { language } = useLanguage();

  return (
    <div className="overlay">
      <div onClick={(e) => e.stopPropagation()} className="table-fltr">
        <DateFilter filter={beforeFiltering} setFilter={setBeforeFiltering} />
        <div className="filters"> {children} </div>

        <div className="gap-10 center filters-setting">
          <span
            onClick={() => {
              setPage(1);
              setFilter(beforeFiltering);
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
