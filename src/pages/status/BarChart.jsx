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
 * @property {Array} labels - تسميات القطع
 * @property {Array} dataArray - بيانات القطع
 * @property {boolean} hideTotalCount
 * @property {ReactNode} children - أي محتوى إضافي يمكن تمريره
 */
/**
 * @param {Utils} props
 */

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const options = {
  responsive: true,
};

const BarChart = ({
  slices,
  title,
  dataCount,
  hideTotalCount,
  labels,
  dataArray,
  children,
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
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 205, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(153, 102, 255,0.7)",
          "rgba(201, 203, 207,0.7)",
          "rgba(5, 49, 75, 0.79)",
          "rgba(214, 10, 10, 0.78)",
          "rgba(48, 179, 59, 0.66)",
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
      {children}
    </div>
  );
};

export default BarChart;
