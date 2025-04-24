import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import logoImg from "../assets/Images/loginImg/LogoImg.png";
import sidebaricon1 from "../assets/Images/dashbordimgs/organization.png";
import profileImg from "../assets/Images/loginImg/profileImg.png";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";

const AdmineDashbord = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user);
  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (!tokens && window.location.pathname !== "/admin/login") {
    navigate("/");
  }
  tokens = tokens?.replace(/"/g, "");
  console.log(`testing ${tokens}`);
  console.log(users);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const user = useSelector((state) => state.user.user);

  const sidebarItems = [
    {
      icon: sidebaricon1,
      label: "Organization List",
      subItems: [
        { label: "Pending Organizations", path: "/admin-dashbord" },
        { label: "Approved Organizations", path: "/approved-organizations" },
      ],
    },
  ];

  const logOutHandler = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/admin/login");
  };

  const API_URL = "https://crp.mydevfactory.com/api/users/pending/users/";
  const API_URL_APPROVE = "https://crp.mydevfactory.com/api/users/approve/";

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    console.log("Token Before API call", tokens);
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response:", response.data);
      setOrganizations(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error);
    }
    setLoading(false);
  };

  const handleStatusChange = (org) => {
    setSelectedOrg(org);
    setIsEditModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      if (selectedOrg?.id) {
        await axios.patch(API_URL_APPROVE + selectedOrg?.id + "/", null, {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "application/json",
          },
        });
        setIsEditModalOpen(false);
        setResponseMessage("Status updated successfully!");
        toast.success("Status updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchOrganizations();
      }
    } catch (error) {
      console.error(error.message);
      setResponseMessage("Error updating status.");
      toast.error("Error updating status. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:h-screen h-auto bg-black text-white">
      {/* Mobile Menu Button */}
      <button className="md:hidden fixed top-4 left-4 z-50 text-white p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:sticky md:top-0 w-72 bg-black p-6 h-screen transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex items-center space-x-3 mb-14">
          <img src={logoImg} alt="Logo" className="w-1/2" />
        </div>
        <ul className="space-y-6">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <div className="flex items-center space-x-4 text-[#FCF0E8] hover:text-[#BBA14F] cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-5 h-5 [li:hover_&]:invert [li:hover_&]:brightness-[50%] [li:hover_&]:sepia [li:hover_&]:saturate-[600%] [li:hover_&]:hue-rotate-[350deg]"
                />
                <span className="text-lg">{item.label}</span>
              </div>
              {isDropdownOpen && (
                <ul className="ml-9 mt-2 space-y-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="text-[#FCF0E8] hover:text-[#BBA14F] cursor-pointer" onClick={() => navigate(subItem.path)}>
                      {subItem.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li onClick={logOutHandler} className="flex items-center space-x-4 text-[#FCF0E8] hover:text-[#BBA14F] cursor-pointer">
            <img src={sidebaricon1} alt="Logout" className="w-5 h-5" />
            <span className="text-lg">Logout</span>
          </li>
        </ul>
        {/* Vertical Line on the Right */}
        <div className="absolute top-0 right-0 h-full w-[1px] bg-[#202020]"></div>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 px-4 md:px-8 py-5 mt-16 md:mt-0 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <h2 className="text-2xl md:text-3xl font-semibold text-center md:text-left text-white">
            <span className="text-yellow-400">Welcome, </span>
            Admin
          </h2>

          <div className="flex items-center">
            <img src={profileImg} alt="Profile" className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-yellow-400" />
          </div>
        </div>

        <p className="text-gray-400 mb-6 text-base md:text-lg text-center md:text-left">Pending Organizations</p>
        <div className="border-t border-[#202020] my-4"></div>

        {/* Pending Organization Status Table */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-72 border-2 border-[#BBA14F] rounded-lg bg-transparent text-white focus:outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-7 h-5 text-[#BBA14F]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* <h1 className="text-2xl font-bold text-white">Pending Organizations</h1> */}
        </div>
        {loading ? (
          <p className="text-center text-yellow-500">Loading...</p>
        ) : (
          <div className="border border-[#202020] rounded-lg overflow-x-auto max-h-[calc(80vh-100px)] overflow-auto scrollbar-hide">
            <table className="w-full text-white border border-[#202020] bg-[#171717]">
              <thead className="bg-[#000000] text-[#818181] sticky top-0">
                <tr>
                  <th className="py-3 px-5 border border-[#202020] text-left">Organization Name</th>
                  <th className="py-3 px-5 border border-[#202020] text-left">Name</th>
                  <th className="py-3 px-5 border border-[#202020] text-left">Email</th>
                  <th className="py-3 px-5 border border-[#202020] text-left">Number</th>
                  <th className="py-3 px-5 border border-[#202020] text-left">Status</th>
                  <th className="py-3 px-5 border border-[#202020] text-center">Change Status</th>
                </tr>
              </thead>
              <tbody>
                {organizations
                  .filter((org) => {
                    const searchLower = searchTerm.toLowerCase();
                    return (
                      org.organization_name.toLowerCase().includes(searchLower) ||
                      `${org.first_name} ${org.last_name}`.toLowerCase().includes(searchLower) ||
                      org.email.toLowerCase().includes(searchLower) ||
                      org.phone.toLowerCase().includes(searchLower)
                    );
                  })
                  .map((org) => (
                    <tr key={org.id} className="hover:bg-gray-800 transition duration-300">
                      <td className="py-3 px-5 border border-[#202020]">{org.organization_name}</td>
                      <td className="py-3 px-5 border border-[#202020]">{`${org.first_name} ${org.last_name}`}</td>
                      <td className="py-3 px-5 border border-[#202020]">{org.email}</td>
                      <td className="py-3 px-5 border border-[#202020]">{org.phone}</td>
                      <td className="py-3 px-5 border border-[#202020]">{org.is_approved ? "Approved" : "Pending"}</td>
                      <td className="py-3 px-5 border border-[#202020] text-center">
                        <button onClick={() => handleStatusChange(org)} className="px-4 py-2 rounded bg-[#3FAF7D] hover:bg-green-600">
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Status Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#171717] p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold text-[#BBA14F] mb-4">Change Status</h2>
              <p className="text-white mb-4">Are you sure you want to approve {selectedOrg?.organization_name || `${selectedOrg?.first_name} ${selectedOrg?.last_name}`}?</p>
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-[#BBA14F] text-white rounded hover:bg-[#a38c45] disabled:opacity-50" onClick={handleUpdateStatus} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Confirm"}
                </button>
              </div>
              {responseMessage && <p className="mt-4 text-center text-yellow-500">{responseMessage}</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdmineDashbord;
