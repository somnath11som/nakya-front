import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import viewIcon from "../assets/Images/ManageStaffImg/viewIcon.png";
import optionIcon from "../assets/Images/ManageStaffImg/threedotIcon.png";
import Layout from "./Layout";
import backIcon from "../assets/Images/manageInstru/backIcon.png";
import {useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const experiments = [
  {
    id: "VR-24-PP-003-07",
    title: "Figuring out cell expansion",
    createdBy: "Akshit Doe",
    status: "Ongoing",
    startDate: "05/20/2015",
    endDate: "05/20/2019",
    instruments: "BioTek Gen5",
    staff: "Dr. Smith, Dr. Johnson, Dr. Brown",
  },
  {
    id: "VR-24-PP-003-07",
    title: "Figuring out cell expansion",
    createdBy: "Akshit Doe",
    status: "Completed",
    startDate: "05/20/2015",
    endDate: "05/20/2019",
    instruments: "BioTek Gen5",
    staff: "Dr. Smith, Dr. Johnson, Dr. Brown",
  },
  {
    id: "VR-24-PP-003-07",
    title: "Figuring out cell expansion",
    createdBy: "Akshit Doe",
    status: "Archived",
    startDate: "05/20/2015",
    endDate: "05/20/2019",
    instruments: "BioTek Gen5",
    staff: "Dr. Smith, Dr. Johnson, Dr. Brown",
  },
];

export default function ExperimentHistory() {
  const navigate = useNavigate();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setShowStatusModal(false);
  };
  
  return (
    <Layout
    title="Experiment History"
    >
     <div className=" bg-black  text-gray-300  rounded-lg overflow-x-auto max-h-[calc(100vh-19.7vh)] overflow-auto scrollbar-hide">
      {/* Search Bars Layout */}
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-black py-2 z-10 gap-10">
        {/* Large Search Bar (Left) */}
        <div className="flex items-center bg-[#1A1A1A] rounded-lg px-4 py-3 border border-[#BBA14F] w-3/4">
          <FiSearch className="text-yellow-500 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search Experiments"
            className="bg-transparent outline-none w-full text-white"
          />
        </div>

        {/* Status Dropdown (Right) */}
        <div 
          className="flex items-center justify-between bg-[#1A1A1A] rounded-lg px-4 py-3 border border-[#BBA14F] w-1/4 cursor-pointer"
          onClick={() => setShowStatusModal(!showStatusModal)}
        >
          <span className="text-white">{selectedStatus}</span>
          <IoIosArrowDown className="text-yellow-500 text-lg" />
        </div>
      </div>

      {/* Status Selection Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white w-1/6 p-3 px-6 rounded-lg relative">
            {/* Close Button */}
            <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
            <button className="hover:text-black text-white absolute right-1 top-0" onClick={() => setShowStatusModal(false)}>
              ✕
            </button>

            <h3 className="text-center text-xl font-bold mb-6 text-black">Select Status</h3>
            <div className="space-y-2 text-center">
             
              <div 
                className="p-2 hover:bg-[#f5f5f5] rounded cursor-pointer text-black border-b border-[#E6E6E6]"
                onClick={() => handleStatusSelect("Ongoing")}
              >
                Ongoing
              </div>
              <div 
                className="p-2 hover:bg-[#f5f5f5] rounded cursor-pointer text-black border-b border-[#E6E6E6]"
                onClick={() => handleStatusSelect("Completed")}
              >
                Completed
              </div>
              <div 
                className="p-2 hover:bg-[#f5f5f5] rounded cursor-pointer text-black border-b border-[#E6E6E6]"
                onClick={() => handleStatusSelect("Archived")}
              >
                Archived
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Experiment List */}
      <div className="space-y-2">
        {experiments.map((exp, index) => (
          <div key={index} className="bg-[#1A1A1A] p-4 rounded-lg border border-[#292929] relative">
            <div className="absolute top-4 right-4 flex space-x-4">
              <img src={viewIcon} alt="View" className="w-6 h-5 cursor-pointer" />
              <div className="h-6 w-[1px] bg-gray-600"></div>
              <img src={optionIcon} alt="Options" className=" h-6 cursor-pointer" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              
              <div>
                <p className="text-gray-400 text-sm">Experiment ID</p>
                <p className="text-white">{exp.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Experiment Title</p>
                <p className="text-white">{exp.title}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Created By</p>
                <p className="text-white">{exp.createdBy}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-white">{exp.status}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Start Date</p>
                <p className="text-white">{exp.startDate}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">End Date</p>
                <p className="text-white">{exp.endDate}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Instruments Used</p>
                <p className="text-white">{exp.instruments}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Assigned Staff</p>
                <p className="text-white">{exp.staff}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
 </Layout>
  );
}
