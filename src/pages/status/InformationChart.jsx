import axios from "axios";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import "./status.css";
import { baseURL, Context } from "../../context/context";
import StatusCountShow from "./StatusCountShow";
import InformationStatisticsEnum from "./InfromationStatisticsEnum";
import StatitsticsDateFilter from "./StatitsticsDateFilter";
import WordExporter from "./WordExporter";
const chartType = ["bar", "doughnut"];

const DashboardCharts = () => {
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
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

  const addressAndCategoriesCount = useMemo(() => {
    if (!dataCount) return;
    const addressesEnum = {
      countryCount: "country",
      governorateCount: "governorate",
      countyCount: "county",
      cityCount: "city",
      streetCount: "street",
      regionCount: "region",
      villageCount: "village",
    };
    const categoriesEnum = {
      sectionCount: "sections",
      fieldCount: "fields",
      sourceCount: "sources",
      eventCount: "event",
      partyCount: "parties",
    };
    const addressCount = Object.entries(addressesEnum).reduce(
      (total, [key]) => {
        const count = dataCount[key] || 0;
        return total + count;
      },
      0
    );
    const categoriesCount = Object.entries(categoriesEnum).reduce(
      (total, [key]) => {
        const count = dataCount[key] || 0;
        return total + count;
      },
      0
    );
    return { addressCount, categoriesCount };
  }, [dataCount]);

  const arrayOfchartes = useMemo(
    () => [
      {
        categoryType: "country",
        title: "information on country",
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "governorate",
        title: "information on governorate",
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "county",
        title: "information on county",
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "city",
        title: "information on city",
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "region",
        title: "information on region",
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "street",
        title: "information on street",
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "village",
        title: "information on village",
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "section",
        title: "information on section",
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
        hide: role !== "admin",
      },
      {
        categoryType: "source",
        title: "information on source",
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "event",
        title: "information on event",
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
      {
        categoryType: "party",
        title: "information on party",
        chartType: chartType[Math.floor(Math.random() * chartType.length)],
      },
    ],
    [role]
  );

  return (
    <>
      {dataCount && (
        <WordExporter
          date={dateFilter}
          dataCount={dataCount}
          dataWhitPageinations={dataWhitPageinations}
          totalCategoriesCount={addressAndCategoriesCount.categoriesCount}
          totalAddressCount={addressAndCategoriesCount.addressCount}
        />
      )}
      {dataCount && (
        <StatitsticsDateFilter
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
      )}

      <StatusCountShow
        allData={dataCount}
        totalCategoriesCount={addressAndCategoriesCount?.categoriesCount}
        totalAddressCount={addressAndCategoriesCount?.addressCount}
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
              />
            )
        )}
      </div>
    </>
  );
};
export default DashboardCharts;
