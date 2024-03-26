import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import SkeletonLineChart from "./SkeletonLineChart";

const LineChart = ({ title, packetData, loading }) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: title,
        data: [],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
      },
      xaxis: {
        categories: [],
      },
      colors: ["#FF5959"], // Adjust line color
      title: {
        text: "Timeline",
        align: "left",
        style: {
          fontSize: "20px",
          fontFamily: "Helvetica",
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
      },
      tooltip: {
        intersect: false,
        shared: true,
      },
      grid: {
        borderColor: "#f1f1f1", // Adjust grid color
      },
      stroke: {
        curve: "smooth", // Make the line smooth and dynamic
        width: 2, // Adjust line width
      },
    },
  });

  useEffect(() => {
    if (packetData === null) {
      setChartData({
        series: [
          {
            name: title,
            data: [0],
          },
        ],
        options: {
          ...chartData.options,
          xaxis: {
            categories: ['No data'],
          },
        },
      });
    } else if (packetData && packetData.length > 0) {
      const latestData = packetData.slice(-60); // Display only the latest 50 data points
      const timeLabels = latestData.map((data) =>
        data && data.time ? new Date(data.time).toLocaleTimeString() : 'No time data'
      );
      const httpValues = latestData.map((data) => data && data.value ? data.value : 0);

      setChartData({
        series: [
          {
            name: title,
            data: httpValues,
          },
        ],
        options: {
          ...chartData.options,
          xaxis: {
            categories: timeLabels,
          },
        },
      });
    }
  }, [packetData, title]); // Added 'title' as dependency

  return (
    <div>
      <h3>{title}</h3>
      {loading ? (
        <SkeletonLineChart />
      ) : (
        <div className="chart-container">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={350}
          />
        </div>
      )}
    </div>
  );
};

export default LineChart;
