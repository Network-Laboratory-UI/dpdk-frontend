import React, { useEffect, useState } from "react";
import NPBCard from "../components/NPBCard"; // Updated import statement
import PolicyServerCard from "../components/PSCard"; // Updated import statement
import axios from "axios";

const Home = () => {
  const npbData = [
    {
      id: 1,
      name: "Packet Broker 1 lagi kuy",
      status: "Active",
      location: "Jalan H Mean 1 No 1",
    },
    {
      id: 2,
      name: "Packet Broker 2",
      status: "Inactive",
      location: "Location 2",
    },
    {
      id: 3,
      name: "Packet Broker 3",
      status: "Inactive",
      location: "Location 3",
    },
    // Add more data as needed
  ];

  const policyServerData = [
    {
      id: 1,
      name: "Policy Server 1",
      status: "Active",
      location: "Jalan Xyz 1 No 1",
    },
    {
      id: 2,
      name: "Policy Server 2 Test Untuk saya adalah hebat",
      status: "Inactive",
      location: "Location 2",
    },
    {
      id: 3,
      name: "Policy Server 3",
      status: "Inactive",
      location: "Location 3",
    },
    // Add more Policy Server data as needed
  ];

  const [npbCards, setNpbCards] = useState(npbData);
  const [policyServerCards, setPolicyServerCards] = useState(policyServerData); // Add state for Policy Server

  return (
    <div className="max-w-full">
      {/* Header with packet broker details */}
      <header>
        <div className="flex items-center space-x-1 ml-10 mt-6">
          <h2 className="text-gray-400 font-helvetica text-1 font-normal">
            Pages
          </h2>
          <h2 className="text-black font-helvetica text-1 font-normal">
            / Dashboard
          </h2>
        </div>
      </header>
      <p className="text-gray-700 font-helvetica text-2 font-bold ml-10">
        Dashboard
      </p>
      <div className="w-[416px] h-4 text-gray-700 text-2xl font-bold font-['Helvetica'] mt-6 ml-10">
        Packet Broker
      </div>
      {/* Packet Broker row */}
      <div className="flex mt-7 ml-10 space-x-4">
        {npbCards.map((card) => (
          <NPBCard key={card.id} {...card} />
        ))}
      </div>
      <div className="w-[416px] h-4 text-gray-700 text-2xl font-bold font-['Helvetica'] mt-20 ml-10">
        Policy Server
      </div>
      {/* Policy Server row */}
      <div className="flex mt-7 ml-10 space-x-4">
        {policyServerCards.map((card) => (
          <PolicyServerCard key={card.id} {...card} />
        ))}
      </div>
      {/* Other components or content */}
    </div>
  );
};

export default Home;