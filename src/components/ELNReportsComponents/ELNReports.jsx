// src/pages/ELNReports.js
import React, { useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

const ELNReports = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState("");
  const navigate = useNavigate();

  const experimentTypes = [
    "VR-24-PP-003-07",
    "VR-24-PP-003-08",
    "VR-24-PP-003-09", 
    "VR-24-PP-003-10",
    "VR-24-PP-003-15",
    "VR-24-PP-003-18",
    "VR-24-PP-003-21",
    "VR-24-PP-003-22",
    "VR-24-PP-003-23",
  ];

  const handleSelect = (experimentId) => {
    setSelectedExperiment(experimentId);
    setIsDropdownOpen(false);
    navigate(`/experiment/${experimentId}`);
  };

  return (
    <Layout title="ELN Reports">
      <div className="bg-[#171717] p-4 rounded-lg min-h-[calc(100vh-22vh)] flex justify-center items-start">
        <div className="relative w-full">
          <div
            className="flex items-center bg-black text-white px-4 py-3 rounded-md border border-[#BBA14F] cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <input
              type="text"
              placeholder="Select Experiment ID"
              className="flex-1 bg-transparent placeholder:text-gray-400 focus:outline-none cursor-pointer"
              value={selectedExperiment}
              readOnly
            />
            {isDropdownOpen ? (
              <RiArrowUpSLine className="text-sm text-[#FFAB40]" />
            ) : (
              <RiArrowDownSLine className="text-sm text-[#FFAB40]" />
            )}
          </div>

          {isDropdownOpen && (
            <div className="absolute w-full bg-white rounded-md mt-1 shadow-md z-10 overflow-y-auto max-h-96 scrollbar-hide">
              {experimentTypes.map((type, index) => (
                <p
                  key={index}
                  className="px-4 py-3 text-black hover:bg-gray-100 border-b border-gray-200 last:border-none cursor-pointer"
                  onClick={() => handleSelect(type)}
                >
                  {type}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ELNReports;
