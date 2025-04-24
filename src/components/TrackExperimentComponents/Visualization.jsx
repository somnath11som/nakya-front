import React from "react";
import Layout from "../Layout";
import backIcon from "../../assets/Images/manageInstru/backIcon.png";
import { useNavigate } from "react-router-dom";

const Visualization = () => {
  const navigate = useNavigate();

  return (
    <Layout
      title={
        <div className="flex items-center gap-2">
          <div className="border border-[#BBA14F] rounded-full p-3">
            <img
              src={backIcon}
              alt="Back"
              className="h-5 w-5 cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </div>
          <span>Visualization</span>
        </div>
      }
    >
      {/* Main Container */}
      <div className="bg-[#171717]  p-6 text-white  overflow-x-auto max-h-[calc(100vh-177px)] overflow-auto scrollbar-hide rounded-lg">
        {/* Create New Plot Button */}
        <div className="flex justify-center mb-6">
          <button className="bg-[#BBA14F] text-white font-semibold px-6 py-3 rounded-md">
            Create A New Plot
          </button>
        </div>
        <div className="bg-black w-fill h-[1px] mb-3 "></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side - Chart Sections */}
          <div className="flex flex-col gap-6">
            {/* Chart Card 1 */}
            <div className="bg-[#0E0E0E] p-4 rounded-lg shadow-lg">
              <input
                type="text"
                placeholder="Assign Title"
                className="w-full bg-transparent text-white border border-[#BBA14F] rounded-md p-2 mb-4"
              />
              {/* Placeholder for Chart */}
              <div className="bg-black h-56 rounded-md flex items-center justify-center">
                <span className="text-gray-400">Chart Placeholder</span>
              </div>
              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button className="bg-[#BBA14F] text-white px-4 py-2 rounded-md">
                  Download
                </button>
                <button className="bg-[#BBA14F] text-white px-4 py-2 rounded-md">
                  Push The Plot
                </button>
              </div>
            </div>

            {/* Chart Card 2 (Smaller, Single Button) */}
            <div className="bg-[#0E0E0E] p-4 rounded-lg shadow-lg">
              <input
                type="text"
                placeholder="Assign Title"
                className="w-full bg-transparent text-white border border-gray-600 rounded-md p-2 mb-4"
              />
              {/* Placeholder for Chart */}
              <div className="bg-black h-56 rounded-md flex items-center justify-center">
                <span className="text-gray-400">Chart Placeholder</span>
              </div>
              {/* Single Button */}
              <div className="mt-4 text-center">
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md">
                  Push The Plot
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Form Inputs */}
          <div className="bg-[#0E0E0E] p-6 rounded-lg shadow-lg">
            {/* Select Inputs */}
            <div className="flex flex-col gap-4">
              {[
                "Select The Experiments",
                "Select The Data",
                "Select Data Column",
                "Select Plot Type",
                "Select X Axis Data",
                "Select Y Axis Data",
                "Select X Axis Data",
                "Select Y Axis Data",
              ].map((placeholder, index) => (
                <select
                  key={index}
                  className="w-full bg-black text-white border border-gray-600 rounded-md p-2"
                >
                  <option>{placeholder}</option>
                </select>
              ))}
            </div>

            {/* Add More & Publish Buttons */}
            <div className="flex justify-between mt-6">
              <button className="border border-[#BBA14F] text-[#BBA14F] px-4 py-2 rounded-md">
                Add More
              </button>
              <button className="bg-[#BBA14F] text-white px-4 py-2 rounded-md">
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Visualization;
