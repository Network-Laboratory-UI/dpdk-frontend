import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import LineChart from "../components/LineChart";
import axios from "axios";
import { useParams } from "react-router-dom";

function Npb() {
  // Retrieve the ID from the URL
  const { id } = useParams();

  // State for packet broker data and packet data
  const [packetBroker, setPacketBroker] = useState({
    id: "",
    name: "",
    location: "",
  });
  const [packetData, setPacketData] = useState([]);

  // State for counts
  const [httpCount, setHttpCount] = useState(0);
  const [httpsCount, setHttpsCount] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const [rxCount, setRxCount] = useState(0);

  // Fetch data from API
  useEffect(() => {
    // Fetch packet broker data based on the ID
    axios
      .get(`http://192.168.88.251:3000/npb/npbid/${id}`)
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

    // Fetch packet data based on the ID
    axios
      .get(`http://192.168.88.251:3000/npb/npb-packet/${id}`)
      .then((response) => {
        const data = response.data;
        // Check if data is an array and not empty
        if (Array.isArray(data) && data.length > 0) {
          setPacketData(data);
        } else {
          // If data is empty, update packetData with the response message
          setPacketData([{ message: "No Npb Packets found" }]);
        }
      })
      .catch((error) => {
        console.error("Error fetching packet data: ", error);
        // If there's an error, update packetData with an error message
        setPacketData([{ message: "Error fetching packet data" }]);
      });
  }, [id]);

  // Calculate total counts
  useEffect(() => {
    setHttpCount(
      packetData.reduce((total, packet) => total + packet.http_count, 0)
    );
    setHttpsCount(
      packetData.reduce((total, packet) => total + packet.https_count, 0)
    );
    setTxCount(
      packetData.reduce((total, packet) => total + packet.tx_count, 0)
    );
    setRxCount(
      packetData.reduce((total, packet) => total + packet.rx_count, 0)
    );
  }, [packetData]);

  return (
    <div className="max-w-full">
      {/* Header with packet broker details */}
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

      {/* Cards */}
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
      {/* Charts */}
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
            value: data.tx_count,
          }))}
        />
      </div>
      <div className="mt-10 ml-10 shadow-sm">
        <LineChart
          title="RX Count"
          packetData={packetData.map((data) => ({
            time: data.time,
            value: data.rx_count,
          }))}
        />
      </div>
    </div>
  );
}

export default Npb;
