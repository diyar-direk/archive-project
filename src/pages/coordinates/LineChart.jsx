import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const LineChart = ({ slices, title, dataCount, hideTotalCount }) => {
  const data = {
    labels: Object.entries(slices).map(([, label]) => label),
    datasets: [
      {
        label: "count",
        data: Object.entries(slices).map(([key]) => dataCount[key]),
        fill: true,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.4,
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
    <div className="chart-container line">
      {title && (
        <h1>
          {!hideTotalCount && totalDataCount} {title}
        </h1>
      )}
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
