import React, { useState } from "react";
import { RiSearchLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

import ExpSummary from "../assets/Images/TrackexpImg/ExperimentalSummary.png";
import realTimeRawData from "../assets/Images/TrackexpImg/real-time-rawData.png";
import Visualization from "../assets/Images/TrackexpImg/Visualization.png";

//active experiment img
import activeExpSummary from "../assets/Images/TrackexpImg/activeExperimentalSummary.png";
import activeRealTimeRawData from "../assets/Images/TrackexpImg/activeReal-time-rawData.png";
import activeVisualization from "../assets/Images/TrackexpImg/activeVisualization.png";

const TrackExperiment = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState("");

  const getTrackItems = () => {
    if (selectedExperiment) {
      return [
        { img: activeRealTimeRawData, title: "Real-time Raw Data" },
        { img: activeExpSummary, title: "Experimental Summary" },
        { img: activeVisualization, title: "Visualization" },
      ];
    }
    return [
      { img: realTimeRawData, title: "Real-time Raw Data" },
      { img: ExpSummary, title: "Experimental Summary" },
      { img: Visualization, title: "Visualization" },
    ];
  };

  const experimentTypes = [
    "Protein production transient transfection",
    "Protein production stable cell line",
    "Viral vector production transient transfection",
    "Cell therapy cell expansion",
    "Cell therapy viral transduction",
    "Cell therapy CRISPR",
    "Seed train/expansion",
  ];

  return (
    <Layout title="Track Experiment">
      <div className="bg-[#171717] p-4 rounded-lg h-[30rem]">
        {/* Search Bar */}
        <div className="relative w-full max-w-screen-lg mx-auto">
          <div className="flex items-center bg-[#000000] text-white p-3 rounded-lg mb-2 border border-[#BBA14F] cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {/* <RiSearchLine className="text-xl mr-3" /> */}
            <input type="text" placeholder="Select Experiment Type" className="flex-1 bg-transparent focus:outline-none cursor-pointer" value={selectedExperiment} readOnly />
            {isDropdownOpen ? <RiArrowUpSLine className="text-xl text-[#FFAB40]" /> : <RiArrowDownSLine className="text-xl text-[#FFAB40]" />}
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute z-10 w-full bg-white rounded-lg shadow-lg border border-gray-300">
              {experimentTypes.map((type, index) => (
                <p
                  key={index}
                  className={`px-4 py-3 text-black cursor-pointer hover:bg-gray-200 ${index !== experimentTypes.length - 1 ? "border-b border-[#E6E6E6]" : ""}`}
                  onClick={() => {
                    setSelectedExperiment(type);
                    setIsDropdownOpen(false);
                  }}
                >
                  {type}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          {getTrackItems().map((item, index) => {
            const links = ["/real-time-data", "/experimental-summary", "/visualization"];

            const CardContent = (
              <div
                className={`rounded-lg p-4 flex items-center justify-center  py-10 shadow-lg ${selectedExperiment ? "bg-[#FFAB4012] text-[#FFAB40]" : "bg-[#A8A8A812] text-white"}`}
              >
                <img src={item.img} alt={item.title} className="w-12 h-12 mr-4" />
                <p className="text-lg font-semibold">{item.title}</p>
              </div>
            );

            return selectedExperiment ? (
              <Link key={index} to={links[index]} className="no-underline">
                {CardContent}
              </Link>
            ) : (
              <div key={index}>{CardContent}</div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default TrackExperiment;
