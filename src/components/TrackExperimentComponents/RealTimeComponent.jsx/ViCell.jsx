import React, { useState } from "react";
import Layout from "../../Layout";
import backIcon from "../../../assets/Images/manageInstru/backIcon.png";
import NoDataFoundIcon from "../../../assets/Images/TrackexpImg/NoDataFound.png";
import AddIcon from "../../../assets/Images/TrackexpImg/AddIcon.png";
import { useNavigate } from "react-router-dom";

const ViCell = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample Data for the Table
  const tableData = [
    { condition: "Conditions 1", date: "15/12/2024", time: "17:50", name: "VCD", freestyle: "3.26E+05", excell: "3.70E+05", hekcd: "2.68E+05" },
    { condition: "Conditions 2", date: "15/12/2024", time: "17:50", name: "Viability", freestyle: "95.81", excell: "100", hekcd: "91.19" },
    { condition: "Conditions 3", date: "15/12/2024", time: "17:50", name: "Lactate", freestyle: "0.02", excell: "4.312", hekcd: "0.059" },
    { condition: "Conditions 4", date: "15/12/2024", time: "17:50", name: "Glucose", freestyle: "27.052", excell: "34.944", hekcd: "26.09" },
  ];

  return (
    <Layout
      title={
        <div className="flex items-center gap-2">
          <div className="border border-[#BBA14F] rounded-full p-3">
            <img src={backIcon} alt="Back" className="h-5 w-5 cursor-pointer" onClick={() => navigate(-1)} />
          </div>
          <span>ViCell</span>
        </div>
      }
    >
      {/* Main Container */}
      <div className="bg-[#171717] min-h-[calc(100vh-177px)] rounded-lg p-6 text-white overflow-x-auto max-h-[calc(100vh-177px)] overflow-auto scrollbar-hide">
        {/* Top Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Data List</h2>
          <button className="bg-[#BBA14F] text-white font-semibold px-6 py-3 rounded-md" onClick={() => setIsModalOpen(true)}>
            Add New Data
          </button>
        </div>

        {tableData.length > 0 ? (
          <>
            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-600 text-white">
                <thead>
                  <tr className="bg-black text-left">
                    <th className="p-3 border border-gray-600">Conditions</th>
                    <th className="p-3 border border-gray-600">Date</th>
                    <th className="p-3 border border-gray-600">Time</th>
                    <th className="p-3 border border-gray-600">Name</th>
                    <th className="p-3 border border-gray-600">FreeStyle</th>
                    <th className="p-3 border border-gray-600">EX-CELL</th>
                    <th className="p-3 border border-gray-600">HEK-CD</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="text-center bg-[#0E0E0E]">
                      <td className="p-3 border border-gray-600">{row.condition}</td>
                      <td className="p-3 border border-gray-600">{row.date}</td>
                      <td className="p-3 border border-gray-600">{row.time}</td>
                      <td className="p-3 border border-gray-600">{row.name}</td>
                      <td className="p-3 border border-gray-600">{row.freestyle}</td>
                      <td className="p-3 border border-gray-600">{row.excell}</td>
                      <td className="p-3 border border-gray-600">{row.hekcd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Download Button */}
            <div className="flex justify-center mt-6">
              <button className="border border-[#BBA14F] text-[#BBA14F] px-6 py-3 rounded-md font-semibold">Download Data</button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] rounded-lg">
            <img src={NoDataFoundIcon} alt="No Data Found" className="h-16 w-16 mb-4 opacity-70" />
            <span className="text-[#606060]">No Data Found</span>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[400px] relative text-center">
            {/* Close Button */}
            <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
              <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>

            {/* Modal Content */}
            <h2 className="text-lg font-semibold mb-2 text-black">Add New Data</h2>
            <p className="text-gray-600 text-sm mb-4">Please upload a .xls file</p>

            {/* File Upload Box */}
            <label htmlFor="fileUpload" className="cursor-pointer">
              <div className="border-2 border-dashed border-[#BBA14F] p-6 rounded-lg text-gray-600 flex flex-col items-center">
                <img src={AddIcon} alt="Upload Icon" className="h-12 w-12 mb-2 opacity-70" />
                <span className="text-[#BBA14F] text-sm font-semibold">Upload .xls File</span>
              </div>
              <input type="file" id="fileUpload" className="hidden" />
            </label>

            {/* Submit Button */}
            <button className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4">Submit</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ViCell;
