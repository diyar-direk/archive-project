import DatePicker from "react-datepicker";
import useLanguage from "../../hooks/useLanguage";
import { useCallback } from "react";

const DateFilter = ({ setFilter, filter }) => {
  const { language } = useLanguage();

  const RefreshData = useCallback(() => {
    setFilter((prev) => {
      const refreshedFilters = { ...prev };
      for (const key in refreshedFilters) {
        refreshedFilters[key] = key === "date" ? { from: "", to: "" } : "";
      }
      return refreshedFilters;
    });
  }, [setFilter]);

  return (
    <div className="center wrap date-fltr gap-20">
      <div className="relative flex-1 center gap-10">
        <span>{language?.table?.from}</span>
        <DatePicker
          selected={filter?.date?.from || null}
          showIcon
          showMonthDropdown
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={90}
          onChange={(e) => {
            setFilter({ ...filter, date: { ...filter?.date, from: e } });
          }}
          maxDate={new Date()}
        />
      </div>
      <div className="center flex-1 gap-10 relative">
        <span>{language?.table?.to}</span>
        <DatePicker
          placeholderText={language?.coordinates?.date_to}
          selected={filter?.date?.to || null}
          showIcon
          showMonthDropdown
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={90}
          maxDate={new Date()}
          minDate={filter.date.from || null}
          onChange={(e) =>
            setFilter({ ...filter, date: { ...filter?.date, to: e } })
          }
        />
      </div>
      <i
        title="refresh data"
        onClick={RefreshData}
        className="fa-solid fa-rotate-right"
      ></i>
    </div>
  );
};

export default DateFilter;
