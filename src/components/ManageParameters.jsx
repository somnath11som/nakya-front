import { useState, useEffect, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import deleteicon from "../assets/Images/manageDeptImg/deleteicon.png";
import editicon from "../assets/Images/manageDeptImg/editicon.png";
import viewicon from "../assets/Images/manageInstru/viewicon.png";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

const ManageParameters = () => {
  const navigate = useNavigate();
  const users = useSelector((state) => state.user);
  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (!tokens) {
    navigate("/");
  }
  tokens = tokens.replace(/"/g, "");
  //console.log(testing ${tokens});
  console.log(users);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [name, setName] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const cleanState = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedParameter(null);
  };

  const API_URL1 = "https://crp.mydevfactory.com/api/users/parameters/";

  // Fetch department data from API
  useEffect(() => {
    fetchParameters();
  }, []);

  // const fetchParameters = useCallback(async () => {
  //   console.log("Token Before API call", tokens);
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(API_URL1, {
  //       headers: {
  //         Authorization: Bearer ${tokens},
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     console.log("API Response:", response.data);

  //     setParameters(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error.response ? error.response.data : error);
  //   }
  //   setLoading(false);
  // }, [tokens]);

  const fetchParameters = useCallback(async () => {
    console.log("Token Before API call", tokens);
    setLoading(true); // Start loading
    try {
      const response = await axios.get(API_URL1, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response:", response.data);

      // Log parameters with is_masterdata flag
      if (Array.isArray(response.data)) {
        console.log(
          "Parameters with is_masterdata:",
          response.data.filter((param) => param.is_masterdata)
        );
      }

      setParameters(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [tokens]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await axios.post(
        API_URL1,
        { name: name, value: "", parent: null },
        {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResponseMessage("Parameter created successfully!");
      toast.success("Parameter created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsModalOpen(false);
      fetchParameters(); // Refresh data
    } catch (error) {
      console.log(error);
      setResponseMessage("Error submitting data.", error.message);
      toast.error("Error creating parameter. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const EditHandler = async (e) => {
    e.preventDefault();

    // Check if the parameter is master data
    if (selectedParameter.is_masterdata) {
      toast.error("Cannot edit master data parameters", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsEditModalOpen(false);
      return;
    }

    setEditLoading(true);
    try {
      await axios.put(API_URL1 + selectedParameter?.id + "/", selectedParameter, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Parameter updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsEditModalOpen(false);
      fetchParameters();
    } catch (error) {
      console.error(error);
      setResponseMessage("Error submitting data.");
      toast.error(error.response.data.error, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setEditLoading(false);
    }
  };

  const deleteHandler = async () => {
    // Check if the parameter is master data
    if (selectedParameter.is_masterdata) {
      toast.error("Cannot delete master data parameters", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsDeleteModalOpen(false);
      return;
    }

    setDeleteLoading(true);
    try {
      if (selectedParameter?.id) {
        await axios.delete(API_URL1 + selectedParameter?.id + "/", {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Parameter deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsDeleteModalOpen(false);
        fetchParameters();
      }
    } catch (error) {
      console.error(error.message);
      setResponseMessage("Error submitting data.");
      toast.error(error.response.data.error, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  console.log("selected parameters", selectedParameter);
  return (
    <Layout title="Manage Parameters ">
      <div className="px-8 pb-7 bg-[#292929] rounded-lg">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Parameter List</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-[#BBA14F] hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
          >
            <span>Add New Parameter</span>
          </button>
        </div>

        {/* Table */}
        <div className="border border-[#202020] rounded-lg overflow-x-auto max-h-[calc(100vh-36vh)] overflow-auto scrollbar-hide">
          <table className="w-full bg-[#292929] rounded-lg">
            <thead>
              <tr className="text-left text-[#818181] border-b border-gray-700 sticky top-0 bg-black z-20">
                <th className="p-4 px-8">Name</th>
                <th className="p-4 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-400">
                    Loading parameters...
                  </td>
                </tr>
              ) : (
                parameters.map((param) => (
                  <tr key={param.id} className="border-b border-gray-700 hover:bg-[#1e1e1e] transition">
                    <td
                      className="p-4 px-8 "
                      onClick={() => {
                        navigate(`/parameters-level-two/${param.id}`, { state: { parameter: param } });
                      }}
                    >
                      {param.name}
                    </td>
                    <td className="p-4 px-8 text-right flex justify-end items-center">
                      <div className="flex items-center space-x-6">
                        <img
                          src={viewicon}
                          alt="View"
                          className="w-6 cursor-pointer hover:opacity-80 hover:scale-110 transition"
                          onClick={() => {
                            navigate(`/parameters-level-two/${param.id}`, { state: { parameter: param } });
                          }}
                        />
                        <div className="h-6 w-[1px] bg-gray-600"></div>
                        {!param.is_masterdata ? (
                          <>
                            <img
                              src={editicon}
                              alt="Edit"
                              className="w-6 h-6 cursor-pointer hover:opacity-80 hover:scale-110 transition"
                              onClick={() => {
                                setSelectedParameter(param);
                                setIsEditModalOpen(true);
                              }}
                            />
                            <div className="h-6 w-[1px] bg-gray-600"></div>
                            <img
                              src={deleteicon}
                              alt="Delete"
                              className="w-6 h-6 cursor-pointer hover:opacity-80 hover:scale-110 transition"
                              onClick={() => {
                                setSelectedParameter(param);
                                setIsDeleteModalOpen(true);
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <div className="relative group">
                              <img src={editicon} alt="Edit" className="w-6 h-6 cursor-not-allowed" />
                              <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded p-2 w-40 right-10 -top-2 z-10 text-center">
                                Predefined data can't be edited
                              </div>
                            </div>
                            <div className="h-6 w-[1px] bg-gray-600"></div>
                            <div className="relative group">
                              <img src={deleteicon} alt="Delete" className="w-6 h-6 cursor-not-allowed" />
                              <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded p-2 w-40 right-7 -top-2 z-10 text-center">
                                Predefined data can't be deleted
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Parameter Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
              <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
              <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>

              <h3 className="text-center text-xl font-bold mb-6 text-black">Add New Parameter</h3>
              <form onSubmit={handleSubmit}>
                <label className="text-gray-600 text-sm block mb-1">Parameter Name</label>
                <input
                  type="text"
                  placeholder="Enter Parameter Name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none w-full mb-4"
                  style={{ color: "#000" }}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    disabled={saveLoading}
                    className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
                  >
                    {saveLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Parameter Modal */}
        {isEditModalOpen && selectedParameter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
              <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
              <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={cleanState}>
                ✕
              </button>

              <h3 className="text-center text-xl font-bold mb-6 text-black">Edit Parameter</h3>
              <form onSubmit={EditHandler}>
                <label className="text-gray-600 text-sm block mb-1">Parameter Name</label>
                <input
                  style={{ color: "#000" }}
                  type="text"
                  name="name"
                  placeholder="Enter Parameter Name"
                  value={selectedParameter?.name}
                  onChange={(e) =>
                    setSelectedParameter({
                      ...selectedParameter,
                      name: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none w-full mb-4"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    disabled={editLoading}
                    className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
                  >
                    {editLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Parameter Modal */}
        {isDeleteModalOpen && selectedParameter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
              <span className="absolute top-0 right-0 bg-[#BBA14F] p-3.5 rounded-bl-3xl"></span>
              <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={cleanState}>
                ✕
              </button>

              <h3 className="text-center text-xl font-bold mb-6 text-black">Delete Parameter</h3>
              <p className="text-gray-600 mb-4">Are you sure you want to delete "{selectedParameter.name}"?</p>
              <div className="flex justify-end space-x-4">
                <button
                  disabled={deleteLoading}
                  className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
                  onClick={deleteHandler}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Parameter Modal */}
        {isViewModalOpen && selectedParameter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
              <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
              <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={() => setIsViewModalOpen(false)}>
                ✕
              </button>

              <h3 className="text-center text-xl font-bold mb-6 text-black">Parameter Details</h3>
              <div className="mb-4">
                <label className="text-gray-600 text-sm block mb-1">Parameter Name</label>
                <p className="text-black font-medium">{selectedParameter.name}</p>
              </div>
              <div className="flex justify-end">
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageParameters;
