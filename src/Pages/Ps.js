import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Card from "../components/Card";
import LineChart from "../components/LineChart";
import axios from "axios";
import generateConfigFileContent from "../components/GenerateConfigFileContent";
import BlockedListTable from "../components/BlockedListTable";

function Ps() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = parseInt(searchParams.get("id"), 10);
  const [policyServer, setPolicyServer] = useState({
    id: "",
    name: "",
    location: "",
  });
  const [packetData, setPacketData] = useState([]);
  const [rstClient, setRstClient] = useState(0);
  const [rstServer, setRstServer] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const [rxCount, setRxCount] = useState(0);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/ps/psid/${id}`) // Use the extracted parameter in the URL
      .then((response) => {
        const data = response.data;
        setPolicyServer({
          id: data.id,
          name: data.name,
          location: data.location,
        });
      })
      .catch((error) => {
        console.error("Error fetching Policy Server data: ", error);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/ps/ps-packet/${id}`)
      .then((response) => {
        const data = response.data;
        // Check if data is an array and not empty
        if (Array.isArray(data) && data.length > 0) {
          setPacketData(data);
        } else {
          // If data is empty, update packetData with the response message
          setPacketData([{ message: "No Policy Server Packets found" }]);
        }
      })
      .catch((error) => {
        console.error("Error fetching packet data: ", error);
        // If there's an error, update packetData with an error message
        setPacketData([{ message: "Error fetching packet data" }]);
      });
  }, [id]);

  useEffect(() => {
    setRstClient(
      packetData.reduce((total, packet) => total + packet.rst_client, 0)
    );
    setRstServer(
      packetData.reduce((total, packet) => total + packet.rst_server, 0)
    );
    setTxCount(
      packetData.reduce((total, packet) => total + packet.tx_count, 0)
    );
    setRxCount(
      packetData.reduce((total, packet) => total + packet.rx_count, 0)
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
    <div className="relative">
      <div className="absolute top-0 right-0 mt-10 mr-10 flex items-center">
        <button
          onClick={handleDownloadConfig}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
        >
          <span className="mr-2">Download Config</span>
          <img
            src="/download_logo.svg"
            alt="Download Icon"
            className="h-5 w-5"
            style={{ fill: "white" }}
          />
        </button>
      </div>
      <header>
        <div className="flex items-center   mt-6">
          <h2 className="text-gray-400 font-helvetica text-[1] font-normal">
            Pages
          </h2>
          <h2 className="text-black font-helvetica text-[1] font-normal">
            / Dashboard
          </h2>
        </div>
        <p className="text-gray-700 font-helvetica text-[2] font-bold ">
          Status
        </p>
        <div className="w-[416px] h-4 text-gray-700 text-2xl font-bold font-['Helvetica'] mt-6 ">
          Policy Server - {policyServer.id}
        </div>
        <div className="w-[416px] h-4 text-gray-700 text-xl font-normal font-['Helvetica'] mt-4 ">
          {policyServer.name}
        </div>
        <div className="text-gray-700 text-base font-normal font-['Helvetica'] mt-4  italic">
          Location: {policyServer.location}
        </div>
      </header>

      <div className="flex flex-row   mr-20">
        <div  className="mr-2">
          <Card
            hitType="Reset Client Hit"
            number={rstClient.toString()}
            packet="Packet"
          />
        </div>
        <div  className="mr-2">
          <Card
            hitType="Reset Server Hit"
            number={rstServer.toString()}
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
      <div className="mt-10  shadow-sm">
        <LineChart
          title="Reset Client Hit"
          packetData={packetData.map((data) => ({
            time: data.time,
            value: data.rst_client,
          }))}
        />
      </div>
      <div className="mt-10  shadow-sm">
        <LineChart
          title="Reset Server Hit"
          packetData={packetData.map((data) => ({
            time: data.time,
            value: data.rst_server,
          }))}
        />
      </div>
      <div className="mt-10  shadow-sm">
        <LineChart
          title="TX Count"
          packetData={packetData.map((data) => ({
            time: data.time,
            value: data.tx_count,
          }))}
        />
      </div>
      <div className="mt-10  shadow-sm">
        <LineChart
          title="RX Count"
          packetData={packetData.map((data) => ({
            time: data.time,
            value: data.rx_count,
          }))}
        />
      </div>
      {/* Render BlockedListTable component and pass the id */}
      <div className="mt-10  shadow-sm">
        <BlockedListTable id={id} />
      </div>
    </div>
  );
}

export default Ps;
