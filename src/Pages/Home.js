import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import NPBCard from "../components/NPBCard";
import PolicyServerCard from "../components/PSCard";
import AddNewDevice from "../components/AddNewDevice";
import ProgressSpinner from "../components/ProgressSpinner"; // Import ProgressSpinner component

const Home = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const [npbCards, setNpbCards] = useState([]);
  const [policyServerCards, setPolicyServerCards] = useState([]);
  const [isAddNewDeviceOpen, setIsAddNewDeviceOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for initial data fetch
  const token = localStorage.getItem("token");
  if(!token) {
    navigateTo("/");
  }

  useEffect(() => {
    // Restore state when coming back from another page
    const state = location.state;
    if (state) {
      setNpbCards(state.npbCards);
      setPolicyServerCards(state.policyServerCards);
      setLoading(false); // Set loading to false after restoring state
    } else {
      fetchData(); // Fetch data only if no state found (initial page load)
    }
  }, [location.state]);

  useEffect(() => {
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

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
      })
      .finally(() => {
        setLoading(false); // Set loading to false after data fetch completes
      });
  };

  const updateData = () => {
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
    navigateTo(`npb?id=${encodeURIComponent(id)}`, {
      state: { npbCards, policyServerCards },
    });
  };

  const handlePolicyServerCardClick = (id) => {
    navigateTo(`ps?id=${encodeURIComponent(id)}`, {
      state: { npbCards, policyServerCards },
    });
  };


  const handleDeviceAdded = () => {
    updateData();
  };

  return (
    <div className="relative">
      {/* Loading spinner only for initial data fetch */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center">
          <ProgressSpinner />
        </div>
      )}

      <header>
        <div className="flex items-center space-x-1 mt-3">
          <p className="text-gray-400 font-['Helvetica'] text-lg font-normal">
            Pages
          </p>
          <p className="text-gray-600 font-['Helvetica'] text-lg font-bold">
            / Home
          </p>
        </div>
      </header>
      <p className="text-gray-700 font-['Helvetica'] text-lg font-bold ">
        Dashboard
      </p>
      <button
        onClick={openPopup}
        className=" mt-3 hover:bg-red-500 bg-red-primary rounded-lg shadow-lg text-white font-bold py-2 px-4"
      >
        Add new Devices +
      </button>

      <AddNewDevice
        isOpen={isAddNewDeviceOpen}
        onClose={closePopup}
        onDeviceAdded={handleDeviceAdded}
      />

      {/* Packet Broker section */}
      <div className="w-2 h-4 text-gray-700 text-2xl font-bold font-['Helvetica'] mt-3 ">
        Packet Broker
      </div>
      <div className="ml-auto"></div>
      <div className="flex mt-5  space-x-4">
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
      <div className="w-[416px] text-gray-700 text-2xl font-bold font-['Helvetica'] mt-20 ">
        Policy Server
      </div>
      <div className="flex mt-2  space-x-4">
        {policyServerCards.map((card) => (
          <div
            key={card.id}
            className="card-container hover:cursor-pointer "
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
