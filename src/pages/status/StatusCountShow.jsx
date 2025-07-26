import Skeleton from "react-loading-skeleton";
import useLanguage from "../../hooks/useLanguage";

const StatusCountShow = ({
  allData,
  totalAddressCount,
  totalCategoriesCount,
  loading,
}) => {
  const { language } = useLanguage();
  if (loading)
    return (
      <section className="flex gap-20 mb-10">
        <div className="flex-1" style={{ height: "140px", overflow: "hidden" }}>
          <Skeleton />
        </div>
        <div className="flex-1" style={{ height: "140px", overflow: "hidden" }}>
          <Skeleton />
        </div>
        <div className="flex-1" style={{ height: "140px", overflow: "hidden" }}>
          <Skeleton />
        </div>
        <div className="flex-1" style={{ height: "140px", overflow: "hidden" }}>
          <Skeleton />
        </div>
        <div className="flex-1" style={{ height: "140px", overflow: "hidden" }}>
          <Skeleton />
        </div>
      </section>
    );
  if (!allData) return;
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
        <h1 className="flex-1">
          {allData?.informationCount} {language.statistics.information}
        </h1>
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
        <h1 className="flex-1"> {allData?.personCount} {language.statistics.people} </h1>
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
        <h1 className="flex-1">{allData?.coordinateCount} {language.statistics.coordinates} </h1>
      </div>
      <div
        className="center gap-10"
        style={{
          borderColor: "rgba(255, 159, 64, 1)",
        }}
      >
        <i
          className="fa-solid fa-map-location-dot"
          style={{
            background: "rgba(255, 159, 64, 0.3)",
            color: "rgba(255, 159, 64,1)",
          }}
        />
        <h1 className="flex-1">{totalAddressCount} {language.statistics.adress_information} </h1>
      </div>
      <div
        className="center gap-10"
        style={{
          borderColor: "rgba(54, 162, 235, 1)",
        }}
      >
        <i
          className="fa-solid fa-map-location-dot"
          style={{
            background: "rgba(54, 162, 235, 0.3)",
            color: "rgba(54, 162, 235, 1)",
          }}
        />
        <h1 className="flex-1">{totalCategoriesCount} {language.statistics.categories} </h1>
      </div>
    </section>
  );
};

export default StatusCountShow;
