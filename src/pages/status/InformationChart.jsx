import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import "./status.css";
import { baseURL, Context } from "../../context/context";
import DoughnutChart from "./DoughnutChart";
import useLanguage from "./../../hooks/useLanguage";
import Skeleton from "react-loading-skeleton";
import StatusCountShow from "./StatusCountShow";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import InformationStatisticsEnum from "./InfromationStatisticsEnum";

const DashboardCharts = () => {
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const token = context?.userDetails?.token;

  const [dataCount, setDataCount] = useState(null);

  useEffect(() => {
    const fetchDataCount = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${baseURL}/Statistics/countDocuments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDataCount(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataCount();
  }, [token]);

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

  if (loading)
    return (
      <div className="grid-2">
        <Skeleton height={"400px"} width={"100%"} />
        <Skeleton height={"400px"} width={"100%"} />
      </div>
    );
  if (!dataCount) return <h1 className="error">error fetching data</h1>;

  return (
    <>
      <StatusCountShow allData={dataCount} />
      <div className="chart-card-container">
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
        <InformationStatisticsEnum categoryType="source" chartType="bar" />
      </div>
    </>
  );
};
export default DashboardCharts;
