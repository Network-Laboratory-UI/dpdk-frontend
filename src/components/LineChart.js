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
import SkeletonLineChart from "./SkeletonLineChart"; // Import the SkeletonLineChart component

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ title, packetData, loading }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: title,
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        cubicInterpolationMode: "monotone", // Rounded lines
        fill: true, // This enables the fill below the line
      },
    ],
  });

  useEffect(() => {
    if (packetData && packetData.length > 0) {
      const latestData = packetData.slice(-60); // Display only the latest 50 data points
      const timeLabels = latestData.map((data) =>
        new Date(data.time).toLocaleTimeString()
      );
      const httpValues = latestData.map((data) => data.value);

      setChartData((prevData) => ({
        ...prevData,
        labels: timeLabels,
        datasets: [
          {
            ...prevData.datasets[0], // Spread the existing properties
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
      tooltip: {
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Change the background color
        titleColor: "white", // Change the title color
        titleFont: { size: 14 }, // Change the title font size
        bodyColor: "white", // Change the body color
        bodyFont: { size: 10 }, // Change the body font size
        borderColor: "white", // Change the border color
        borderWidth: 1, // Change the border width
        callbacks: {
          title: function (context) {
            return context[0].label; // Customize the title
          },
          label: function (context) {
            return context.dataset.label + ": " + context.parsed.y; // Customize the label
          },
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
      {loading ? (
        <SkeletonLineChart /> // Render skeleton loading state if loading is true
      ) : (
        <div className="chart-container">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default LineChart;
