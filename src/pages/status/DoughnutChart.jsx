import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
/**
 * @typedef {Object} Utils
 * @property {string} title - النص الذي سيُعرض كـ label
 * @property {Array} slices - القطع التي ستظهر
 * @property {object} dataCount - جميع البيانات
 * @property {Array} labels - تسميات القطع
 * @property {Array} dataArray - بيانات القطع
 * @property {boolean} hideTotalCount
 */

/**
 * @param {Utils} props
 */

ChartJS.register(ArcElement, Tooltip, Legend);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "left",
    },
  },
};
const DoughnutChart = ({
  slices,
  title,
  dataCount,
  hideTotalCount,
  labels,
  dataArray,
}) => {
  const borderColor = getComputedStyle(document.body)
    .getPropertyValue("--body-color")
    .trim();

  const data = {
    labels: labels || Object.entries(slices).map(([, label]) => label),
    datasets: [
      {
        label: "count",
        data:
          dataArray || Object.entries(slices)?.map(([key]) => dataCount[key]),
        backgroundColor: [
          "rgba(255, 99, 132, 0.9)",
          "rgba(255, 159, 64, 0.9)",
          "rgba(255, 205, 86, 0.9)",
          "rgba(75, 192, 192, 0.9)",
          "rgba(54, 162, 235, 0.9)",
          "rgba(153, 102, 255,0.9)",
          "rgba(201, 203, 207,0.9)",
        ],
        borderColor: [borderColor],
        borderWidth: 2,
      },
    ],
  };

  const totalDataCount = useMemo(() => {
    if (hideTotalCount) return;
    const totalCount = Object.entries(slices).reduce((total, [key]) => {
      const count = dataCount[key] || 0;
      return total + count;
    }, 0);
    return totalCount;
  }, [slices, dataCount, hideTotalCount]);

  return (
    <div className="chart-container doughnut">
      {title && (
        <h1>
          {!hideTotalCount && totalDataCount} {title}
        </h1>
      )}
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
