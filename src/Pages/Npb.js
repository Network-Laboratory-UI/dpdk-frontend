import React, { useEffect, useState } from "react";
import Cards from "../components/Card";
import LineChart from "../components/LineChart";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import generateConfigFileContent from "../components/GenerateConfigFileContent";
import ProgressSpinner from "../components/ProgressSpinner";
import { Paginator } from "primereact/paginator"; // Import Paginator component from PrimeReact

function Npb() {
  const location = useLocation();
  const navigateTo = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = decodeURIComponent(searchParams.get("id"));
  const [initialLoading, setInitialLoading] = useState(true); // State for initial loading
  const [chartLoading, setChartLoading] = useState(false); // State for chart loading
  const [packetBroker, setPacketBroker] = useState({
    id: "",
    name: "",
    location: "",
  });
  const [packetData, setPacketData] = useState([]);
  const [countData, setCountData] = useState();
  const [totalPacket, setTotalPacket] = useState({
    httpCount: 0,
    httpsCount: 0,
    txHttpCount: 0,
    txTLSCount: 0,
    rxCount: 0,
  });
  const [first, setFirst] = useState(0);
  const [isFirstCall, setIsFirstCall] = useState(true);
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");
  if (!token) {
    navigateTo("/");
  }

  const fetchInitialData = async () => {
    try {
      // Fetch Packet Broker info
      const packetBrokerResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/npb/npbid/${id}`
      );
      const packetBrokerData = packetBrokerResponse.data;

      setPacketBroker({
        id: packetBrokerData.id,
        name: packetBrokerData.name,
        location: packetBrokerData.location,
      });
      //setInitialLoading(true); // Set initial loading to true

      // Fetch total packet data
      const totalResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/npb/npb-packet-total/${id}`
      );
      const totalData = totalResponse.data;
      setTotalPacket({
        httpCount: formatNumber(totalData.npbPackets.http_count),
        httpsCount: formatNumber(totalData.npbPackets.https_count),
        txHttpCount: formatNumber(totalData.npbPackets.tx_o_http_count),
        txTlsCount: formatNumber(totalData.npbPackets.tx_o_tls_count),
        rxCount: formatNumber(totalData.npbPackets.rx_i_count),
      });

      // Fetch packet data
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/npb/npb-packet-page/${id}?page=${
          first / pageSize + 1
        }&pageSize=${pageSize}`
      );

      console.log("response", response);

      const countResponse = response.data.count;
      setCountData(countResponse);
      // Update packet data for LineChart
      const graphData = response.data.npbPackets;
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
        setPacketData([{ message: "No Npb Packets found" }]);
      }

      setInitialLoading(false); // Set initial loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching initial data: ", error);
      setInitialLoading(false); // Set initial loading to false on error
    }
  };

  const fetchUpdatedData = async () => {
    try {
      // Increment 'first' only on the first call
      if (isFirstCall) {
        setFirst(first + pageSize);
        setIsFirstCall(false);
      }

      // Fetch total packet data
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

      // Fetch packet data
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/npb/npb-packet-page/${id}?page=${
          first / pageSize + 1
        }&pageSize=${pageSize}`
      );

      console.log("response", response);

      const countResponse = response.data.count;
      setCountData(countResponse);
      // Update packet data for LineChart
      const graphData = response.data.npbPackets;
      if (Array.isArray(graphData) && graphData.length > 0) {
        const localData = graphData.map((packet) => {
          const utcDate = new Date(packet.time);
          const localDateString = utcDate.toLocaleString();
          return {
            ...packet,
            time: localDateString,
          };
        });
        // console.log("localData", localData);
        setPacketData(localData);
      } else {
        setPacketData([{ message: "No Npb Packets found" }]);
      }
    } catch (error) {
      console.error("Error fetching updated data: ", error);
    }
  };

  useEffect(() => {
    fetchInitialData(); // Fetch initial data

    const intervalId = setInterval(() => {
      fetchUpdatedData(); // Fetch updated data every 1000 seconds
    }, 1000000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [id, first]); // Trigger fetchInitialData only when id changes

  // Assuming rest of your component code remains the same

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
    // const newPage = event.currentPage;
    // setCurrentPage(newPage);

    // Set chart loading to true when changing pages
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
    <div className="relative">
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
            <div className="w-4 h-4 text-gray-600 text-2xl font-normal font-['Helvetica'] mt-3 ">
              Packet Broker
            </div>
            <div className="w-4 h-4 text-black-700 text-5xl font-bold font-['Helvetica'] mt-3">
              {packetBroker.name}
            </div>
            <p className="text-gray-400 w-4 font-['Helvetica'] text-sm font-bold mt-5">
              ID: {packetBroker.id}
            </p>
            <div className="text-gray-700 text-base font-normal font-['Helvetica'] italic">
              Location: {packetBroker.location}
            </div>
          </header>
          <div className="overflow-x-auto w-screen-lg ">
            <div className="flex justify-between pt-4 pb-4">
              <div className="flex space-x-5 pr-5">
                <Cards
                  hitType="HTTP Count"
                  number={totalPacket.httpCount}
                  packet="Packet"
                />
                <Cards
                  hitType="HTTPS Count"
                  number={totalPacket.httpsCount}
                  packet="Packet"
                />
                <Cards
                  hitType="TX HTTP Count"
                  number={totalPacket.txHttpCount}
                  packet="Packet"
                />
                <Cards
                  hitType="TX TLS Count"
                  number={totalPacket.txTlsCount}
                  packet="Packet"
                />
                <Cards
                  hitType="RX Count"
                  number={totalPacket.rxCount}
                  packet="Packet"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 justify-around w-full gap-y-4">
            <div className="w-[47%] h-1/2 shadow-sm">
              <LineChart
                title={chartLoading ? "" : "HTTP Count"}
                packetData={packetData.map((data) => ({
                  time: data.time,
                  value: data.http_count,
                }))}
                loading={chartLoading}
              />
            </div>
            <div className="w-[47%] h-1/2 shadow-sm">
              <LineChart
                title={chartLoading ? "" : "HTTPS Count"}
                packetData={packetData.map((data) => ({
                  time: data.time,
                  value: data.https_count,
                }))}
                loading={chartLoading}
              />
            </div>
            <div className="w-[47%] h-1/2 shadow-sm">
              <LineChart
                title={chartLoading ? "" : "TX HTTP Count"}
                packetData={packetData.map((data) => ({
                  time: data.time,
                  value: data.tx_o_http_count,
                }))}
                loading={chartLoading}
              />
            </div>
            <div className="w-[47%] h-1/2 shadow-sm">
              <LineChart
                title={chartLoading ? "" : "TX TLS Count"}
                packetData={packetData.map((data) => ({
                  time: data.time,
                  value: data.tx_o_tls_count,
                }))}
                loading={chartLoading}
              />
            </div>
            <div className="w-[47%] h-1/2 shadow-sm">
              <LineChart
                title={chartLoading ? "" : "RX Count"}
                packetData={packetData.map((data) => ({
                  time: data.time,
                  value: data.rx_i_count,
                }))}
                loading={chartLoading}
              />
            </div>
          </div>
          <Paginator
            first={first}
            rows={pageSize}
            totalRecords={countData} // Assuming packetData is the total count
            onPageChange={onPageChange}
            template={{ layout: "PrevPageLink CurrentPageReport NextPageLink" }}
          />
        </>
      )}
    </div>
  );
}

export default Npb;
