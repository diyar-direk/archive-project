const StatusCountShow = ({ allData }) => {
  return (
    <section className="status-section">
      <div
        className="center gap-10"
        style={{ borderColor: "rgb(255, 99, 132)" }}
      >
        <i
          className="fa-solid fa-sitemap"
          style={{
            background: "rgba(255, 99, 132, 0.2)",
            color: "rgb(255, 99, 132)",
          }}
        />
        <h1 className="flex-1">{allData.informationCount} information </h1>
      </div>
      <div
        className="center gap-10"
        style={{ borderColor: "rgb(75, 192, 192)" }}
      >
        <i
          className="fa-solid fa-people-group"
          style={{
            background: "rgba(75, 192, 192, 0.2)",
            color: "rgb(75, 192, 192)",
          }}
        />
        <h1 className="flex-1"> {allData.personCount} person </h1>
      </div>
      <div
        className="center gap-10"
        style={{
          borderColor: "rgba(153, 102, 255)",
        }}
      >
        <i
          className="fa-solid fa-thumbtack"
          style={{
            background: "rgba(153, 102, 255, 0.2)",
            color: "rgb(153, 102, 255)",
          }}
        />
        <h1 className="flex-1">{allData.coordinateCount} coordinate </h1>
      </div>
    </section>
  );
};

export default StatusCountShow;
