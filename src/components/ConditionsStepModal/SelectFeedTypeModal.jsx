import React, { useState } from "react";
import { RiCloseFill, RiSearchLine } from "react-icons/ri";

const SelectFeedTypeModal = ({ onClose, onSelect }) => {
  const [isAddingFeedType, setIsAddingFeedType] = useState(false);
  const [feedTypeName, setFeedTypeName] = useState("");
  const [feedTypeDescription, setFeedTypeDescription] = useState("");

  const feedTypes = [
    "CD CHO Medium",
    "CD FortiCHO Medium",
    "EX-CELL CD CHO",
    "ProCHO 5",
    "HyClone CDM4CHO",
    "BalanCD CHO Growth A",
    "PowerCHO Advance",
    "ActiPro Medium",
    "EfficientFeed A",
    "EfficientFeed B",
    "EfficientFeed C",
    "Cell Boost 1",
    "Cell Boost 2",
    "Cell Boost 3",
    "Cell Boost 4"
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      {/* Main Modal */}
      <div className="bg-white w-[500px] rounded-lg shadow-lg relative">
        {/* Close Button */}
        <div className="flex justify-between items-center border-b px-4 py-3 relative">
          <h2 className="text-lg font-semibold text-black w-full text-center">
            {isAddingFeedType ? "Create A New Feed Type" : "Select Feed Type"}
          </h2>
          <button onClick={onClose} className="text-white absolute right-0 top-0 z-40">
            <RiCloseFill size={22} />
          </button>
          <span className="absolute top-0 right-0 bg-[#b89e5a] p-3 rounded-bl-2xl"></span>
        </div>

        {/* Feed Type Selection */}
        {!isAddingFeedType ? (
          <>
            {/* Search Input */}
            <div className="px-4 mt-3 relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-3 pl-10 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
              />
              <RiSearchLine className="absolute left-6 top-[13px] text-gray-500" size={18} />
            </div>

            {/* Feed Type List */}
            <div className="px-4 mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
              {feedTypes.map((type, index) => (
                <div
                  key={index}
                  className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black"
                  onClick={() => {
                    onSelect(type);
                    onClose();
                  }}
                >
                  {type}
                </div>
              ))}
            </div>

            {/* Add New Feed Type Button */}
            <div className="px-4 py-3">
              <button
                className="w-full bg-[#b89e5a] text-white p-2 rounded-lg"
                onClick={() => setIsAddingFeedType(true)}
              >
                Add New Feed Type
              </button>
            </div>
          </>
        ) : (
          // Create Feed Type Form
          <div className="p-6">
            <p className="text-gray-600 text-center mb-3">Enter details to create a new feed type.</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter Feed Type Name"
                value={feedTypeName}
                onChange={(e) => setFeedTypeName(e.target.value)}
                className="w-full p-3 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
              />
              <textarea
                placeholder="Enter Description"
                value={feedTypeDescription}
                onChange={(e) => setFeedTypeDescription(e.target.value)}
                className="w-full p-3 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black h-24"
              />
              <button
                className="w-full bg-[#b89e5a] text-white p-2 rounded-lg"
                onClick={() => {
                  console.log("New Feed Type Created:", feedTypeName, feedTypeDescription);
                  setIsAddingFeedType(false);
                  setFeedTypeName("");
                  setFeedTypeDescription("");
                }}
              >
                Save Feed Type
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectFeedTypeModal;
