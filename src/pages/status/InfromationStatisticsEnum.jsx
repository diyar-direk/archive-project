import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import DoughnutChart from "./DoughnutChart";
import BarChart from "./BarChart";
import Skeleton from "react-loading-skeleton";

/**
 * @typedef {object} InformationStatisticsEnumProps
 * @property {"section" | "source" | "event" | "party"} CategoryType
 * @property {"bar" | "doughnut"} ChartType
 *@property {string} title
 *@param {InformationStatisticsEnumProps} props
 */

const InformationStatisticsEnum = ({ categoryType, chartType, title }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const context = useContext(Context);
  const token = context?.userDetails?.token;
  const getData = useCallback(async () => {
    data && setData(null);
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${baseURL}/Statistics/countInformation`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [setData, setLoading, page, token, categoryType]);
  useEffect(() => {
    getData();
  }, [getData]);

  const chartPagination = useMemo(
    () => (
      <div className="chart-pagination">
        <button
          disabled={page === 1}
          className="fa-solid fa-chevron-left"
          onClick={() => setPage((prev) => prev - 1)}
        />
        <button
          className="fa-solid fa-chevron-right"
          disabled={data?.length === 0}
          onClick={() => setPage((prev) => prev + 1)}
        />
      </div>
    ),
    [page, data]
  );

  if (loading)
    return (
      <div className="doughnut">
        <Skeleton height={"400px"} width={"100%"} />
      </div>
    );
  if (!data) return;
  return chartType === "bar" ? (
    <BarChart
      title={title}
      hideTotalCount={true}
      labels={data?.map((item) => item.name)}
      dataArray={data?.map((item) => item.infoCount)}
    >
      {chartPagination}
      {data?.length === 0 && <h2 className="no-data">no more data</h2>}
    </BarChart>
  ) : (
    <DoughnutChart
      title={title}
      hideTotalCount={true}
      labels={data?.map((item) => item.name)}
      dataArray={data?.map((item) => item.infoCount)}
    >
      {chartPagination}
      {data?.length === 0 && <h2 className="no-data">no more data</h2>}
    </DoughnutChart>
  );
};

export default InformationStatisticsEnum;
