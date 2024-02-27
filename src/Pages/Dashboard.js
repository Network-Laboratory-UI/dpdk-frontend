import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex flex-row">
      <div className="w-1/5">
        <Sidebar/>
      </div>
      <div className="w-4/5">
        <Outlet/>
      </div>
    </div>
  );
};

export default Dashboard;
