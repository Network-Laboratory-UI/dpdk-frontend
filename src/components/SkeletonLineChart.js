import React from "react";

const SkeletonLineChart = () => {
  return (
    <div
      className="skeleton-chart animate-pulse p-4 m-4"
      style={{ height: "500px" }}
    >
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-full bg-gray-300 rounded"></div>
    </div>
  );
};

export default SkeletonLineChart;