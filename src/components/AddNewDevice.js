import React, { useState } from "react";
import axios from "axios";

const AddNewDevice = ({ isOpen, onClose, onDeviceAdded }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send data to the respective API based on the type of device
      await axios.post("http://192.168.88.251:3000/npb/createnpb", {
        name,
        location,
      });
      await axios.post("http://192.168.88.251:3000/ps/createps", {
        name,
        location,
      });
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
          <div className="flex justify-between">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-800"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-2"
            >
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewDevice;
