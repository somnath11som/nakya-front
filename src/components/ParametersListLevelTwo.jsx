import { useState, useEffect, useCallback } from "react";
import Layout from "./Layout";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

import backIcon from "../assets/Images/manageInstru/backIcon.png";
import editicon from "../assets/Images/manageDeptImg/editicon.png";
import deleteicon from "../assets/Images/manageDeptImg/deleteicon.png";
import plusIcon from "../assets/Images/ManagePara/plusIcon.png";

const ParametersListLevelTwo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramIdFromUrl } = useParams(); // Extract ID from URL parameters

  // Use URL parameter ID as primary source, fallback to location state if needed
  const parentId = paramIdFromUrl || location.state?.parameter?.id;
  // const parameterName = location.state?.parameter?.name || "Parameter";
  // Get authentication token from Redux or localStorage
  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (!tokens) {
    navigate("/");
  }
  tokens = tokens.replace(/"/g, "");

  const [loading, setLoading] = useState(true);
  const [parameters, setParameters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newParameterName, setNewParameterName] = useState("");
  const [pendingParameters, setPendingParameters] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [parentParameter, setParentParameter] = useState(location.state?.parameter);

  const API_URL = "https://crp.mydevfactory.com/api/users/parameters/";
  //const API_URL2 = "https://crp.mydevfactory.com/api/users/parameters/";

  // Fetch parent parameter details if not available in location state
  useEffect(() => {
    const fetchParentParameter = async () => {
      if (!parentParameter && parentId) {
        try {
          const response = await axios.get(`${API_URL}${parentId}/`, {
            headers: {
              Authorization: `Bearer ${tokens}`,
              "Content-Type": "application/json",
            },
          });
          setParentParameter(response.data);
        } catch (error) {
          console.error("Error fetching parent parameter:", error);
        }
      }
    };

    fetchParentParameter();
  }, [parentId, parentParameter, tokens]);

  // Fetch second-level parameters based on parent parameter ID
  const fetchParameters = useCallback(async () => {
    if (!parentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching parameters for parent ID:", parentId);

      // API call to get all parameters
      const response = await axios.get(`${API_URL}${parentId}/children/`, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data);

      // Get all parameters data
      let allParameters = [];

      if (Array.isArray(response.data)) {
        allParameters = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        allParameters = response.data.data;
      }

      // Log all parameters to debug what's available
      console.log(
        "All parameters before filtering:",
        allParameters.map((p) => ({ id: p.id, name: p.name, parentId: p.parent || p.parent_id, is_masterdata: p.is_masterdata }))
      );

      // Filter to show only parameters with this parent's ID
      const childParameters = allParameters.filter((param) => {
        // Try different possible parent ID field names
        const paramParentId = param.parentId || param.parent;

        // Check for both string and number equality
        return paramParentId == parentId; // Use loose equality to handle type differences
      });

      console.log(`Found ${childParameters.length} child parameters for parent ID: ${parentId}`);
      console.log(
        "Parameters with is_masterdata:",
        childParameters.filter((p) => p.is_masterdata)
      );
      setParameters(childParameters);
    } catch (error) {
      console.error("Error fetching second-level parameters:", error.response ? error.response.data : error);
      toast.error("Error loading parameters. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [parentId, tokens]);

  // Load parameters when component mounts or parent ID changes
  useEffect(() => {
    if (parentId) {
      console.log("Parent ID from URL:", parentId);
      fetchParameters();
    }
  }, [fetchParameters, parentId]);

  // New function to add a parameter to the pending list
  const addToPendingList = () => {
    if (!newParameterName.trim()) {
      toast.error("Parameter name cannot be empty", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Add to pending parameters list
    setPendingParameters([...pendingParameters, { name: newParameterName, id: Date.now() }]);
    setNewParameterName(""); // Clear input field after adding
  };

  // New function to remove a parameter from the pending list
  const removeFromPendingList = (id) => {
    setPendingParameters(pendingParameters.filter((param) => param.id !== id));
  };

  // Updated handleSubmit to save multiple parameters
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add current input value to pending list if not empty
    if (newParameterName.trim()) {
      setPendingParameters([...pendingParameters, { name: newParameterName, id: Date.now() }]);
      setNewParameterName(""); // Clear input field after adding
    }

    if (pendingParameters.length === 0 && !newParameterName.trim()) {
      toast.error("Please add at least one parameter", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setSaveLoading(true);

    try {
      // Ensure parentId is not undefined
      if (!parentId) {
        throw new Error("Parent parameter ID is missing");
      }

      // Create a new array with all parameters to save
      const parametersToSave = [...pendingParameters];

      // If there's text in the input, add it to the parameters to save
      if (newParameterName.trim()) {
        parametersToSave.push({ name: newParameterName, id: Date.now() });
      }

      console.log(`Creating ${parametersToSave.length} new parameters with parent ID:`, parentId);

      // Array to hold all successfully created parameters
      const createdParameters = [];

      // Create all parameters in sequence
      for (const param of parametersToSave) {
        const paramData = {
          name: param.name,
          value: "",
          parent: parentId,
        };

        console.log("Sending parameter data:", paramData);

        const response = await axios.post(API_URL, paramData, {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Create parameter response:", response.data);

        if (response.data && response.data.id) {
          createdParameters.push({
            ...response.data,
            parent: parentId,
          });
        }
      }

      // Update the parameters list with all created parameters
      setParameters((prev) => [...prev, ...createdParameters]);

      toast.success(`${createdParameters.length} parameters created successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });

      // Clear the pending parameters list and input field
      setPendingParameters([]);
      setNewParameterName("");
      setIsModalOpen(false);

      // Force refresh data after a short delay to allow API to update
      setTimeout(() => {
        fetchParameters();
      }, 500);
    } catch (error) {
      console.error("Error creating parameters:", error.response ? error.response.data : error);
      toast.error(error.response.data.error, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!selectedParameter?.name.trim()) {
      toast.error("Parameter name cannot be empty", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

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
      console.log("Updating parameter:", selectedParameter.id);

      // Update the selected parameter but keep parentId the same
      const updateData = {
        ...selectedParameter,
        name: selectedParameter.name,
        parent: parentId, // Use the raw parentId from URL
      };

      console.log("Sending update data:", updateData);

      const response = await axios.put(API_URL + selectedParameter.id + "/", updateData, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Update parameter response:", response.data);

      toast.success("Parameter updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setIsEditModalOpen(false);
      setSelectedParameter(null);
      fetchParameters(); // Refresh data
    } catch (error) {
      console.error("Error updating parameter:", error.response ? error.response.data : error);
      toast.error(error.response.data.error, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

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
      console.log("Deleting parameter:", selectedParameter.id);

      // Delete the selected parameter
      const response = await axios.delete(API_URL + selectedParameter.id + "/", {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Delete parameter response:", response.data);

      toast.success("Parameter deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setIsDeleteModalOpen(false);
      setSelectedParameter(null);
      fetchParameters(); // Refresh data
    } catch (error) {
      console.error("Error deleting parameter:", error.response ? error.response.data : error);
      toast.error(error.response.data.error, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!parentId) {
    return <div>No parameter ID found in URL or state</div>;
  }

  return (
    <Layout
      title={
        <div className="flex items-center gap-2">
          <div className="border border-[#BBA14F] rounded-full p-3 cursor-pointer" onClick={() => navigate(-1)}>
            <img src={backIcon} alt="Back" className="h-3 w-3" />
          </div>
          <span>{parentParameter?.name || `Parameter ${parentId}`}</span>
        </div>
      }
    >
      <div className="px-8 pb-7 bg-[#292929]  rounded-lg">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">{parentParameter?.name || `Parameter ${parentId}`}</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-[#BBA14F] hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
          >
            <span>Add {parentParameter?.name || `Parameter ${parentId}`}</span>
          </button>
        </div>

        {/* add modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[450px] relative">
              {/* Close Button */}
              <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
              <button
                className="hover:text-black text-white absolute right-1 top-0 z-10"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                ✕
              </button>

              {/* Title */}
              <h3 className="text-center text-xl font-bold mb-6 text-black">Create {parentParameter?.name || `Parameter ${parentId}`}</h3>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Input and Add Button */}
                <label className="text-gray-600 text-sm block mb-1">{parentParameter?.name || `Parameter ${parentId}`} name</label>

                <div className="flex items-center gap-2 mb-4 justify-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={`Enter ${parentParameter?.name || `Parameter ${parentId}`} Name`}
                      value={newParameterName}
                      onChange={(e) => setNewParameterName(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none w-full text-black"
                    />
                  </div>
                  <div className=" ">
                    <button type="button" onClick={addToPendingList} className="border border-[#b89e5a]  hover:text-white rounded-lg p-2 flex items-end justify-center">
                      <img src={plusIcon} alt="" />
                    </button>
                  </div>
                </div>

                {/* List of Pending Parameters */}
                {pendingParameters.length > 0 && (
                  <div className="mb-4">
                    {pendingParameters.map((param) => (
                      <div key={param.id} className="flex justify-between items-center bg-[#E6E6E6] rounded-lg py-2 px-3 mb-2 w-5/6">
                        <span className="text-black ">{param.name}</span>
                        <button type="button" onClick={() => removeFromPendingList(param.id)} className="text-[#BBA14F] hover:text-yellow-600">
                          <FaTrash size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-8"
                >
                  {saveLoading ? "Saving..." : "Save"}
                </button>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
              <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
              <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={() => setIsEditModalOpen(false)}>
                ✕
              </button>

              <h3 className="text-center text-xl font-bold mb-6 text-black">Edit {parentParameter?.name || `Parameter ${parentId}`}</h3>
              <form onSubmit={handleEdit}>
                <label className="text-gray-600 text-sm block mb-1">Edit {parentParameter?.name || `Parameter ${parentId}`}</label>
                <input
                  type="text"
                  placeholder={`Edit ${parentParameter?.name || `Parameter ${parentId}`}`}
                  value={selectedParameter?.name || ""}
                  onChange={(e) => setSelectedParameter({ ...selectedParameter, name: e.target.value })}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none w-full mb-4"
                  style={{ color: "#000" }}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
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

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
              <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
              <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={() => setIsDeleteModalOpen(false)}>
                ✕
              </button>

              <h3 className="text-center text-xl font-bold mb-6 text-black">Delete {parentParameter?.name || `Parameter ${parentId}`}</h3>
              <p className="text-gray-600 mb-6 text-center">
                Are you sure you want to delete {parentParameter?.name || `Parameter ${parentId}`} &quot;{selectedParameter?.name}&quot;?
              </p>
              <form onSubmit={handleDelete}>
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    disabled={deleteLoading}
                    className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="border border-[#202020]  rounded-lg overflow-x-auto scrollbar-hide">
          <table className="w-full bg-[#292929]   rounded-lg">
            <thead>
              <tr className="text-left text-[#818181] border-b border-gray-700 sticky top-0 bg-black z-20 ">
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
              ) : parameters.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-400">
                    No parameters found. Add a new one to get started.
                  </td>
                </tr>
              ) : (
                parameters.map((param) => (
                  <tr key={param.id} className="border-b border-gray-700 hover:bg-[#1e1e1e] transition">
                    <td className="p-4 px-8">{param.name}</td>
                    <td className="p-4 px-8 text-right flex justify-end items-center">
                      <div className="flex items-center space-x-6">
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
                            <div className="relative group ">
                              <img src={editicon} alt="Edit" className="w-6 h-6  cursor-not-allowed" />
                              <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded p-2 w-40 right-10 -top-2 z-10 text-center">
                                Predefined data can&apos;t be edited
                              </div>
                            </div>
                            <div className="h-6 w-[1px] bg-gray-600"></div>
                            <div className="relative group">
                              <img src={deleteicon} alt="Delete" className="w-6 h-6  cursor-not-allowed" />
                              <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded p-2 w-40 right-7 -top-2 z-10 text-center">
                                Predefined data can&apos;t be deleted
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
      </div>
    </Layout>
  );
};

export default ParametersListLevelTwo;
