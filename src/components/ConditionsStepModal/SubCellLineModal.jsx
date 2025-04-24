import React, { useState } from "react";
import { RiCloseFill, RiSearchLine } from "react-icons/ri";

const SubCellLineModal = ({ onClose, onSelect }) => {
  const [isAddingSubCellLine, setIsAddingSubCellLine] = useState(false);
  const [subCellLineName, setSubCellLineName] = useState("");
  const [subCellLineDescription, setSubCellLineDescription] = useState("");

  const subCellLines = [
    "CHO-K1",
    "CHO-S",
    "CHO-DG44",
    "HEK293",
    "HEK293T",
    "HEK293F",
    "SP2/0",
    "NS0",
    "Hybridoma",
    "BHK-21",
    "Vero",
    "MDCK",
    "PER.C6",
    "CAP",
    "HT-1080"
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      {/* Main Modal */}
      <div className="bg-white w-[500px] rounded-lg shadow-lg relative">
        {/* Close Button */}
        <div className="flex justify-between items-center border-b px-4 py-3 relative">
          <h2 className="text-lg font-semibold text-black w-full text-center">
            {isAddingSubCellLine ? "Create A New Sub Cell Line" : "Select Sub Cell Line"}
          </h2>
          <button onClick={onClose} className="text-white absolute right-0 top-0 z-40">
            <RiCloseFill size={22} />
          </button>
          <span className="absolute top-0 right-0 bg-[#b89e5a] p-3 rounded-bl-2xl"></span>
        </div>

        {/* Sub Cell Line Selection */}
        {!isAddingSubCellLine ? (
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

            {/* Sub Cell Line List */}
            <div className="px-4 mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
              {subCellLines.map((line, index) => (
                <div
                  key={index}
                  className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black"
                  onClick={() => {
                    onSelect(line);
                    onClose();
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Add New Sub Cell Line Button */}
            <div className="px-4 py-3">
              <button
                className="w-full bg-[#b89e5a] text-white p-2 rounded-lg"
                onClick={() => setIsAddingSubCellLine(true)}
              >
                Add New Sub Cell Line
              </button>
            </div>
          </>
        ) : (
          // Create Sub Cell Line Form
          <div className="p-6">
            <p className="text-gray-600 text-center mb-3">Enter details to create a new sub cell line.</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter Sub Cell Line Name"
                value={subCellLineName}
                onChange={(e) => setSubCellLineName(e.target.value)}
                className="w-full p-3 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
              />
              <textarea
                placeholder="Enter Description"
                value={subCellLineDescription}
                onChange={(e) => setSubCellLineDescription(e.target.value)}
                className="w-full p-3 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black h-24"
              />
              <button
                className="w-full bg-[#b89e5a] text-white p-2 rounded-lg"
                onClick={() => {
                  console.log("New Sub Cell Line Created:", subCellLineName, subCellLineDescription);
                  setIsAddingSubCellLine(false);
                  setSubCellLineName("");
                  setSubCellLineDescription("");
                }}
              >
                Save Sub Cell Line
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCellLineModal;
