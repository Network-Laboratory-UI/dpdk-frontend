import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NPBCard from "../components/NPBCard";
import PolicyServerCard from "../components/PSCard";
import AddNewDevice from "../components/AddNewDevice";

const Home = () => {
  const navigateTo = useNavigate();
  const [npbCards, setNpbCards] = useState([]);
  const [policyServerCards, setPolicyServerCards] = useState([]);
  const [isAddNewDeviceOpen, setIsAddNewDeviceOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/npb/npbs`)
      .then((response) => {
        const data = response.data;
        setNpbCards(data);
      })
      .catch((error) => {
        console.error("Error fetching NPB data: ", error);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/ps/pss`)
      .then((response) => {
        const data = response.data;
        setPolicyServerCards(data);
      })
      .catch((error) => {
        console.error("Error fetching Policy Server data: ", error);
      });
  };

  const openPopup = () => {
    setIsAddNewDeviceOpen(true);
  };

  const closePopup = () => {
    setIsAddNewDeviceOpen(false);
  };

  const handleNpbCardClick = (id) => {
    navigateTo(`npb?id=${id}`);
  };

  const handlePolicyServerCardClick = (id) => {
    navigateTo(`ps?id=${id}`);
  };

  const handleDeviceAdded = () => {
    fetchData(); // Reload data after adding a new device
  };

  return (
    <div className="relative">
      <header>
        <div className="flex items-center space-x-1 ml-10 mt-3">
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
      <button
        onClick={openPopup}
        className="ml-10 mt-2 hover:bg-red-500 bg-red-primary rounded-lg shadow-lg text-white font-bold py-2 px-4"
      >
        Add new Devices +
      </button>

      <AddNewDevice
        isOpen={isAddNewDeviceOpen}
        onClose={closePopup}
        onDeviceAdded={handleDeviceAdded}
      />

      {/* Packet Broker section */}
      <div className="w-[416px] h-4 text-gray-700 text-2xl font-bold font-['Helvetica'] mt-3 ml-10">
        Packet Broker
      </div>
      <div className="ml-auto"></div>
      <div className="flex mt-5 ml-10 space-x-4">
        {npbCards.map((card) => (
          <div
            key={card.id}
            className="card-container hover:cursor-pointer"
            onClick={() => handleNpbCardClick(card.id)}
          >
            <NPBCard {...card} />
          </div>
        ))}
      </div>

      {/* Policy Server section */}
      <div className="w-[416px] text-gray-700 text-2xl font-bold font-['Helvetica'] mt-20 ml-10">
        Policy Server
      </div>
      <div className="flex mt-2 ml-10 space-x-4">
        {policyServerCards.map((card) => (
          <div
            key={card.id}
            className="card-container hover:cursor-pointer"
            onClick={() => handlePolicyServerCardClick(card.id)}
          >
            <PolicyServerCard {...card} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
