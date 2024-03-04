import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import LineChart from "../components/LineChart";
import axios from "axios";
import generateConfigFileContent from "../components/GenerateConfigFileContent";
import ProgressSpinner from "../components/ProgressSpinner"; // Import ProgressSpinner component
import BlockedListTable from "../components/BlockedListTable"; // Import BlockedListTable component

function Ps() {
  const location = useLocation();
  const navigateTo = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = decodeURIComponent(searchParams.get("id"));
  const [loading, setLoading] = useState(true); // Loading state
  const [policyServer, setPolicyServer] = useState({
    id: "",
    name: "",
    location: "",
  });
  const [graphData, setGraphData] = useState([]); // For graph data
  const [totalPacket, setTotalPacket] = useState({
    rstClient: 0,
    rstServer: 0,
    txCount: 0,
    rxCount: 0,
  }); // For card total
  const token = localStorage.getItem("token");
  if (!token) {
    navigateTo("/");
  }

  useEffect(() => {
    let initialFetchCompleted = false;

    const fetchData = async () => {
      try {
        if (!initialFetchCompleted) {
          setLoading(true); // Show loading state only for initial fetch
        }

        // Fetch graph data
        const graphResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/ps/ps-packet/${id}`
        );
        const graphData = graphResponse.data;

        // Check if data is an array and not empty
        if (Array.isArray(graphData) && graphData.length > 0) {
          setGraphData(graphData);
        } else {
          // If data is empty, update graphData with an error message
          setGraphData([{ message: "No Policy Server Packets found" }]);
        }

        // Fetch card total data
        const totalResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/ps/ps-packet-total/${id}`
        );
        const totalData = totalResponse.data;

        // Update totalPacket
        setTotalPacket({
          rstClient: formatNumber(totalData.psPacket.rstClient),
          rstServer: formatNumber(totalData.psPacket.rstServer),
          txCount: formatNumber(totalData.psPacket.tx_1_count),
          rxCount: formatNumber(totalData.psPacket.rx_0_count),
        });

        // Fetch Policy Server info
        const policyServerResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/ps/psid/${id}`
        );
        const policyServerData = policyServerResponse.data;

        console.log("Policy Server Data: ", policyServerData);

        setPolicyServer({
          id: policyServerData.id,
          name: policyServerData.name,
          location: policyServerData.location,
        });

        if (!initialFetchCompleted) {
          setLoading(false); // Hide loading state after initial fetch is complete
          initialFetchCompleted = true; // Set initial fetch completed flag
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false); // Hide loading state if there's an error
      }
    };

    // Initial fetch
    fetchData();

    // Set interval to fetch data every 30 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup function to clear interval
    return () => clearInterval(intervalId);
  }, [id]);

  // Function to format numbers
  const formatNumber = (num) => {
    if (num >= 1e18) {
      return (num / 1e18).toFixed(2).replace(/\.0$/, "") + " Qi";
    }
    if (num >= 1e15) {
      return (num / 1e15).toFixed(2).replace(/\.0$/, "") + " Qa";
    }
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2).replace(/\.0$/, "") + " T";
    }
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2).replace(/\.0$/, "") + " B";
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(2).replace(/\.0$/, "") + " M";
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(2).replace(/\.0$/, "") + " K";
    }
    return num;
  };

  const handleDownloadConfig = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/config/${id}`)
      .then((response) => {
        const { npbId, psId, hostname, timerPeriodStats, timerPeriodSend } =
          response.data;
        const configFileContent = generateConfigFileContent(
          npbId,
          psId,
          hostname,
          timerPeriodStats,
          timerPeriodSend
        );
        const blob = new Blob([configFileContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "config.cfg");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading config: ", error);
      });
  };

  return (
    <div className="relative ml-3">
      {/* Loading spinner in the center */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center">
          <ProgressSpinner />
        </div>
      )}
      {!loading && (
        <>
          <div className="absolute top-0 right-0 mt-10 mr-10 flex">
            <button
              onClick={handleDownloadConfig}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center font-['Helvetica'] font-bold"
            >
              <span className="mr-2">Download Config</span>
              <img
                src="/download_logo.svg"
                alt="Download Icon"
                className="h-5"
                style={{ fill: "white" }}
              />
            </button>
          </div>
          <header>
            <div className="flex items-center space-x-1 mt-3">
              <p className="text-gray-400 font-['Helvetica'] text-lg font-normal">
                Pages
              </p>
              <p className="text-gray-600 font-['Helvetica'] text-lg font-bold">
                / Home
              </p>
            </div>
            <p className="text-gray-700 font-['Helvetica'] text-lg font-bold ">
              Status
            </p>
            <div className="w-4 h-4 text-gray-700 text-2xl font-normal font-['Helvetica'] mt-3 ">
              Policy Server
            </div> 
            <div className="w-4 h-4 text-black-700 text-5xl font-bold font-['Helvetica'] mt-3">
              {policyServer.name}
            </div>
            <p className="text-gray-400 w-4 font-['Helvetica'] text-sm font-bold mt-5">
            ID: {policyServer.id}
            </p>
            <div className="text-gray-700 text-base font-normal font-['Helvetica'] italic">
              Location: {policyServer.location}
            </div>
          </header>

          <div className="flex flex-row mr-10">
            <div className="mr-2">
              <Card
                hitType="Reset Client Hit"
                number={totalPacket.rstClient}
                packet="Packet"
              />
            </div>
            <div className="mr-2">
              <Card
                hitType="Reset Server Hit"
                number={totalPacket.rstServer}
                packet="Packet"
              />
            </div>
            <div className="mr-2">
              <Card
                hitType="TX Count"
                number={totalPacket.txCount}
                packet="Packet"
              />
            </div>
            <div className="mr-2">
              <Card
                hitType="RX Count"
                number={totalPacket.rxCount}
                packet="Packet"
              />
            </div>
          </div>
          <div className="mt-10 mr-10 shadow-sm">
            <LineChart
              title="Reset Client Hit"
              packetData={graphData.map((data) => ({
                time: data.time,
                value: data.rstClient,
              }))}
            />
          </div>
          <div className="mt-10 mr-10 shadow-sm">
            <LineChart
              title="Reset Server Hit"
              packetData={graphData.map((data) => ({
                time: data.time,
                value: data.rstServer,
              }))}
            />
          </div>
          <div className="mt-10 mr-10 shadow-sm">
            <LineChart
              title="TX Count"
              packetData={graphData.map((data) => ({
                time: data.time,
                value: data.tx_1_count,
              }))}
            />
          </div>
          <div className="mt-10 mr-10 shadow-sm">
            <LineChart
              title="RX Count"
              packetData={graphData.map((data) => ({
                time: data.time,
                value: data.rx_0_count,
              }))}
            />
          </div>
          {/* Render BlockedListTable component and pass the id */}
          <div className="mt-10 mr-10 shadow-sm">
            <BlockedListTable id={id} />
          </div>
        </>
      )}
    </div>
  );
}

export default Ps;
