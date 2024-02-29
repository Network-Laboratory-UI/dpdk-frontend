import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ title, packetData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: title,
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        cubicInterpolationMode: "monotone", // Rounded lines
      },
    ],
  });

  useEffect(() => {
    if (packetData && packetData.length > 0) {
      const latestData = packetData.slice(-30); // Display only the latest 50 data points
      const timeLabels = latestData.map((data) =>
        new Date(data.time).toLocaleTimeString()
      );
      const httpValues = latestData.map((data) => data.value);

      setChartData((prevData) => ({
        ...prevData,
        labels: timeLabels,
        datasets: [
          {
            ...prevData.datasets[0],
            data: httpValues,
          },
        ],
      }));
    }
  }, [packetData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        align: "end",
      },
      title: {
        display: true,
        text: "Timeline",
        align: "start",
        font: {
          size: 30,
          family: "Helvetica",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid
        },
      },
      y: {
        grid: {
          display: true, // Show y-axis grid
          color: "rgba(0, 0, 0, 0.1)", // Adjust the color of the horizontal lines
        },
      },
    },
  };

  return (
    <div>
      <h3>{title}</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
