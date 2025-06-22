import DatePicker from "react-datepicker";
import useLanguage from "../../hooks/useLanguage";

const DateFilter = ({ setFilter, filter }) => {
  const { language } = useLanguage();
  return (
    <div className="center wrap date-fltr gap-20">
      <div className="relative flex-1 center gap-10">
        <span>{language?.table?.from}</span>
        <DatePicker
          selected={filter?.date?.from}
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
          selected={filter?.date?.to}
          showIcon
          showMonthDropdown
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={90}
          maxDate={new Date()}
          minDate={filter.date.from}
          onChange={(e) =>
            setFilter({ ...filter, date: { ...filter?.date, to: e } })
          }
        />
      </div>
      <i
        title="refresh data"
        onClick={() => setFilter({ ...filter })}
        className="fa-solid fa-rotate-right"
      ></i>
    </div>
  );
};

export default DateFilter;
