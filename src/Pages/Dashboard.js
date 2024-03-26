import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <div className="static top-0 w-1/6">
        <Sidebar />
      </div>
      <div className="w-5/6 pl-5">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
