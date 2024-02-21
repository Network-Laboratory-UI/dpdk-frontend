import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import LineChart from "../components/LineChart";
import axios from "axios";
import { useParams } from "react-router-dom";
import generateConfigFileContent from "../components/GenerateConfigFileContent"; // Import generateConfigFileContent

function Npb() {
  const { id } = useParams();
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
          setPacketData(data);
        } else {
          setPacketData([{ message: "No Npb Packets found" }]);
        }
      })
      .catch((error) => {
        console.error("Error fetching packet data: ", error);
        setPacketData([{ message: "Error fetching packet data" }]);
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
    <div className="max-w-full">
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
        <div className="flex items-center space-x-1 ml-10 mt-6">
          <h2 className="text-gray-400 font-helvetica text-[1] font-normal">
            Pages
          </h2>
          <h2 className="text-black font-helvetica text-[1] font-normal">
            / Dashboard
          </h2>
        </div>
        <p className="text-gray-700 font-helvetica text-[2] font-bold ml-10">
          Status
        </p>
        <div className="w-[416px] h-4 text-gray-700 text-2xl font-bold font-['Helvetica'] mt-6 ml-10">
          Packet Broker - {packetBroker.id}
        </div>
        <div className="w-[416px] h-4 text-gray-700 text-xl font-normal font-['Helvetica'] mt-4 ml-10">
          {packetBroker.name}
        </div>
        <div className="text-gray-700 text-base font-normal font-['Helvetica'] mt-4 ml-10 italic">
          Location: {packetBroker.location}
        </div>
      </header>
      <div className="flex flex-row space-x-10 ml-10 mr-20">
        <div>
          <Card
            hitType="HTTP Count"
            number={httpCount.toString()}
            packet="Packet"
          />
        </div>
        <div>
          <Card
            hitType="HTTPS Count"
            number={httpsCount.toString()}
            packet="Packet"
          />
        </div>
        <div>
          <Card
            hitType="TX Count"
            number={txCount.toString()}
            packet="Packet"
          />
        </div>
        <div>
          <Card
            hitType="RX Count"
            number={rxCount.toString()}
            packet="Packet"
          />
        </div>
      </div>
      <div className="mt-10 ml-10 shadow-sm">
        <LineChart
          title="HTTP Count"
          packetData={packetData.map((data) => ({
            time: data.time,
            value: data.http_count,
          }))}
        />
      </div>
      <div className="mt-10 ml-10 shadow-sm">
        <LineChart
          title="HTTPS Count"
          packetData={packetData.map((data) => ({
            time: data.time,
            value: data.https_count,
          }))}
        />
      </div>
      <div className="mt-10 ml-10 shadow-sm">
        <LineChart
          title="TX Count"
          packetData={packetData.map((data) => ({
            time: data.time,
            value: data.tx_0_count,
          }))}
        />
      </div>
      <div className="mt-10 ml-10 shadow-sm">
        <LineChart
          title="RX Count"
          packetData={packetData.map((data) => ({
            time: data.time,
            value: data.rx_1_count,
          }))}
        />
      </div>
    </div>
  );
}

export default Npb;
