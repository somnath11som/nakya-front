import React from "react";
import Layout from "../Layout";
import BarChart from "./BarChart";

import { useNavigate } from "react-router-dom";

const DataVisualization = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Data Visualization">
      {/* Main Container */}
      <div className="bg-[#171717] p-6 text-white overflow-x-auto max-h-[calc(100vh-177px)] overflow-auto scrollbar-hide rounded-lg">
        {/* Create New Plot Button */}
        <div className="flex justify-center mb-6">
          <button className="bg-[#BBA14F] text-white font-semibold px-6 py-3 rounded-md">Create A New Plot</button>
        </div>
        <div className="bg-black w-full h-[1px] mb-3"></div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Chart Sections */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Chart Card 1 */}
          
            <div className="bg-black p-4 rounded-lg shadow-lg">
              <input type="text" placeholder="Assign Title" className="w-full bg-transparent text-white border border-[#BBA14F] rounded-md p-2 mb-4" />
              <div className="bg-black h-56 rounded-md p-2">
                <BarChart labels={["L...", "T...", "B...", "C...", "D..."]} values={[520, 310, 450, 280, 360]} />
              </div>
              <div className="flex justify-between mt-4 ">
                <button className="bg-[#BBA14F] text-white px-4 py-2 rounded-md">Download</button>
                <button className="bg-[#BBA14F] text-white px-4 py-2 rounded-md">Push The Plot</button>
              </div>
            </div>

            {/* Chart Card 2 */}
            <div className="bg-[#0E0E0E] p-4 rounded-lg shadow-lg">
            <input type="text" placeholder="Assign Title" className="w-full bg-transparent text-white border border-[#BBA14F] rounded-md p-2 mb-4" />
              <div className="bg-black h-56 rounded-md p-2">
                <BarChart labels={["L...", "T...", "B...", "C...", "D..."]} values={[600, 310, 450, 280, 360]} />
              </div>
              <div className="mt-4 text-center">
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md">Push The Plot</button>
              </div>
            </div>
          </div>

          {/* Right Side - Form Inputs */}
          <div className="bg-[#121212] p-3 rounded-lg shadow-lg flex-1 h-fit">
            <div className="bg-black p-6 rounded-lg  text-[#656565]">
              <div className="flex flex-col gap-4">
                {/* Static Select Inputs */}
                {["Select The Experiments", "Select The Data", "Select Data Column", "Select Plot Type"].map((placeholder, index) => (
                  <select key={index} className="w-full bg-black  border border-gray-600 rounded-md p-3">
                    <option>{placeholder}</option>
                  </select>
                ))}

                {/* First X and Y Axis Inputs with spacing */}
                <div className="flex flex-col gap-4">
                  <select className="w-5/6 bg-black  border border-gray-600 rounded-md p-3">
                    <option>Select X Axis Data</option>
                  </select>
                  <select className="w-5/6 bg-black  border border-gray-600 rounded-md p-3">
                    <option>Select Y Axis Data</option>
                  </select>
                </div>

                {/* Spacing between first and second group */}
                <div className="h-2"></div>

                {/* Second X Axis Input with + button */}
                <div className="flex  w-full">
                  <select className="w-5/6 flex-1 bg-black  border border-gray-600 rounded-md p-3">
                    <option>Select X Axis Data</option>
                  </select>
                  <div className="w-1/6 flex justify-end">
                    <button className=" border border-[#BBA14F] text-[#BBA14F] rounded-md px-4 ">+</button>
                  </div>
                </div>

                {/* Second Y Axis Input */}
                <select className="w-5/6 bg-black  border border-gray-600 rounded-md p-3 ">
                  <option>Select Y Axis Data</option>
                </select>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex justify-between mt-6 px-2">
              <button className="border border-[#BBA14F] text-[#BBA14F] px-4 py-2 rounded-md">Add More</button>
              <button className="bg-[#BBA14F]  px-4 py-2 rounded-md">Publish</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataVisualization;
