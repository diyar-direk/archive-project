import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
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

ChartJS.register(ArcElement, Tooltip, Legend);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "left",
    },
  },
};
const DoughnutChart = ({ title, labels, dataArray, children }) => {
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
          "rgba(255, 99, 132, 0.9)",
          "rgba(255, 159, 64, 0.9)",
          "rgba(255, 205, 86, 0.9)",
          "rgba(75, 192, 192, 0.9)",
          "rgba(54, 162, 235, 0.9)",
          "rgba(153, 102, 255,0.9)",
          "rgba(201, 203, 207,0.9)",
          "rgba(5, 49, 75, 0.79)",
          "rgba(214, 10, 10, 0.78)",
          "rgba(48, 179, 59, 0.66)",
        ],
        borderColor: [borderColor],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="chart-container doughnut">
      {title && <h1>{title}</h1>}
      <Doughnut data={data} options={options} />
      {children}
    </div>
  );
};

export default DoughnutChart;
