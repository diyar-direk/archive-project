import Skeleton from "react-loading-skeleton";
import useLanguage from "../../hooks/useLanguage";

const StatusCountShow = ({ allData, loading, sectionsCount }) => {
  const { language } = useLanguage();

  if (loading) {
    return (
      <section className="flex gap-20 mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ height: "140px", overflow: "hidden" }}
          >
            <Skeleton />
          </div>
        ))}
      </section>
    );
  }
  if (!allData) return null;

  const calcTotal = (items) =>
    Object.keys(items).reduce((acc, key) => acc + (allData[key] || 0), 0);

  const renderBlock = (
    icon,
    borderColor,
    bgColor,
    textColor,
    title,
    items,
    sumFromItems = false
  ) => {
    const total = sumFromItems ? calcTotal(items) : title;

    return (
      <div style={{ borderColor }}>
        <article className="center gap-10">
          <i
            className={icon}
            style={{ background: bgColor, color: textColor }}
          />
          <h1 className="flex-1">
            {total} {!sumFromItems && ""}
          </h1>
        </article>
        {items && (
          <div>
            {Object.entries(items).map(([key, value], index, array) => (
              <h3 key={key}>
                {allData[key]} {value}
                {index < array.length - 1 && " , "}
              </h3>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="status-section">
      {renderBlock(
        "fa-solid fa-sitemap",
        "rgb(255, 99, 132)",
        "rgba(255, 99, 132, 0.2)",
        "rgb(255, 99, 132)",
        `${allData?.informationCount} ${language?.statistics?.information}`
      )}
      {renderBlock(
        "fa-solid fa-people-group",
        "rgb(75, 192, 192)",
        "rgba(75, 192, 192, 0.2)",
        "rgb(75, 192, 192)",
        `${allData?.personCount} ${language?.statistics?.people}`
      )}
      {renderBlock(
        "fa-solid fa-thumbtack",
        "rgb(153, 102, 255)",
        "rgba(153, 102, 255, 0.2)",
        "rgb(153, 102, 255)",
        `${allData?.coordinateCount} ${language?.statistics?.coordinates}`
      )}
      {renderBlock(
        "fa-solid fa-map-location-dot",
        "rgba(255, 159, 64, 1)",
        "rgba(255, 159, 64, 0.3)",
        "rgba(255, 159, 64,1)",
        `${calcTotal(sectionsCount.addressesEnum)} ${
          language?.statistics?.adress_information
        }`,
        sectionsCount.addressesEnum
      )}
      {renderBlock(
        "fa-solid fa-map-location-dot",
        "rgba(54, 162, 235, 1)",
        "rgba(54, 162, 235, 0.3)",
        "rgba(54, 162, 235, 1)",
        `${calcTotal(sectionsCount.categoriesEnum)} ${
          language?.statistics?.categories
        }`,
        sectionsCount.categoriesEnum
      )}
      {renderBlock(
        "fa-solid fa-map-location-dot",
        "rgba(214, 10, 10, 1)",
        "rgba(214, 10, 10, 0.3)",
        "rgba(214, 10, 10, 1)",
        `${calcTotal(sectionsCount.incomingCount)} ${
          language?.header?.outgoing_incoming
        }`,
        sectionsCount.incomingCount
      )}
      {renderBlock(
        "fa-solid fa-map-location-dot",
        "rgba(48, 179, 59, 1)",
        "rgba(48, 179, 59, 0.3)",
        "rgba(48, 179, 59, 1)",
        `${calcTotal(sectionsCount.reportAndResultCount)} ${
          language?.header?.outgoing_incoming
        }`,
        sectionsCount.reportAndResultCount
      )}
    </section>
  );
};

export default StatusCountShow;
