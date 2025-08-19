import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { baseURL, Context } from "../../context/context";
import axios from "axios";
import BarChart from "./BarChart";
import Skeleton from "react-loading-skeleton";
import useLanguage from "../../hooks/useLanguage";

const DepartmentBarStatistics = ({ dateFilter }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { language } = useLanguage();
  const context = useContext(Context);
  const token = context?.userDetails?.token;
  const getData = useCallback(async () => {
    const params = new URLSearchParams();
    params.append("limit", 1);
    params.append("page", page);

    if (dateFilter.from) params.append("createdAt[gte]", dateFilter.from);
    if (dateFilter.to) params.append("createdAt[lte]", dateFilter.to);

    data && setData(null);
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${baseURL}/Statistics/departmentInformation`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      setData(data.data[0]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }, [page, token, dateFilter]);

  useEffect(() => {
    if (!dateFilter?.from && !dateFilter?.to) getData();
    else {
      const timeOut = setTimeout(() => getData(), 500);
      return () => clearTimeout(timeOut);
    }
  }, [getData, dateFilter]);

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
  return (
    <BarChart
      title={data?.department?.name}
      labels={data?.countsForSections?.map((item) => item.sectionName)}
      dataArray={data?.countsForSections?.map((item) => item.count)}
    >
      {chartPagination}
      {data?.length === 0 && (
        <h2 className="no-data">{language?.people?.no_data}</h2>
      )}
    </BarChart>
  );
};

export default DepartmentBarStatistics;
