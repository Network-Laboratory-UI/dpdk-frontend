import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import LineChart from "../components/LineChart";
import axios from "axios";
import generateConfigFileContent from "../components/GenerateConfigFileContent";
import ProgressSpinner from "../components/ProgressSpinner";
import BlockedListTable from "../components/BlockedListTable"; // Import BlockedListTable component
import { Paginator } from "primereact/paginator"; // Import Paginator component from PrimeReact

function Ps() {
  const location = useLocation();
  const navigateTo = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = decodeURIComponent(searchParams.get("id"));
  const [initialLoading, setInitialLoading] = useState(true); // State for initial loading
  const [chartLoading, setChartLoading] = useState(false); // State for chart loading
  const [policyServer, setPolicyServer] = useState({
    id: "",
    name: "",
    location: "",
  });
  const [packetData, setPacketData] = useState([]);
  const [countData, setCountData] = useState();
  const [totalPacket, setTotalPacket] = useState({
    rstClient: 0,
    rstServer: 0,
    txCount: 0,
    rxCount: 0,
  }); // For card total
  const [first, setFirst] = useState(0);
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");
  if (!token) {
    navigateTo("/");
  }

  const fetchInitialData = async () => {
    try {
      //setInitialLoading(true); // Set initial loading to true

      // Fetch total packet data
      const totalResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/ps/ps-packet-total/${id}`
      );
      const totalData = totalResponse.data;
      setTotalPacket({
        rstClient: formatNumber(totalData.psPackets.rstClient),
        rstServer: formatNumber(totalData.psPackets.rstServer),
        txCount: formatNumber(totalData.psPackets.tx_1_count),
        rxCount: formatNumber(totalData.psPackets.rx_0_count),
      });

      // Fetch packet data
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/ps/ps-packet-page/${id}?page=${
          first / pageSize + 1
        }&pageSize=${pageSize}`
      );

      const countResponse = response.data.count;
      setCountData(countResponse);
      // Update packet data for LineChart
      const graphData = response.data.psPackets;
      if (Array.isArray(graphData) && graphData.length > 0) {
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
        setPacketData([{ message: "No Ps Packets found" }]);
      }

      // Fetch Policy Server info
      const policyServerResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/ps/psid/${id}`
      );
      const policyServerData = policyServerResponse.data;

      setPolicyServer({
        id: policyServerData.id,
        name: policyServerData.name,
        location: policyServerData.location,
      });

      setInitialLoading(false); // Set initial loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching initial data: ", error);
      setInitialLoading(false); // Set initial loading to false on error
    }
  };

  const fetchUpdatedData = async () => {
    try {
      // Fetch total packet data
      const totalResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/ps/ps-packet-total/${id}`
      );
      const totalData = totalResponse.data;
      setTotalPacket({
        rstClient: formatNumber(totalData.psPackets.rstClient),
        rstServer: formatNumber(totalData.psPackets.rstServer),
        txCount: formatNumber(totalData.psPackets.tx_1_count),
        rxCount: formatNumber(totalData.psPackets.rx_0_count),
      });

      // Fetch packet data
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/ps/ps-packet-page/${id}?page=${
          first / pageSize + 1
        }&pageSize=${pageSize}`
      );

      const countResponse = response.data.count;
      setCountData(countResponse);
      // Update packet data for LineChart
      const graphData = response.data.psPackets;
      if (Array.isArray(graphData) && graphData.length > 0) {
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
        setPacketData([{ message: "No Ps Packets found" }]);
      }
    } catch (error) {
      console.error("Error fetching initial data: ", error);
    }
  };

  useEffect(() => {
    fetchInitialData(); // Fetch initial data

    const intervalId = setInterval(() => {
      fetchUpdatedData(); // Fetch updated data every 5 seconds
    }, 1000000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [id, first]); // Trigger fetchInitialData only when id changes

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

  // Function to handle pagination change
  const onPageChange = async (event) => {
    setFirst(event.first);
    setChartLoading(true);

    try {
      // Fetch data for the new page
      await fetchUpdatedData();
    } catch (error) {
      console.error("Error fetching updated data: ", error);
    } finally {
      // Set chart loading to false after data is fetched or on error
      setChartLoading(false);
    }
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
      {initialLoading && (
        <div className="fixed inset-0 flex items-center justify-center">
          <ProgressSpinner />
        </div>
      )}
      {!initialLoading && (
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
          </div>
          <div className="mt-10 mr-10 shadow-sm">
            <LineChart
              title="Reset Client Hit"
              packetData={packetData.map((data) => ({
                time: data.time,
                value: data.rstClient,
              }))}
              loading={chartLoading} // pass loading state to LineChart
            />
          </div>
          <div className="mt-10 mr-10 shadow-sm">
            <LineChart
              title="Reset Server Hit"
              packetData={packetData.map((data) => ({
                time: data.time,
                value: data.rstServer,
              }))}
              loading={chartLoading} // pass loading state to LineChart
            />
          </div>
          <div className="mt-10 mr-10 shadow-sm">
            <LineChart
              title="TX Count"
              packetData={packetData.map((data) => ({
                time: data.time,
                value: data.tx_1_count,
              }))}
              loading={chartLoading} // pass loading state to LineChart
            />
          </div>
          <div className="mt-10 mr-10 shadow-sm">
            <LineChart
              title="RX Count"
              packetData={packetData.map((data) => ({
                time: data.time,
                value: data.rx_0_count,
              }))}
              loading={chartLoading} // pass loading state to LineChart
            />
          </div>
          <Paginator
            first={first}
            rows={pageSize}
            totalRecords={countData} // Assuming packetData is the total count
            onPageChange={onPageChange}
            template={{ layout: "PrevPageLink CurrentPageReport NextPageLink" }}
          />
          <div className="mt-10 mr-10 shadow-sm">
            <BlockedListTable id={id} />
          </div>
        </>
      )}
    </div>
  );
}

export default Ps;
