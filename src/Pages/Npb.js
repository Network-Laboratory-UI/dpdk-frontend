import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import LineChart from "../components/LineChart";
import axios from "axios";
import { useLocation } from "react-router-dom";
import generateConfigFileContent from "../components/GenerateConfigFileContent";
import ProgressSpinner from "../components/ProgressSpinner"; // Import ProgressSpinner component

function Npb() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = parseInt(searchParams.get("id"), 10);
  const [loading, setLoading] = useState(true); // Loading state
  const [packetBroker, setPacketBroker] = useState({
    id: "",
    name: "",
    location: "",
  });
  const [packetData, setPacketData] = useState([]);
  const [httpCount, setHttpCount] = useState(0);
  const [httpsCount, setHttpsCount] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const [rxCount, setRxCount] = useState(0);

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching data starts
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/npb/npbid/${id}`)
      .then((response) => {
        const data = response.data;
        setPacketBroker({
          id: data.id,
          name: data.name,
          location: data.location,
        });
      })
      .catch((error) => {
        console.error("Error fetching packet broker data: ", error);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/npb/npb-packet/${id}`)
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          // Convert UTC datetime to local time for each packet
          const localData = data.map((packet) => {
            // Parse the UTC date string manually
            const utcDate = new Date(packet.time);
            // Convert UTC date to local date string
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
        setLoading(false); // Set loading to false when data fetching is complete
      })
      .catch((error) => {
        console.error("Error fetching packet data: ", error);
        setPacketData([{ message: "Error fetching packet data" }]);
        setLoading(false); // Set loading to false if there's an error
      });
  }, [id]);

  useEffect(() => {
    setHttpCount(
      packetData.reduce((total, packet) => total + packet.http_count, 0)
    );
    setHttpsCount(
      packetData.reduce((total, packet) => total + packet.https_count, 0)
    );
    setTxCount(
      packetData.reduce((total, packet) => total + packet.tx_0_count, 0)
    );
    setRxCount(
      packetData.reduce((total, packet) => total + packet.rx_1_count, 0)
    );
  }, [packetData]);

  const handleDownloadConfig = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/npb/config/${id}`)
      .then((response) => {
        const { Id, timerPeriodStats, timerPeriodSend } = response.data;
        const configFileContent = generateConfigFileContent(
          Id,
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
            <div className="w-4 h-4 text-gray-700 text-2xl font-bold font-['Helvetica'] mt-3 ">
              Packet Broker - {packetBroker.id}
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
                number={httpCount.toString()}
                packet="Packet"
              />
            </div>
            <div className="mr-2">
              <Card
                hitType="HTTPS Count"
                number={httpsCount.toString()}
                packet="Packet"
              />
            </div>
            <div className="mr-2">
              <Card
                hitType="TX Count"
                number={txCount.toString()}
                packet="Packet"
              />
            </div>
            <div className="mr-2">
              <Card
                hitType="RX Count"
                number={rxCount.toString()}
                packet="Packet"
              />
            </div>
          </div>
          <div className="mt-10  mr-10 shadow-sm">
            <LineChart
              title="HTTP Count"
              packetData={packetData.map((data) => ({
                time: data.time,
                value: data.http_count,
              }))}
            />
          </div>
          <div className="mt-10  mr-10 shadow-sm">
            <LineChart
              title="HTTPS Count"
              packetData={packetData.map((data) => ({
                time: data.time,
                value: data.https_count,
              }))}
            />
          </div>
          <div className="mt-10  mr-10 shadow-sm">
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
