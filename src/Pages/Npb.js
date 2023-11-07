import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import LineChart from "../components/LineChart";
import axios from "axios";

function Npb() {
  const [packetBroker, setPacketBroker] = useState({
    id: "",
    name: "",
    location: "",
  });

  const [packetData, setPacketData] = useState([]);

  useEffect(() => {
    // Fetch packet broker data
    axios
      .get("http://192.168.88.251:3000/npb/npbid/1") // Replace '1' with the desired ID
      .then((response) => {
        const data = response.data;
        console.log(data);
        setPacketBroker({
          id: data.id,
          name: data.name,
          location: data.location,
        });
      })
      .catch((error) => {
        console.error("Error fetching packet broker data: ", error);
      });

    // Fetch packet data
    axios
      .get("http://192.168.88.251:3000/npb/npb-packet/1") // Replace '1' with the desired ID
      .then((response) => {
        const data = response.data;
        console.log(data);
        setPacketData(data);
      })
      .catch((error) => {
        console.error("Error fetching packet data: ", error);
      });
  }, []);

  // Calculate total counts
  const httpCount = packetData.reduce(
    (total, packet) => total + packet.http_count,
    0
  );
  const httpsCount = packetData.reduce(
    (total, packet) => total + packet.https_count,
    0
  );
  const txCount = packetData.reduce(
    (total, packet) => total + packet.tx_count,
    0
  );
  const rxCount = packetData.reduce(
    (total, packet) => total + packet.rx_count,
    0
  );

  return (
    <div className="max-w-full">
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
      <div className="flex flex-row space-x-10 ml-10">
        <div>
          <Card
            httpHit="HTTP Count"
            number={httpCount.toString()}
            packet="Packet"
          />
        </div>
        <div>
          <Card
            httpHit="HTTPS Count"
            number={httpsCount.toString()}
            packet="Packet"
          />
        </div>
        <div>
          <Card
            httpHit="TX Count"
            number={txCount.toString()}
            packet="Packet"
          />
        </div>
        <div>
          <Card
            httpHit="RX Count"
            number={rxCount.toString()}
            packet="Packet"
          />
        </div>
      </div>
      {/* Charts */}
      <div className="mt-10 ml-10 shadow-sm">
        <LineChart />
      </div>
    </div>
  );
}

export default Npb;
