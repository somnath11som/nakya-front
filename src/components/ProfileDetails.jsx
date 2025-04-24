import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import profileImg from "../assets/Images/loginImg/profileImg.png";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import backIcon from "../assets/Images/manageInstru/backIcon.png";
import editicon from "../assets/Images/ManageStaffImg/editIconWhite.png";
import { toast } from "react-toastify";
// Import the modal components
import EditStaffModal from "./ManageStaffModal/EditStaffModal";
import DeactivateModal from "./ManageStaffModal/DeactivateModal";

const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);

  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  tokens = tokens?.replace(/"/g, "");

  const DEPT_API_URL = "https://crp.mydevfactory.com/api/users/departments/";

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(DEPT_API_URL, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    }
  };

  const fetchStaff = async () => {
    try {
      console.log("Fetching staff with ID:", id);
      setLoading(true);

      const response = await axios.get(`https://crp.mydevfactory.com/api/users/staffs/${id}/`, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      const staffData = response.data;
      console.log("Staff data received:", staffData);
      setStaff(staffData);
    } catch (error) {
      console.error("Error fetching staff:", error);
      if (error.response && error.response.status === 404) {
        toast.error("Staff not found");
        navigate("/manage-staff");
      } else {
        toast.error("Error fetching staff details");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && tokens) {
      fetchStaff();
      fetchDepartments();
    }
  }, [id, tokens]);

  if (loading) {
    return (
      <Layout title="Profile Details">
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-xl text-[#BBA14F]">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={
        <div className="flex items-center gap-2">
          <div className="border border-[#BBA14F] rounded-full p-3">
            <img src={backIcon} alt="Back" className="h-6 w-6 cursor-pointer" onClick={() => navigate(-1)} />
          </div>
          <span>Profile Details</span>
        </div>
      }
    >
      <div className="bg-[#121212] text-white p-6 rounded-lg shadow-lg relative  overflow-x-auto max-h-[calc(100vh-24.5vh)] overflow-auto scrollbar-hide">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          {/* Profile Info */}
          <div className="flex items-center gap-4">
            <div className="bg-[#BBA14F] rounded-full h-16 w-16 flex items-center justify-center">
              <img src={staff.photo ? `https://crp.mydevfactory.com/${staff.photo}` : profileImg} alt={staff.name} className="w-16 h-16 rounded-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{staff.name}</h2>
              <p className="text-sm text-gray-400">{staff.department_name}</p>
              <p className="text-sm text-gray-400">{staff.site}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button className="bg-transparent text-[#BBA14F] px-4 py-2 rounded-lg border-[1px] border-[#BBA14F]" onClick={() => setIsDeactivateModalOpen(true)}>
              Deactivate
            </button>
            <button
              className="bg-[#BBA14F] text-white px-4 py-2 rounded-lg flex items-center"
              onClick={() => {
                setIsEditModalOpen(true);
                fetchDepartments();
              }}
            >
              <img src={editicon} alt="Edit" className="w-4 h-4 mr-2 " />
              Edit
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-4 gap-6 mt-6 text-sm border-t border-[#292929] pt-4">
          <div>
            <p className="text-gray-400">Date Of Birth</p>
            <p>{staff.dob}</p>
          </div>
          <div>
            <p className="text-gray-400">Phone Number</p>
            <p>{staff.phone}</p>
          </div>
          <div>
            <p className="text-gray-400">Email ID</p>
            <p>{staff.email}</p>
          </div>
          <div>
            <p className="text-gray-400">Site (Location)</p>
            <p>{staff.site}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 border-t border-[#292929] pt-4">
          <p className="text-gray-400">Description</p>
          <p>{staff.description}</p>
        </div>

        <div className="flex justify-between gap-20">
          {/* Assign Experiments */}
          <div className="mt-6 border-t border-[#292929] pt-4 w-2/3">
            <p className="text-gray-400">Assign Experiments</p>
            <div className="space-y-2">
              {["Experiment 1", "Experiment 1", "Experiment 2", "Experiment 3"].map((exp, index) => (
                <div key={index} className="bg-[#1E1E1E] p-3 rounded-lg">
                  {exp}
                </div>
              ))}
            </div>
          </div>

          {/* Graph Box */}
          <div className="mt-6 w-1/3  flex justify-center items-end ">
            <div className="h-full bg-[#1E1E1E] rounded-lg flex items-center justify-center w-full">
              <span className="text-gray-500">Graph Placeholder</span>
            </div>
          </div>
        </div>
      </div>

      {/* Use the imported EditStaffModal component */}
      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        fetchStaffs={fetchStaff}
        departments={departments}
        tokens={tokens}
        selectedStaff={staff}
        selectedStaffId={id}
      />

      {/* Use the imported DeactivateModal component */}
      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        fetchStaffs={() => navigate("/manage-staff")}
        tokens={tokens}
        selectedStaffId={id}
      />
    </Layout>
  );
};

export default ProfileDetails;
