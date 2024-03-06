import React from "react";

const SkeletonLineChart = () => {
  return (
    <div className="animate-pulse" style={{ height: "500px" }}>
      {" "}
      {/* Adjust the height as needed */}
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-full bg-gray-300 rounded"></div>
    </div>
  );
};

export default SkeletonLineChart;
