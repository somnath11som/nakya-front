import React, { useState } from "react";
import { RiCloseFill, RiSearchLine } from "react-icons/ri";

const MediaVolumeModal = ({ onClose, onSelect }) => {
  const [isAddingVolume, setIsAddingVolume] = useState(false);
  const [volumeValue, setVolumeValue] = useState("");
  const [volumeDescription, setVolumeDescription] = useState("");

  const volumes = [
    "100 mL",
    "250 mL", 
    "500 mL",
    "1000 mL",
    "2000 mL",
    "3000 mL",
    "5000 mL"
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white w-[500px] rounded-lg shadow-lg relative">
        <div className="flex justify-between items-center border-b px-4 py-3 relative">
          <h2 className="text-lg font-semibold text-black w-full text-center">
            {isAddingVolume ? "Add New Media Volume" : "Select Media Volume"}
          </h2>
          <button onClick={onClose} className="text-white absolute right-0 top-0 z-40">
            <RiCloseFill size={22} />
          </button>
          <span className="absolute top-0 right-0 bg-[#b89e5a] p-3 rounded-bl-2xl"></span>
        </div>

        {!isAddingVolume ? (
          <>
            <div className="px-4 mt-3 relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-3 pl-10 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
              />
              <RiSearchLine className="absolute left-6 top-[13px] text-gray-500" size={18} />
            </div>

            <div className="px-4 mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
              {volumes.map((volume, index) => (
                <div
                  key={index}
                  className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black"
                  onClick={() => {
                    onSelect(volume);
                    onClose();
                  }}
                >
                  {volume}
                </div>
              ))}
            </div>

            <div className="px-4 py-3">
              <button
                className="w-full bg-[#b89e5a] text-white p-2 rounded-lg"
                onClick={() => setIsAddingVolume(true)}
              >
                Add New Media Volume
              </button>
            </div>
          </>
        ) : (
          <div className="p-6">
            <p className="text-gray-600 text-center mb-3">Enter details for new media volume.</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter Volume (e.g. 100 mL)"
                value={volumeValue}
                onChange={(e) => setVolumeValue(e.target.value)}
                className="w-full p-3 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
              />
              <textarea
                placeholder="Enter Description"
                value={volumeDescription}
                onChange={(e) => setVolumeDescription(e.target.value)}
                className="w-full p-3 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black h-24"
              />
              <button
                className="w-full bg-[#b89e5a] text-white p-2 rounded-lg"
                onClick={() => {
                  console.log("New Volume Added:", volumeValue, volumeDescription);
                  setIsAddingVolume(false);
                  setVolumeValue("");
                  setVolumeDescription("");
                }}
              >
                Save Media Volume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaVolumeModal;
