import { useCallback, useContext, useEffect, useState } from "react";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import DoughnutChart from "./DoughnutChart";
import BarChart from "./BarChart";

const InformationStatisticsEnum = ({ categoryType, chartType, ...props }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const context = useContext(Context);
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${baseURL}/Statistics/countInformation`,
        {
          headers: { Authorization: `Bearer ${context?.userDetails?.token}` },
          params: {
            page,
            limit: 10,
            categoryStatistics: categoryType,
          },
        }
      );
      setData(data.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [setData, setLoading, page, context?.userDetails?.token, categoryType]);
  useEffect(() => {
    getData();
  }, [getData]);
  if (!data) return;
  return chartType === "bar" ? (
    <BarChart
      title="addresses"
      hideTotalCount={true}
      labels={data?.map((item) => item.name)}
      dataArray={data?.map((item) => item.infoCount)}
    />
  ) : (
    <DoughnutChart
      title="addresses"
      hideTotalCount={true}
      labels={data?.map((item) => item.name)}
      dataArray={data?.map((item) => item.infoCount)}
    />
  );
};

export default InformationStatisticsEnum;
