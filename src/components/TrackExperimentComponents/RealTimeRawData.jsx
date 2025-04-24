import React from 'react';
import Layout from '../Layout';
import backIcon from "../../assets/Images/manageInstru/backIcon.png";
import {useNavigate, Link } from "react-router-dom";

const RealTimeRawData = () => {
  const dataList = [
    { name: "Vi Cell", route: "/vi-cell" },
    { name: "Flex", route: "/flex" },
    { name: "VCD", route: "/vcd" }
  ];
  const navigate = useNavigate();


  return (
    <Layout
    title={
      <div className="flex items-center gap-2">
        <div className="border border-[#BBA14F] rounded-full p-3">
          <img src={backIcon} alt="Back" className="h-5 w-5 cursor-pointer" onClick={() => navigate(-1)} />
        </div>
        <span>Real-time Raw Data</span>
      </div>
    }
  >
      <div className="bg-[#171717] max-h-[calc(100vh-300px)] min-h-[calc(100vh-180px)] p-8 text-white rounded-lg">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">Data List</h1>

        {/* Data Buttons */}
        <div className="flex gap-6">
          {dataList.map((item, index) => (
            <Link to={item.route} key={index}>
              <button
                className="border border-[#BBA14F] text-[#BBA14F] px-16 py-3 rounded-md text-lg"
              >
                {item.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RealTimeRawData;
