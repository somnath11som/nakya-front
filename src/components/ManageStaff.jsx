import React, { useCallback, useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import Layout from "./Layout";
import filterIcon from "../assets/Images/ManageStaffImg/filterImg.png";
import shortbyIcon from "../assets/Images/ManageStaffImg/ShortbyImg.png";
import viewIcon from "../assets/Images/ManageStaffImg/viewIcon.png";
import optionIcon from "../assets/Images/ManageStaffImg/threedotIcon.png";
import uploadIcon from "../assets/Images/loginImg/uplodeicon.png";
import profileImg from "../assets/Images/loginImg/profileImg.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

// Import Modal Components
// import { AddStaffModal, EditStaffModal, DeactivateModal, SortModal, FilterModal } from "./ManageStaffModal";

// ./ManageStaffModal/AddStaffModal

import AddStaffModal from "./ManageStaffModal/AddStaffModal";
import EditStaffModal from "./ManageStaffModal/EditStaffModal";
import DeactivateModal from "./ManageStaffModal/DeactivateModal";
import SortModal from "./ManageStaffModal/SortModal";
import FilterModal from "./ManageStaffModal/FilterModal";

const ManageStaff = () => {
  const navigate = useNavigate();

  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (!tokens) {
    navigate("/");
  }
  tokens = tokens.replace(/"/g, "");
  // console.log(`testing ${tokens}`);
  // console.log(users);

  const [loading, setLoading] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const [optionsModalPosition, setOptionsModalPosition] = useState({ x: 0, y: 0 });
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
    site: "",
    description: "",
    photo: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const DEPT_API_URL = "https://crp.mydevfactory.com/api/users/departments/";
  const STAFF_API_URL = "https://crp.mydevfactory.com/api/users/staffs/";

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
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error);
      toast.error("Failed to fetch departments");
    }
    setLoading(false);
  }, [tokens]);
  console.log(departments);

  const fetchStaffs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(STAFF_API_URL, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      setStaffs(response.data);
      setFilteredStaffs(response.data);
    } catch (error) {
      console.error("Error fetching staff data:", error.response ? error.response.data : error);
      toast.error("Failed to fetch staff data");
    }
    setLoading(false);
  }, [tokens]);

  console.log(departments);

  // Fetch department data from API
  useEffect(() => {
    fetchDepartments();
    fetchStaffs();
  }, [fetchDepartments, fetchStaffs]);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStaffs(staffs);
    } else {
      const filtered = staffs.filter((staff) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          staff.name.toLowerCase().includes(searchLower) ||
          (staff.department && typeof staff.department === "string" && staff.department.toLowerCase().includes(searchLower)) ||
          (staff.designation && typeof staff.designation === "string" && staff.designation.toLowerCase().includes(searchLower)) ||
          (staff.email && typeof staff.email === "string" && staff.email.toLowerCase().includes(searchLower)) ||
          (staff.phone && staff.phone.includes(searchTerm)) ||
          (staff.site && typeof staff.site === "string" && staff.site.toLowerCase().includes(searchLower))
        );
      });
      setFilteredStaffs(filtered);
    }
  }, [searchTerm, staffs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    if (!formData.name || !formData.dob || !formData.department || !formData.designation || !formData.email || !formData.phone || !formData.site) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form data to FormData object
      formDataToSend.append("name", formData.name);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", countryCode + formData.phone);
      formDataToSend.append("site", formData.site);
      formDataToSend.append("description", formData.description);
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const response = await axios.post(STAFF_API_URL, formDataToSend, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Staff added successfully:", response.data);
      toast.success("Staff added successfully");

      // Refresh staff list
      fetchStaffs();

      // Reset form and close modal
      setFormData({
        name: "",
        dob: "",
        department: "",
        designation: "",
        email: "",
        phone: "",
        site: "",
        description: "",
        photo: null,
      });
      setPreviewImage(null);
      setIsAddStaffModalOpen(false);
    } catch (error) {
      console.error("Error adding staff:", error.response ? error.response.data : error);
      toast.error(error.response?.data?.error || "Failed to add staff");
    }

    setLoading(false);
  };

  const handleOptionsClick = (e, staffId) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setOptionsModalPosition({
      x: rect.left - 160, // Moved 160px to the left
      y: rect.bottom + window.scrollY,
    });
    setSelectedStaffId(staffId);
    setShowOptionsModal(true);
  };

  // Close options modal when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowOptionsModal(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleEditClick = async (staffId) => {
    setShowOptionsModal(false);
    try {
      setLoading(true);
      const response = await axios.get(`https://crp.mydevfactory.com/api/users/staffs/${staffId}/`, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      const staffData = response.data;
      setSelectedStaff(staffData);

      // Handle phone number and country code
      let phoneNumber = staffData.phone || "";
      let phoneCode = "+91"; // Default

      // Extract country code from phone number if it exists
      if (phoneNumber && phoneNumber.startsWith("+")) {
        // If the number is longer than 10 digits after the + sign
        if (phoneNumber.length > 11) {
          // +[country code][10 digits]
          // Extract the last 10 digits as the actual phone number
          const actualNumber = phoneNumber.slice(-10);
          // Everything before that is the country code (including the +)
          phoneCode = phoneNumber.slice(0, phoneNumber.length - 10);
          phoneNumber = actualNumber;
        } else {
          // If the number is short, use the default extraction
          const matches = phoneNumber.match(/^\+(\d{1,4})/);
          if (matches) {
            const codeDigits = matches[1];
            phoneCode = `+${codeDigits}`;
            phoneNumber = phoneNumber.substring(phoneCode.length);
          }
        }
      }

      setCountryCode(phoneCode);

      // Set form data with proper mapping
      const newFormData = {
        name: staffData.name || "",
        dob: staffData.dob || "",
        department: staffData.department || "", // This is the department ID
        designation: staffData.designation || "",
        email: staffData.email || "",
        phone: phoneNumber,
        site: staffData.site || "",
        description: staffData.description || "",
        // Don't include photo here, as we're not storing the file object
      };

      setFormData(newFormData);

      // Set preview image if photo exists
      if (staffData.photo) {
        const photoUrl = `https://crp.mydevfactory.com/${staffData.photo}`;
        setPreviewImage(photoUrl);
      } else {
        setPreviewImage(null);
      }

      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Error fetching staff details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    // Show loading state
    setFormSubmitting(true);

    try {
      // Make a copy of the formData to prepare for submission
      const submissionData = { ...formData };

      // Format and add country code to phone number
      if (submissionData.phone) {
        // Remove any existing "+" signs or spaces from the phone number
        let cleanPhone = submissionData.phone.replace(/\+|\s/g, "");

        // Remove leading zeros
        cleanPhone = cleanPhone.replace(/^0+/, "");

        // Ensure we only use the last 10 digits of the phone number if it's longer
        if (cleanPhone.length > 10) {
          cleanPhone = cleanPhone.slice(-10);
        }

        // Add the country code
        submissionData.phone = countryCode + cleanPhone;
      }

      // If there's a photo file to be uploaded, create FormData
      if (formData.photo instanceof File) {
        const formDataToSend = new FormData();

        // Append all form fields to FormData
        Object.keys(submissionData).forEach((key) => {
          if (key === "photo") {
            formDataToSend.append(key, formData.photo);
          } else {
            formDataToSend.append(key, submissionData[key]);
          }
        });

        const response = await axios.put(`https://crp.mydevfactory.com/api/users/staffs/${selectedStaffId}/`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success("Staff updated successfully!");
          setIsEditModalOpen(false);
          fetchStaffs();
        }
      } else {
        // Otherwise use regular JSON submission
        const response = await axios.put(`https://crp.mydevfactory.com/api/users/staffs/${selectedStaffId}/`, submissionData, {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          toast.success("Staff updated successfully!");
          setIsEditModalOpen(false);
          fetchStaffs();
        }
      }
    } catch (error) {
      console.error("Error updating staff:", error);

      // Show appropriate error message based on the response
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else if (error.response.status === 401) {
          toast.error("Authentication error. Please login again.");
        } else if (error.response.status === 400) {
          toast.error("Invalid data submitted. Please check your inputs.");
        } else {
          toast.error(`Error ${error.response.status}: ${error.response.statusText}`);
        }
      } else if (error.request) {
        toast.error("No response received from server. Please check your connection.");
      } else {
        toast.error("Error updating staff. Please try again.");
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeactivateClick = (staffId) => {
    setSelectedStaffId(staffId);
    setShowOptionsModal(false);
    setIsDeactivateModalOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    try {
      setDeleteLoading(true);
      const response = await axios.delete(`https://crp.mydevfactory.com/api/users/staffs/${selectedStaffId}/`, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });

      // Close modal first
      setIsDeactivateModalOpen(false);

      // Show success toast
      toast.success("Staff deactivated successfully!");

      // Refresh staff list
      fetchStaffs();
    } catch (error) {
      console.error("Error deactivating staff:", error);
      toast.error(error.response?.data?.message || "Error deactivating staff");
    } finally {
      setDeleteLoading(false);
    }
  };

  //----------------------------------

  const handleSortApply = (sortOrder = "asc") => {
    // Start with all staff or current filtered list if search is active
    let sorted = searchTerm ? [...filteredStaffs] : [...staffs];

    // Filter by designation and department if specified
    if (designation || department) {
      sorted = sorted.filter((staff) => {
        // Check designation filter
        const matchesDesignation = !designation || (staff.designation && staff.designation.toLowerCase() === designation.toLowerCase());

        // Check department filter
        const matchesDepartment = !department || (staff.department && staff.department.toString() === department.toString());

        // Return true only if both conditions are met
        return matchesDesignation && matchesDepartment;
      });
    }

    // Sort the filtered results
    if (department) {
      // Sort by department name
      sorted.sort((a, b) => {
        const deptA = departments.find((d) => d.id.toString() === a.department?.toString())?.name || "";
        const deptB = departments.find((d) => d.id.toString() === b.department?.toString())?.name || "";

        if (sortOrder === "asc") {
          return deptA.localeCompare(deptB);
        } else {
          return deptB.localeCompare(deptA);
        }
      });
    } else if (designation) {
      // Sort by designation
      sorted.sort((a, b) => {
        const desA = a.designation || "";
        const desB = b.designation || "";

        if (sortOrder === "asc") {
          return desA.localeCompare(desB);
        } else {
          return desB.localeCompare(desA);
        }
      });
    } else {
      // Sort by name as default
      sorted.sort((a, b) => {
        const nameA = a.name || "";
        const nameB = b.name || "";

        if (sortOrder === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }

    // Update the filtered staff list with our sorted results
    setFilteredStaffs(sorted);

    // Show success message with the count of displayed staff
    toast.success(`Sorted ${sorted.length} staff members`, {
      position: "top-right",
      autoClose: 2000,
    });

    // Close the modal
    setIsSortModalOpen(false);
  };

  const handleFilterApply = () => {
    // Add filter logic here
    setIsFilterModalOpen(false);
  };
  const toggleCheckbox = (type, value) => {
    if (type === "location") {
      setSelectedLocation((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    } else if (type === "department") {
      setSelectedDepartment((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    }
  };

  return (
    <Layout title="Manage Staff">
      <div className="px-8 pb-7 bg-[#171717] rounded-lg mt-5">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-2 py-4 ">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-[300px]">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-[20vw] border-2 border-[#BBA14F] rounded-lg bg-transparent text-white focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter and Sort By */}
            <button className="flex items-center text-white rounded-md" onClick={() => setIsSortModalOpen(true)}>
              <img src={shortbyIcon} alt="Sort By" className="w-10 h-10" />
            </button>
            <button className="flex items-center text-white rounded-md" onClick={() => setIsFilterModalOpen(true)}>
              <img src={filterIcon} alt="Filter" className="w-10 h-10" />
            </button>
          </div>

          {/* Add Staff Button */}
          <button
            className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105"
            onClick={() => setIsAddStaffModalOpen(true)}
          >
            Add Staff
          </button>
        </div>

        {/* Staff Table */}
        <div className="border border-[#202020] rounded-lg overflow-x-auto max-h-[calc(100vh-39vh)] overflow-auto scrollbar-hide">
          <table className="w-full bg-[#171717] rounded-lg">
            <thead>
              <tr className="text-left text-[#818181] border-b border-gray-700 sticky top-0 bg-black">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Contact Information</th>
                <th className="py-3 px-4">Site(Location)</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-white">
                    Loading...
                  </td>
                </tr>
              ) : filteredStaffs && filteredStaffs.length > 0 ? (
                filteredStaffs.map((staff, index) => (
                  <tr key={index} className="border-t border-gray-700 hover:bg-gray-800 text-white">
                    {/* Name and Role */}
                    <td className="py-4 px-4 flex items-center gap-3">
                      <img src={staff.photo ? `https://crp.mydevfactory.com/${staff.photo}` : profileImg} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold">{staff.name}</p>
                        <p className="text-gray-400 text-sm">{staff.designation}</p>
                      </div>
                    </td>
                    {/* Department */}
                    <td className="py-4 px-4">{staff.department_name}</td>
                    {/* Contact Information */}
                    <td className="py-4 px-4">
                      <p>{staff.phone}</p>
                      <p className="text-gray-400">{staff.email}</p>
                    </td>
                    {/* Location */}
                    <td className="py-4 px-4">{staff.site}</td>
                    {/* Actions */}
                    <td className="py-4 px-4 flex items-center gap-3">
                      <button className="hover:text-yellow-400" onClick={() => navigate(`/profile-details/${staff.id}`)}>
                        <img src={viewIcon} alt="View" className="h-5" />
                      </button>

                      <div className="h-6 w-[1px] bg-gray-600"></div>
                      <button className="hover:text-yellow-400" onClick={(e) => handleOptionsClick(e, staff.id)}>
                        <img src={optionIcon} alt="Options" className="h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-white">
                    {searchTerm ? "No matching staff found" : "No staff data available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Options Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#171717] bg-opacity-70">
          <div
            className="fixed bg-white rounded-lg rounded-tr-none shadow-lg py-2 w-40"
            style={{
              top: optionsModalPosition.y,
              left: optionsModalPosition.x,
              zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => handleEditClick(selectedStaffId)}>
              Edit Profile
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => handleDeactivateClick(selectedStaffId)}>
              Deactivate Profile
            </button>
          </div>
        </div>
      )}

      {/* Sort Modal */}
      <SortModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        departments={departments}
        designation={designation}
        setDesignation={setDesignation}
        department={department}
        setDepartment={setDepartment}
        handleSortApply={handleSortApply}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedLocation={selectedLocation}
        selectedDepartment={selectedDepartment}
        toggleCheckbox={toggleCheckbox}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        handleFilterApply={handleFilterApply}
      />

      {/* Add Staff Modal */}
      <AddStaffModal isOpen={isAddStaffModalOpen} onClose={() => setIsAddStaffModalOpen(false)} fetchStaffs={fetchStaffs} departments={departments} tokens={tokens} />

      {/* Edit Staff Modal */}
      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        fetchStaffs={fetchStaffs}
        departments={departments}
        tokens={tokens}
        selectedStaff={selectedStaff}
        selectedStaffId={selectedStaffId}
      />

      {/* Deactivate Confirmation Modal */}
      <DeactivateModal isOpen={isDeactivateModalOpen} onClose={() => setIsDeactivateModalOpen(false)} fetchStaffs={fetchStaffs} tokens={tokens} selectedStaffId={selectedStaffId} />
    </Layout>
  );
};

export default ManageStaff;
