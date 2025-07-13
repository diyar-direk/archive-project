import axios from "axios";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import "./status.css";
import { baseURL, Context } from "../../context/context";
import DoughnutChart from "./DoughnutChart";
import useLanguage from "./../../hooks/useLanguage";
import Skeleton from "react-loading-skeleton";
import StatusCountShow from "./StatusCountShow";
import BarChart from "./BarChart";
import InformationStatisticsEnum from "./InfromationStatisticsEnum";
import StatitsticsDateFilter from "./StatitsticsDateFilter";

const DashboardCharts = () => {
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const token = context?.userDetails?.token;
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [dataCount, setDataCount] = useState(null);
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

  const { language } = useLanguage();
  const dataEnum = useMemo(() => {
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
    return { addressesEnum, categoriesEnum };
  }, [language]);

  return (
    <>
      {dataCount && (
        <StatitsticsDateFilter
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
      )}
      {!loading && dataCount && <StatusCountShow allData={dataCount} />}
      <div className="chart-card-container">
        {loading ? (
          <div className="doughnut">
            <Skeleton height={"400px"} width={"100%"} />
          </div>
        ) : (
          dataCount && (
            <>
              <BarChart
                slices={dataEnum.categoriesEnum}
                dataCount={dataCount}
                title="categories"
              />
              <DoughnutChart
                title="addresses"
                slices={dataEnum.addressesEnum}
                dataCount={dataCount}
              />
            </>
          )
        )}
        <InformationStatisticsEnum
          categoryType="section"
          chartType="doughnut"
          title="information on section"
          dateFilter={dateFilter}
        />
        <InformationStatisticsEnum
          categoryType="source"
          chartType="bar"
          title="information on source"
          dateFilter={dateFilter}
        />
        <InformationStatisticsEnum
          categoryType="event"
          chartType="bar"
          title="information on event"
          dateFilter={dateFilter}
        />
        <InformationStatisticsEnum
          categoryType="party"
          chartType="doughnut"
          title="information on party"
          dateFilter={dateFilter}
        />
      </div>
    </>
  );
};
export default DashboardCharts;
