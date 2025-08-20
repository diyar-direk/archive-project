import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

/**
 * @typedef {Object} Utils
 * @property {string} title - النص الذي سيُعرض كـ label
 * @property {Array} labels - تسميات القطع
 * @property {Array} dataArray - بيانات القطع
 * @property {ReactNode} children - أي محتوى إضافي يمكن تمريره
 */
/**
 * @param {Utils} props
 */

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const options = {
  responsive: true,
};

const BarChart = ({ title, labels, dataArray, children }) => {
  const borderColor = getComputedStyle(document.body)
    .getPropertyValue("--body-color")
    .trim();
  const data = {
    labels: labels,
    datasets: [
      {
        label: "count",
        data: dataArray,
        backgroundColor: [
          "rgba(214, 10, 10, 0.78)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 205, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(153, 102, 255,0.7)",
          "rgba(201, 203, 207,0.7)",
          "rgba(5, 49, 75, 0.79)",
          "rgba(48, 179, 59, 0.66)",
        ],
        borderColor: borderColor,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="chart-container bar">
      {title && <h1>{title}</h1>}
      {children}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
