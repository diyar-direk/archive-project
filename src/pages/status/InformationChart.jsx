import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useContext, useEffect, useMemo, useState } from "react";

import { Doughnut } from "react-chartjs-2";
import { baseURL, Context } from "../../context/context";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["أحمر", "أزرق", "أصفر"],
  datasets: [
    {
      label: "النسبة المئوية",
      data: [30, 40, 30],
      backgroundColor: ["#f87171", "#60a5fa", "#facc15"],
      borderColor: ["#fff", "#fff", "#fff"],
      borderWidth: 2,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

const DashboardCharts = () => {
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const token = context?.userDetails?.token;
  const addressesEnum = {
    countryCount: "country",
    governorateCount: "governorate",
    countyCount: "county",
    cityCount: "city",
    streetCount: "street",
    regionCount: "region",
    villageCount: "village",
  };
  const [dataCount, setDataCount] = useState(null);

  useEffect(() => {
    const fetchDataCount = async () => {
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
      }
    };

    fetchDataCount();
  }, [token]);

  return (
    <div className="grid-2">
      <div>
        <h1>address</h1>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
export default DashboardCharts;
