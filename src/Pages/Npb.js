import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import LineChart from "../components/LineChart";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import generateConfigFileContent from "../components/GenerateConfigFileContent";
import ProgressSpinner from "../components/ProgressSpinner"; // Import ProgressSpinner component

function Npb() {
  const location = useLocation();
  const navigateTo = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = decodeURIComponent(searchParams.get("id"));
  const [loading, setLoading] = useState(true); // Loading state
  const [packetBroker, setPacketBroker] = useState({
    id: "",
    name: "",
    location: "",
  });
  const [packetData, setPacketData] = useState([]);
  const [totalPacket, setTotalPacket] = useState({
    httpCount: 0,
    httpsCount: 0,
    txCount: 0,
    rxCount: 0,
  });
  const token = localStorage.getItem("token");
  if(!token) {
    navigateTo("/");
  }

  useEffect(() => {
    let initialFetchCompleted = false;

    const fetchData = async () => {
      try {
        if (!initialFetchCompleted) {
          setLoading(true); // Show loading state only for initial fetch
        }

        // Fetch total packet data for the card
        const totalResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/npb/npb-packet-total/${id}`
        );
        const totalData = totalResponse.data;
        setTotalPacket({
          httpCount: formatNumber(totalData.npbPackets.http_count),
          httpsCount: formatNumber(totalData.npbPackets.https_count),
          txCount: formatNumber(totalData.npbPackets.tx_0_count),
          rxCount: formatNumber(totalData.npbPackets.rx_1_count),
        });

        // Fetch graph data
        const graphResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/npb/npb-packet/${id}`
        );
        const graphData = graphResponse.data;
        if (Array.isArray(graphData) && graphData.length > 0) {
          // Convert UTC datetime to local time for each packet
          const localData = graphData.map((packet) => {
            const utcDate = new Date(packet.time);
            const localDateString = utcDate.toLocaleString();
            return {
              ...packet,
              time: localDateString,
            };
          });
          setPacketData(localData);
        } else {
          setPacketData([{ message: "No Npb Packets found" }]);
        }

        // Fetch Policy Server info
        const packetBrokerResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/npb/npbid/${id}`
        );
        const packetBrokerData = packetBrokerResponse.data;

        console.log("Packet Broker Data: ", packetBrokerData);

        setPacketBroker({
          id: packetBrokerData.id,
          name: packetBrokerData.name,
          location: packetBrokerData.location,
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
    const intervalId = setInterval(fetchData, 30000);

    // Cleanup function to clear interval
    return () => clearInterval(intervalId);
  }, [id]);

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
            <div className="w-4 h-4 text-gray-700 text-2xl font-bold font-['Helvetica'] mt-3 ">
              Packet Broker
            </div>
            <div className="w-4 h-4 text-gray-700 text-xl font-normal font-['Helvetica'] mt-4">
              {packetBroker.name}
            </div>
            <div className="text-gray-700 text-base font-normal font-['Helvetica'] mt-4 italic">
              Location: {packetBroker.location}
            </div>
          </header>
          <div className="flex flex-row mr-10">
            <div className="mr-2">
              <Card
                hitType="HTTP Count"
                number={totalPacket.httpCount}
                packet="Packet"
              />
            </div>
            <div className="mr-2">
              <Card
                hitType="HTTPS Count"
                number={totalPacket.httpsCount}
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
              title="HTTP Count"
              packetData={packetData.map((data) => ({
                time: data.time,
                value: data.http_count,
              }))}
            />
          </div>
          <div className="mt-10 mr-10 shadow-sm">
            <LineChart
              title="HTTPS Count"
              packetData={packetData.map((data) => ({
                time: data.time,
                value: data.https_count,
              }))}
            />
          </div>
          <div className="mt-10 mr-10 shadow-sm">
            <LineChart
              title="TX Count"
              packetData={packetData.map((data) => ({
                time: data.time,
                value: data.tx_0_count,
              }))}
            />
          </div>
          <div className="mt-10 mr-10 mb-20 shadow-sm">
            <LineChart
              title="RX Count"
              packetData={packetData.map((data) => ({
                time: data.time,
                value: data.rx_1_count,
              }))}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Npb;
