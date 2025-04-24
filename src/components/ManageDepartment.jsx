import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
// import { Link } from "react-router-dom";

import editicon from "../assets/Images/manageDeptImg/editicon.png";
import deleteicon from "../assets/Images/manageDeptImg/deleteicon.png";
import viewdepticon from "../assets/Images/manageDeptImg/viewdepticon.png";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ManageDepartment = () => {
  const navigate = useNavigate();
  const users = useSelector((state) => state.user);
  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (!tokens) {
    navigate("/");
  }
  tokens = tokens.replace(/"/g, "");
  console.log(`testing ${tokens}`);
  console.log(users);

  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [depDes, setDepDes] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    depDes: false
  });

  const API_URL = "https://crp.mydevfactory.com/api/users/departments/";

  console.log("responseMessage", responseMessage);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error);
    }
    setLoading(false);
  }, [tokens]);

  // Fetch department data from API
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Submit new department
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let hasErrors = false;
    const newErrors = {
      name: false,
      depDes: false
    };

    if (!name.trim()) {
      newErrors.name = true;
      hasErrors = true;
      toast.error("Department name is required!", {
        position: "top-right",
        autoClose: 3000
      });
    }

    if (!depDes.trim()) {
      newErrors.depDes = true;
      hasErrors = true;
      toast.error("Department description is required!", {
        position: "top-right",
        autoClose: 3000
      });
    }

    setErrors(newErrors);

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    const data = { name, dep_des: depDes };

    try {
      await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });

      setResponseMessage("Department created successfully!");
      toast.success("Department created successfully!", {
        position: "top-right",
        autoClose: 3000
      });
      setIsModalOpen(false);
      setName("");
      setDepDes("");
      setErrors({
        name: false,
        depDes: false
      });
      fetchDepartments(); // Refresh data
    } catch (error) {
      console.error(error);
      setResponseMessage("Error submitting data.");
      toast.error("Error creating department. Please try again.", {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log(tokens);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const editHandler = async () => {
    let hasErrors = false;
    const newErrors = {
      name: false,
      depDes: false
    };

    if (!selectedDepartment?.name?.trim()) {
      newErrors.name = true;
      hasErrors = true;
      toast.error("Department name is required!", {
        position: "top-right",
        autoClose: 3000
      });
    }

    if (!selectedDepartment?.dep_des?.trim()) {
      newErrors.depDes = true;
      hasErrors = true;
      toast.error("Department description is required!", {
        position: "top-right",
        autoClose: 3000
      });
    }

    setErrors(newErrors);

    if (hasErrors) {
      return;
    }

    setIsUpdating(true);
    try {
      if (selectedDepartment?.id) {
        await axios.put(API_URL + selectedDepartment?.id + "/", selectedDepartment, {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "application/json",
          },
        });
        setIsEditModalOpen(false);
        toast.success("Department updated successfully!", {
          position: "top-right",
          autoClose: 3000
        });
        fetchDepartments();
      }
    } catch (error) {
      console.error(error.message);
      setResponseMessage("Error submitting data.");
      toast.error("Error updating department. Please try again.", {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteHandler = async () => {
    setIsDeleting(true);
    console.log("tokens", tokens);
    try {
      if (selectedDepartment?.id) {
        await axios.delete(API_URL + selectedDepartment?.id + "/", {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "application/json",
          },
        });
        setIsDeleteModalOpen(false);
        toast.success("Department deleted successfully!", {
          position: "top-right",
          autoClose: 3000
        });
        fetchDepartments();
      }
    } catch (error) {
      console.error(error.message);
      setResponseMessage("Error submitting data.");
      toast.error("Error deleting department. Please try again.", {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout title="Manage Department">
      <div className="px-8 pb-7 bg-[#171717] rounded-lg mt-5">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[#FCF0E8]">List of Added Departments</h3>
          <button
            className="flex items-center space-x-2 bg-[#BBA14F] hover:bg-yellow-600 text-[#FCF0E8] px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
           
            <span>Add New Department</span>
          </button>
        </div>

        {loading ? (
          <p className="text-center text-yellow-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto max-h-[calc(100vh-37vh)] overflow-auto scrollbar-hide">
            <table className="w-full text-white border border-[#202020]">
              <thead className="bg-black text-[#818181] sticky top-0">
                <tr>
                  <th className="py-3 px-5 border border-[#202020] text-left">Department Name</th>
                  {/* <th className="py-3 px-5 border border-[#202020] text-left">Description</th> */}
                  <th className="py-3 px-5 border border-[#202020] text-left">Number of Staff</th>
                  <th className="py-3 px-5 border border-[#202020] text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-800 transition duration-300">
                    <td className="py-3 px-5 border border-[#202020]">{dept.name}</td>
                    {/* <td className="py-3 px-5 border border-[#202020]">{dept.dep_des}</td> */}
                    <td className="py-3 px-5 border border-[#202020]">0</td>
                    <td className="py-3 px-5 border border-[#202020] flex justify-center space-x-4">
                      <button
                        className="hover:scale-125 transition duration-300"
                        onClick={() => {
                          setSelectedDepartment(dept);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <img src={editicon} alt="Edit" className="w-6 h-6" />
                      </button>
                      <div className="h-6 w-[1px] bg-gray-600"></div>
                      <button
                        className="hover:scale-125 transition duration-300"
                        onClick={() => {
                          setSelectedDepartment(dept);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <img src={deleteicon} alt="Delete" className="w-6 h-6" />
                      </button>
                      <div className="h-6 w-[1px] bg-gray-600"></div>
                      <button
                        className="hover:scale-125 transition duration-300"
                        onClick={() => {
                          setSelectedDepartment(dept);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <img src={viewdepticon} alt="View" className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg w-1/3 relative ">
            <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
            <button className="hover:text-black text-white absolute right-1 top-0" onClick={() => setIsModalOpen(false)}>
              ✕
            </button>

            <h2 className="text-lg font-bold text-center">Create A New Department</h2>
            <p className="text-center text-sm text-gray-500">Enter details to create a new department.</p>
            <form onSubmit={handleSubmit} >
              <div className="mt-4 ">
                <label className="block text-sm font-semibold">Department Name</label>
                <input 
                  type="text" 
                  className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter Department Name" 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors({...errors, name: false});
                  }} 
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold">Description</label>
                <textarea 
                  className={`w-full h-[100px] p-2 border rounded-md ${errors.depDes ? 'border-red-500' : ''}`}
                  placeholder="Enter Description" 
                  value={depDes}
                  onChange={(e) => {
                    setDepDes(e.target.value);
                    setErrors({...errors, depDes: false});
                  }}
                ></textarea>
              </div>

              <button 
                type="submit" 
              
                className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Save Department'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {isEditModalOpen && selectedDepartment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg w-1/3 relative">
            <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
            <button className="hover:text-black text-white absolute right-1 top-0" onClick={() => {
              setIsEditModalOpen(false);
              setSelectedDepartment(null);
            }}>
              ✕
            </button>

            <h2 className="text-lg font-bold text-center">Edit Department</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              editHandler();
            }}>
              <div className="mt-4">
                <label className="block text-sm font-semibold">Department Name</label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
                  value={selectedDepartment.name}
                  onChange={(e) => {
                    setSelectedDepartment({ ...selectedDepartment, name: e.target.value });
                    setErrors({...errors, name: false});
                  }}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold">Description</label>
                <textarea
                  className={`w-full h-[100px] p-2 border rounded-md ${errors.depDes ? 'border-red-500' : ''}`}
                  value={selectedDepartment.dep_des}
                  onChange={(e) => {
                    setSelectedDepartment({ ...selectedDepartment, dep_des: e.target.value });
                    setErrors({...errors, depDes: false});
                  }}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Department'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Department Modal */}
      {isDeleteModalOpen && selectedDepartment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg w-1/3 relative">
            <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
            <button className="hover:text-black text-white absolute right-1 top-0" onClick={() => setIsDeleteModalOpen(false)}>
              ✕
            </button>

            <h2 className="text-lg font-bold text-center">Delete Department</h2>
            <div className="mt-4">
              <p className="text-sm text-center">
                Are you sure you want to delete the department "{selectedDepartment.name}"? This action cannot be undone.
              </p>
              
              <button 
                className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
                onClick={deleteHandler}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Department'}
              </button>

              <button 
                className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

     
     {/* View Department Modal */}
{/* View Department Modal */}
{isViewModalOpen && selectedDepartment && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white text-black p-6 rounded-lg w-2/3 relative">
     

      <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
            <button className="hover:text-black text-white absolute right-1 top-0" onClick={() => setIsViewModalOpen(false)}>
              ✕
            </button>

      {/* Header */}
      <h2 className="text-xl font-bold text-center">Team List of Department</h2>
      <p className="text-center text-gray-500">{selectedDepartment.name}</p>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Staff Name</th>
              <th className="px-4 py-2 text-left">Designation</th>
              <th className="px-4 py-2 text-left">Contact Information</th>
              <th className="px-4 py-2 text-left">Assigned Tasks</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2 flex items-center">
                <img
                  src="/path-to-avatar.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                Dr. Johnson
              </td>
              <td className="px-4 py-2">Sr. Lab Assistant</td>
              <td className="px-4 py-2">
                <p>+1 3625867592</p>
                <p className="text-sm text-gray-500">john.doe@nakya.com</p>
              </td>
              <td className="px-4 py-2">Figuring out cell expansion.</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 flex items-center">
                <img
                  src="/path-to-avatar.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                Dr. Smith
              </td>
              <td className="px-4 py-2">Sr. Lab Assistant</td>
              <td className="px-4 py-2">
                <p>+1 3625867592</p>
                <p className="text-sm text-gray-500">john.doe@nakya.com</p>
              </td>
              <td className="px-4 py-2">Figuring out cell expansion.</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 flex items-center">
                <img
                  src="/path-to-avatar.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                Dr. Williams
              </td>
              <td className="px-4 py-2">Sr. Lab Assistant</td>
              <td className="px-4 py-2">
                <p>+1 3625867592</p>
                <p className="text-sm text-gray-500">john.doe@nakya.com</p>
              </td>
              <td className="px-4 py-2">Figuring out cell expansion.</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 flex items-center">
                <img
                  src="/path-to-avatar.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                Dr. Jones
              </td>
              <td className="px-4 py-2">Lab Assistant</td>
              <td className="px-4 py-2">
                <p>+1 3625867592</p>
                <p className="text-sm text-gray-500">john.doe@nakya.com</p>
              </td>
              <td className="px-4 py-2">Figuring out cell expansion.</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 flex items-center">
                <img
                  src="/path-to-avatar.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                Dr. Brown
              </td>
              <td className="px-4 py-2">Lab Assistant</td>
              <td className="px-4 py-2">
                <p>+1 3625867592</p>
                <p className="text-sm text-gray-500">john.doe@nakya.com</p>
              </td>
              <td className="px-4 py-2">Figuring out cell expansion.</td>
            </tr>
          </tbody>
        </table>
      </div>


    </div>
  </div>
)}


    </Layout>
  );
};

export default ManageDepartment;
