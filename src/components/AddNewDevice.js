import React, { useState } from "react";
import axios from "axios";
import generateConfigFileContent from "./GenerateConfigFileContent"; // Import the function

const AddNewDevice = ({ isOpen, onClose, onDeviceAdded }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [periodStats, setPeriodStats] = useState("");
  const [periodSend, setPeriodSend] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage(2);
  };

  const handlePrevPage = () => {
    setCurrentPage(1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (currentPage === 1) {
        // If it's the first page, move to the second page
        handleNextPage();
        return;
      }

      const npbResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/npb/createnpb`,
        { name, location }
      );
      const npbId = npbResponse.data.id; // Extract NPB ID from the response

      // Generate configuration file content
      const configFileContent = generateConfigFileContent(
        npbId,
        periodStats,
        periodSend
      );

      // Create a Blob from the configuration content
      const blob = new Blob([configFileContent], { type: "text/plain" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "config.cfg"); // Set the filename for download
      document.body.appendChild(link);

      // Click the link to trigger the download
      link.click();

      // Cleanup: Remove the temporary link and revoke the URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Send data to the respective API based on the type of device
      await axios.post(`${process.env.REACT_APP_BASE_URL}/ps/createps`, {
        name,
        location,
      });

      // Static configuration values
      const staticConfigValues = {
        maxPacketLen: 1500,
        rxRingSize: 1024,
        txRingSize: 1024,
        numMbufs: 8191,
        mbufCacheSize: 250,
        burstSize: 32,
        maxTcpPayloadLen: 1024,
        statFile: "stats/stats",
        statFileExt: ".csv",
      };

      // Combine static and dynamic values
      const configData = {
        Id: npbId,
        ...staticConfigValues,
        timerPeriodStats: periodStats,
        timerPeriodSend: periodSend,
      };

      // Post the combined config data
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/npb/config`,
        configData
      );

      // Reload data after adding a new device
      onDeviceAdded();

      // Close the popup after successful submission
      onClose();
    } catch (error) {
      console.error("Error adding new device: ", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        {currentPage === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Add New Device</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block font-bold mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  className="border p-1 w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block font-bold mb-1">
                  Location:
                </label>
                <input
                  type="text"
                  id="location"
                  className="border p-1 w-full"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="periodStats" className="block font-bold mb-1">
                  Period Stats:
                </label>
                <input
                  type="number"
                  id="periodStats"
                  className="border p-1 w-full"
                  value={periodStats}
                  onChange={(e) => setPeriodStats(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="periodSend" className="block font-bold mb-1">
                  Period Send:
                </label>
                <input
                  type="number"
                  id="periodSend"
                  className="border p-1 w-full"
                  value={periodSend}
                  onChange={(e) => setPeriodSend(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-800"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-2"
                  onClick={handleNextPage}
                >
                  Next
                </button>
              </div>
            </form>
          </>
        )}
        {currentPage === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Confirm and Download</h2>
            <p>Are you sure you want to add this device?</p>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-800"
                onClick={handlePrevPage}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-2"
                onClick={handleSubmit}
              >
                Confirm & Download
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddNewDevice;
