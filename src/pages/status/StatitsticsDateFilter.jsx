import useLanguage from "../../hooks/useLanguage";

const StatitsticsDateFilter = ({ dateFilter, setDateFilter }) => {
  const { language } = useLanguage();
  return (
    <div className="statistic-date-fltr">
      <article>
        <label htmlFor="from">{language?.table.from}</label>
        <input
          type="date"
          value={dateFilter?.from || ""}
          onChange={(e) =>
            setDateFilter({ ...dateFilter, from: e.target.value })
          }
          id="from"
        />
      </article>
      <article>
        <label htmlFor="to">{language?.table.to}</label>
        <input
          type="date"
          value={dateFilter?.to || ""}
          onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
          id="to"
        />
      </article>
    </div>
  );
};

export default StatitsticsDateFilter;
