const StatitsticsDateFilter = ({ dateFilter, setDateFilter }) => {
  return (
    <div className="statistic-date-fltr">
      <article>
        <label htmlFor="from">date From:</label>
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
        <label htmlFor="to">date To:</label>
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
