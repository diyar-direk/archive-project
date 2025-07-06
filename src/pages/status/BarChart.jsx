import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

/**
 * @typedef {Object} Utils
 * @property {string} title - النص الذي سيُعرض كـ label
 * @property {Array} slices - القطع التي ستظهر
 * @property {object} dataCount - جميع البيانات
 * @property {boolean} hideTotalCount
 */

/**
 * @param {Utils} props
 */

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const options = {
  responsive: true,
};

const BarChart = ({ slices, title, dataCount, hideTotalCount }) => {
  const borderColor = getComputedStyle(document.body)
    .getPropertyValue("--body-color")
    .trim();

  const data = {
    labels: Object.entries(slices).map(([, label]) => label),
    datasets: [
      {
        label: "count",
        data: Object.entries(slices)?.map(([key]) => dataCount[key]),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ],
        borderColor: borderColor,
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
    <div className="chart-container bar">
      {title && (
        <h1>
          {!hideTotalCount && totalDataCount} {title}
        </h1>
      )}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
