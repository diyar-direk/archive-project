import axios from "axios";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./status.css";
import "./export-as-pdf.css";
import { baseURL, Context } from "../../context/context";
import StatusCountShow from "./StatusCountShow";
import InformationStatisticsEnum from "./InfromationStatisticsEnum";
import StatitsticsDateFilter from "./StatitsticsDateFilter";
import WordExporter from "./WordExporter";
import useLanguage from "../../hooks/useLanguage";
import { useReactToPrint } from "react-to-print";
const chartType = ["bar", "doughnut"];

const DashboardCharts = () => {
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const { language } = useLanguage();
  const token = context?.userDetails?.token;
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [dataCount, setDataCount] = useState(null);
  const { role } = context.userDetails;
  const fetchDataCount = useCallback(async () => {
    let utl = `${baseURL}/Statistics/countDocuments`;
    if (dateFilter.from && dateFilter.to) {
      utl += `?createdAt[gte]=${dateFilter.from}&createdAt[lte]=${dateFilter.to}`;
    } else if (dateFilter.from && !dataCount.to) {
      utl += `?createdAt[gte]=${dateFilter.from}`;
    } else if (dateFilter.to && !dateFilter.from) {
      utl += `?createdAt[lte]=${dateFilter.to}`;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(utl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDataCount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [token, dateFilter]);

  useEffect(() => {
    if (!dateFilter.from && !dateFilter.to) fetchDataCount();
    else {
      const timeOut = setTimeout(() => fetchDataCount(), 500);
      return () => clearTimeout(timeOut);
    }
    fetchDataCount();
  }, [fetchDataCount, dateFilter]);

  const [dataWhitPageinations, setDataWithPaginations] = useState({});

  const sectionsCount = useMemo(() => {
    return {
      addressesEnum: {
        countryCount: language?.header?.countries,
        governorateCount: language?.header?.governments,
        countyCount: language?.header?.counties,
        cityCount: language?.header?.cities,
        streetCount: language?.header?.streets,
        regionCount: language?.header?.regions,
        villageCount: language?.header?.villages,
      },
      categoriesEnum: {
        sectionCount: language?.header?.sections,
        departmentCount: language?.header?.departments,
        fieldCount: language?.header?.fields,
        sourceCount: language?.header?.sources,
        eventCount: language?.header?.event,
        partyCount: language?.header?.parties,
      },
      incomingCount: {
        exportCount: language?.header?.incoming,
        recipientCount: language?.header?.recipients,
      },
      reportAndResultCount: {
        reportCount: language?.header?.reports,
        resultCount: language?.header?.results,
      },
    };
  }, [language]);

  const arrayOfchartes = useMemo(
    () => [
      {
        categoryType: "country",
        title: language?.statistics?.information_for_country,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "governorate",
        title: language?.statistics?.information_for_each_governorate,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "county",
        title: language?.statistics?.information_for_each_county,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "city",
        title: language?.statistics?.information_for_each_city,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "region",
        title: language?.statistics?.information_for_each_region,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "street",
        title: language?.statistics?.information_for_each_street,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "village",
        title: language?.statistics?.information_for_each_village,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "section",
        title: language?.statistics?.information_for_each_section,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
        hide: role !== "admin",
      },
      {
        categoryType: "department",
        title: language?.statistics?.information_for_each_department,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "source",
        title: language?.statistics?.information_for_each_source,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "event",
        title: language?.statistics?.information_for_each_event,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "party",
        title: language?.statistics?.information_for_each_party,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "Exports",
        title: language?.statistics?.export_for_each_recipient,
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
        url: "CountExports",
      },
    ],
    [role, language]
  );

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <>
      {dataCount && (
        <div className="export-as-word flex">
          <WordExporter
            date={dateFilter}
            dataCount={dataCount}
            dataWhitPageinations={dataWhitPageinations}
            sectionsCount={sectionsCount}
          />
          <i
            onClick={reactToPrintFn}
            className="fa-solid fa-file-pdf"
            title="export ad pdf"
          />
        </div>
      )}

      {dataCount && (
        <StatitsticsDateFilter
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
      )}
      <section ref={contentRef}>
        <StatusCountShow
          allData={dataCount}
          sectionsCount={sectionsCount}
          loading={loading}
        />

        <div className="chart-card-container">
          {arrayOfchartes.map(
            (chart) =>
              !chart.hide && (
                <InformationStatisticsEnum
                  key={chart.categoryType}
                  categoryType={chart.categoryType}
                  chartType={chart.chartType}
                  title={chart.title}
                  dateFilter={dateFilter}
                  setDataWithPaginations={setDataWithPaginations}
                  url={chart.url || "countInformation"}
                />
              )
          )}
        </div>
      </section>
    </>
  );
};
export default DashboardCharts;
