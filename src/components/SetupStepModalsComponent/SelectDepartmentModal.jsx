import React, { useState, useEffect, useCallback } from "react";
import { RiCloseFill, RiSearchLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const SelectDepartmentModal = ({ onClose, onSelect }) => {
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Get token from Redux store or localStorage
  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (tokens && typeof tokens === "string") {
    tokens = tokens.replace(/"/g, "");
  }

  const DEPT_API_URL = "https://crp.mydevfactory.com/api/users/departments/";

  // Fetch departments from API
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(DEPT_API_URL, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      setDepartments(response.data);
      setFilteredDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error.response ? error.response.data : error);
      toast.error("Failed to fetch departments");
    }
    setLoading(false);
  }, [tokens]);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter((dept) => dept.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredDepartments(filtered);
    }
  }, [searchTerm, departments]);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Create new department
  const handleCreateDepartment = async () => {
    if (!departmentName.trim()) {
      toast.error("Department name is required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        DEPT_API_URL,
        {
          name: departmentName,
          description: departmentDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Department created successfully");
      fetchDepartments(); // Refresh department list
      setIsAddingDepartment(false);
      setDepartmentName("");
      setDepartmentDescription("");
    } catch (error) {
      console.error("Error creating department:", error.response ? error.response.data : error);
      toast.error(error.response?.data?.message || "Failed to create department");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white text-black p-6 rounded-lg w-[500px] relative">
        <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
        <button className="hover:text-black text-white absolute right-1 top-0" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-lg font-bold text-center">{isAddingDepartment ? "Create A New Department" : "Select Department"}</h2>

        {!isAddingDepartment ? (
          <>
            {/* Search Input */}
            <div className="px-4 mt-3 relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
              />
              <RiSearchLine className="absolute left-6 top-[13px] text-gray-500" size={18} />
            </div>

            {/* Department List */}
            <div className="mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
              {loading ? (
                <div className="text-center py-4">Loading departments...</div>
              ) : filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <div
                    key={dept.id}
                    className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black"
                    onClick={() => {
                      onSelect(dept);
                      onClose();
                    }}
                  >
                    {dept.name}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">{searchTerm ? "No matching departments found" : "No departments available"}</div>
              )}
            </div>

            {/* Add New Department Button */}
            <button
              className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
              onClick={() => setIsAddingDepartment(true)}
            >
              Add New Department
            </button>
          </>
        ) : (
          // Create Department Form
          <div className="mt-2">
            <p className="text-center text-sm text-gray-500 mb-4">Enter details to create a new department.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Department Name</label>
                <input
                  type="text"
                  placeholder="Enter Department Name"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  placeholder="Enter Description"
                  value={departmentDescription}
                  onChange={(e) => setDepartmentDescription(e.target.value)}
                  className="w-full h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                />
              </div>
              <button
                className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4 w-full"
                onClick={handleCreateDepartment}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Department"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDepartmentModal;
