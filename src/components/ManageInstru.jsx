import { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

// Actions icons
import editicon from "../assets/Images/manageInstru/editicon.png";
import viewicon from "../assets/Images/manageInstru/viewicon.png";
import deleteicon from "../assets/Images/manageDeptImg/deleteicon.png";

// add
// import roundedInstrumentImg from "../assets/Images/manageInstru/imgrounded.png";
import uploadIcon from "../assets/Images/loginImg/uplodeicon.png";
import axios from "axios";
import { useSelector } from "react-redux";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import TiptapEditor from "./TiptapEditor"; //add for editor

const ManageInstruments = () => {
  const navigate = useNavigate();
  const users = useSelector((state) => state.user);
  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (!tokens) {
    navigate("/");
  }
  tokens = tokens.replace(/"/g, "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [data, setData] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});

  const API_URL = "https://crp.mydevfactory.com/api/users/instruments/";

  const cleanState = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedInstrument(null);
    setPreviewImage(null);
    setErrors({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setSelectedInstrument({
          ...selectedInstrument,
          photo: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error);
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = data.filter((instrument) => {
    const searchLower = searchTerm.toLowerCase();
    return instrument.name.toLowerCase().includes(searchLower) || instrument.ins_des.toLowerCase().includes(searchLower);
  });

  const validateForm = () => {
    const newErrors = {};

    if (!selectedInstrument?.name || selectedInstrument.name.trim() === "") {
      newErrors.name = "Instrument name is required";
    }

    if (!selectedInstrument?.is_available || selectedInstrument.is_available === "Current Status") {
      newErrors.is_available = "Current status is required";
    }

    if (!selectedInstrument?.category || selectedInstrument.category === "Select Category") {
      newErrors.category = "Category is required";
    }

    if (!selectedInstrument?.ins_des || selectedInstrument.ins_des.trim() === "") {
      newErrors.ins_des = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addHandler = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    try {
      const formData = new FormData();
      if (selectedInstrument?.photo) {
        formData.append("photo", selectedInstrument.photo);
      }
      // Even if no photo is provided, the API will use a default image
      Object.keys(selectedInstrument).forEach((key) => {
        if (key !== "photo") {
          formData.append(key, selectedInstrument[key]);
        }
      });

      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchData();
      cleanState();
      toast.success("Instrument added successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add instrument");
    } finally {
      setSubmitLoading(false);
    }
  };

  const editHandler = async () => {
    if (!validateForm()) {
      return;
    }

    setUpdateLoading(true);
    try {
      const editUrl = `${API_URL}${selectedInstrument.id}/`;
      const formData = new FormData();

      // Only append photo if a new one was selected
      if (selectedInstrument?.photo instanceof File) {
        formData.append("photo", selectedInstrument.photo);
      }

      // Append other fields
      const fieldsToUpdate = {
        name: selectedInstrument.name,
        category: selectedInstrument.category,
        is_available: selectedInstrument.is_available,
        ins_des: selectedInstrument.ins_des,
      };

      Object.keys(fieldsToUpdate).forEach((key) => {
        formData.append(key, fieldsToUpdate[key]);
      });

      await axios.put(editUrl, formData, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchData();
      cleanState();
      toast.success("Instrument updated successfully!");
    } catch (error) {
      console.error("Error updating instrument:", error);
      toast.error(error.response?.data?.ins_des?.[0] || error.response?.data?.message || "Failed to update instrument");
    } finally {
      setUpdateLoading(false);
    }
  };

  //delete instrument api call
  const deleteHandler = async () => {
    setDeleteLoading(true);
    try {
      if (selectedInstrument?.id) {
        const deleteUrl = `${API_URL}${selectedInstrument.id}/`;
        await axios.delete(deleteUrl, {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "application/json",
          },
        });
        await fetchData();
        cleanState();
        toast.success("Instrument deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting instrument:", error);
      toast.error(error.response?.data?.message || "Failed to delete instrument");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Add this function to extract heading from HTML content
  const extractHeading = (htmlContent) => {
    if (!htmlContent) return "";

    // Create a temporary div to parse HTML
    const div = document.createElement("div");
    div.innerHTML = htmlContent;

    // Try to find heading in different formats
    const headingElement =
      div.querySelector("h1") || // First try h1
      div.querySelector('[style*="text-align"] strong') || // Then try centered strong text
      div.querySelector("strong") || // Then any strong text
      div.querySelector("p"); // Finally fall back to first paragraph

    const text = headingElement ? headingElement.textContent.trim() : "";
    const words = text.split(/\s+/);

    if (words.length > 9) {
      return words.slice(0, 9).join(" ") + "...";
    }

    return text;
  };

  return (
    <Layout title="Manage Instrument">
      {/* Rest of the component remains the same */}
      {/* Add Instrument Section */}
      <div className="px-8 pb-5 bg-[#171717] rounded-lg mt-5">
        <div className="py-4 flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or description"
              className="pl-10 pr-4 py-2 w-72 border-2 border-[#BBA14F] rounded-lg bg-transparent text-white focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <button
            className="flex items-center space-x-2 bg-[#BBA14F] hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            <span>Add Instrument</span>
          </button>
        </div>

        {/* Instruments Table */}
        <div className="border border-[#202020] rounded-lg overflow-x-auto max-h-[calc(100vh-37vh)] overflow-auto scrollbar-hide">
          <table className="w-full bg-[#171717] rounded-lg">
            <thead>
              <tr className="text-left  text-[#818181] border-b border-gray-700 sticky top-0 bg-black">
                <th className="p-4 px-8">Instrument</th>
                {/* <th className="p-4">Category</th> */}
                <th className="p-4 px-8">Current Status</th>
                <th className="p-4 px-8">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                filteredData.map((instrument) => (
                  <tr key={instrument.id} className="border-b  border-gray-700 hover:bg-[#1e1e1e] transition">
                    {/* Instrument Info */}
                    <td className="p-4 flex items-center space-x-4">
                      <img src={`https://crp.mydevfactory.com/${instrument.photo}`} alt={instrument.name} className="w-14 h-14 rounded-full object-cover" />
                      <div>
                        <h4 className="text-lg font-semibold">{instrument.name}</h4>
                        {/* <p className="text-sm text-[#989898]">{extractHeading(instrument.ins_des)}</p> */}
                        <p className="text-sm text-[#989898]">{instrument.category}</p>

                      </div>
                    </td>

                    {/* <td>
                      <p className="text-sm text-gray-400">{instrument.category}</p>
                    </td> */}

                    {/* Status */}
                    <td className="p-4 font-semibold">{instrument.is_available}</td>

                    {/* Actions */}
                    <td className="p-4 flex space-x-4">
                      <button
                        className="hover:scale-110 transition"
                        onClick={() => {
                          setSelectedInstrument(instrument);
                          setPreviewImage(`https://crp.mydevfactory.com/${instrument.photo}`);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <img src={editicon} alt="Edit" className="w-6" />
                      </button>
                      <div className="h-6 w-[1px] bg-gray-600"></div>
                      <button
                        className="hover:scale-110 transition"
                        onClick={() => {
                          setSelectedInstrument(instrument);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <img src={viewicon} alt="View" className="w-6" />
                      </button>
                      <div className="h-6 w-[1px] bg-gray-600"></div>
                      <img
                        src={deleteicon}
                        alt="Delete"
                        className="w-6 h-6 cursor-pointer hover:opacity-80"
                        onClick={() => {
                          setSelectedInstrument(instrument);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Add Instrument Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-[800px] p-8 relative">
                  {/* Yellow corner */}
                  <div className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg "></div>

                  {/* Close Button */}
                  <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={cleanState}>
                    ✕
                  </button>

                  {/* Modal Title */}
                  <h3 className="text-center text-xl font-bold mb-6 text-black">Add New Instrument</h3>

                  {/* Form Layout */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Side: Upload Image */}
                    <div className="relative">
                      <label
                        htmlFor="file-upload"
                        className="border-dashed border-2 border-[#BBA14F] p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer w-full h-32"
                      >
                        {previewImage ? (
                          <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                          <>
                            <img src={uploadIcon} alt="Upload Icon" className="w-12 h-12 mb-2" />
                            <p className="text-[#BBA14F] text-sm font-semibold">Upload Profile Image</p>
                            <p className="text-xs text-gray-500">Support: JPEG, PDF 15 MB</p>
                            <p className="text-xs text-gray-500">(Optional - Default image will be used if none provided)</p>
                          </>
                        )}
                      </label>
                      <input id="file-upload" type="file" className="hidden" accept="image/jpeg, image/png" onChange={handleImageChange} />
                    </div>

                    {/* Right Side: Inputs */}
                    <div className="flex flex-col space-y-4 text-black">
                      <div>
                        <input
                          type="text"
                          placeholder="Instrument Name"
                          className={`p-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none w-full`}
                          value={selectedInstrument?.name || ""}
                          onChange={(e) =>
                            setSelectedInstrument({
                              ...selectedInstrument,
                              name: e.target.value,
                            })
                          }
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <select
                          className={`p-2 border ${errors.is_available ? "border-red-500" : "border-gray-300"} rounded-lg w-full`}
                          value={selectedInstrument?.is_available || ""}
                          onChange={(e) =>
                            setSelectedInstrument({
                              ...selectedInstrument,
                              is_available: e.target.value,
                            })
                          }
                        >
                          <option>Current Status</option>
                          <option value={"Available"}>Available</option>
                          <option value={"In Use"}>In Use</option>
                          <option value={"Under Maintainence"}>Under Maintainence</option>
                        </select>
                        {errors.is_available && <p className="text-red-500 text-xs mt-1">{errors.is_available}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Fields */}
                  <div className="mt-4 space-y-4">
                    {/* Category Dropdown */}
                    <div>
                      <select
                        className={`p-2 border ${errors.category ? "border-red-500" : "border-gray-300"} text-black rounded-lg w-full`}
                        value={selectedInstrument?.category || ""}
                        onChange={(e) =>
                          setSelectedInstrument({
                            ...selectedInstrument,
                            category: e.target.value,
                          })
                        }
                      >
                        <option>Select Category</option>
                        <option value="String Instruments">String Instrument</option>
                        <option value="Wind Instruments">Wind Instrument</option>
                        <option value="Percussion">Percussion</option>
                        <option value="Electronics">Electronic</option>
                      </select>
                      {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    {/* Description Field */}
                    <div>
                      <TiptapEditor
                        content={selectedInstrument?.ins_des || ""}
                        onChange={(newContent) =>
                          setSelectedInstrument({
                            ...selectedInstrument,
                            ins_des: newContent,
                          })
                        }
                      />
                      {errors.ins_des && <p className="text-red-500 text-xs mt-1">{errors.ins_des}</p>}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6 text-center">
                    <button className="bg-[#BBA14F] text-black p-2 px-6 rounded-lg hover:bg-yellow-600 disabled:opacity-50" onClick={addHandler} disabled={submitLoading}>
                      {submitLoading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Parameter Modal */}
            {isDeleteModalOpen && selectedInstrument && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
                  {/* Yellow corner */}
                  <div className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg "></div>
                  <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={cleanState}>
                    ✕
                  </button>

                  <h3 className="text-lg font-bold mb-4 text-black text-center">Delete Parameter</h3>
                  <p className="text-gray-600 mb-4">Are you sure you want to delete "{selectedInstrument.name}"?</p>
                  <div className="flex justify-end space-x-4">
                    <button className="text-gray-600" onClick={cleanState}>
                      Cancel
                    </button>
                    <button className="bg-[#BBA14F] text-white px-4 py-2 rounded-lg  disabled:opacity-50" onClick={deleteHandler} disabled={deleteLoading}>
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Instrument Modal */}
            {isEditModalOpen && selectedInstrument && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-[800px] p-8 relative">
                  {/* Yellow corner */}
                  <div className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></div>

                  {/* Close Button */}
                  <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={() => setIsEditModalOpen(false)}>
                    ✕
                  </button>

                  <h3 className="text-center text-xl font-bold mb-6 text-black">Edit Instrument</h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative">
                      <label
                        htmlFor="edit-file-upload"
                        className="border-dashed border-2 border-[#BBA14F] p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer w-full h-32"
                      >
                        {previewImage ? (
                          <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                          <>
                            <img src={uploadIcon} alt="Upload Icon" className="w-12 h-12 mb-2" />
                            <p className="text-[#BBA14F] text-sm font-semibold">Upload Profile Image</p>
                            <p className="text-xs text-gray-500">Support: JPEG, PDF 15 MB</p>
                            <p className="text-xs text-gray-500">(Optional - Current image will be kept if none provided)</p>
                          </>
                        )}
                      </label>
                      <input id="edit-file-upload" type="file" className="hidden" accept="image/jpeg, image/png" onChange={handleImageChange} />
                    </div>

                    <div className="flex flex-col space-y-4 text-black">
                      <div>
                        <input
                          type="text"
                          value={selectedInstrument?.name || ""}
                          onChange={(e) =>
                            setSelectedInstrument({
                              ...selectedInstrument,
                              name: e.target.value,
                            })
                          }
                          className={`p-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none w-full`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <select
                          className={`p-2 border ${errors.is_available ? "border-red-500" : "border-gray-300"} rounded-lg w-full`}
                          value={selectedInstrument.is_available || ""}
                          onChange={(e) =>
                            setSelectedInstrument({
                              ...selectedInstrument,
                              is_available: e.target.value,
                            })
                          }
                        >
                          <option>Current Status</option>
                          <option value={"Available"}>Available</option>
                          <option value={"In Use"}>In Use</option>
                          <option value={"Under Maintainence"}>Under Maintainence</option>
                        </select>
                        {errors.is_available && <p className="text-red-500 text-xs mt-1">{errors.is_available}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <select
                        className={`p-2 border ${errors.category ? "border-red-500" : "border-gray-300"} text-black rounded-lg w-full`}
                        value={selectedInstrument.category || ""}
                        onChange={(e) =>
                          setSelectedInstrument({
                            ...selectedInstrument,
                            category: e.target.value,
                          })
                        }
                      >
                        <option>Select Category</option>
                        <option value="String Instruments">String Instrument</option>
                        <option value="Wind Instruments">Wind Instrument</option>
                        <option value="Percussion">Percussion</option>
                        <option value="Electronics">Electronic</option>
                      </select>
                      {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    <div>
                      <TiptapEditor
                        content={selectedInstrument.ins_des || ""}
                        onChange={(newContent) =>
                          setSelectedInstrument({
                            ...selectedInstrument,
                            ins_des: newContent,
                          })
                        }
                      />
                      {errors.ins_des && <p className="text-red-500 text-xs mt-1">{errors.ins_des}</p>}
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <button className="bg-[#BBA14F] text-black p-2 px-6 rounded-lg hover:bg-yellow-600 disabled:opacity-50" onClick={editHandler} disabled={updateLoading}>
                      {updateLoading ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View Instrument Modal */}
            {isViewModalOpen && selectedInstrument && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-[800px] p-8 relative">
                  {/* Yellow corner */}
                  <div className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></div>

                  {/* Close Button */}
                  <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={cleanState}>
                    ✕
                  </button>

                  <h3 className="text-center text-xl font-bold mb-6 text-black">View Instrument</h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative">
                      <div className="border-2 border-[#BBA14F] p-6 rounded-lg flex items-center justify-center w-full h-48">
                        <img src={`https://crp.mydevfactory.com/${selectedInstrument.photo}`} alt={selectedInstrument.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    </div>

                    {/* Right Side: Instrument Details */}
                    <div className="flex flex-col space-y-4 text-black">
                      <div>
                        <label className="text-sm text-gray-600">Name</label>
                        <h4 className="text-lg font-semibold">{selectedInstrument.name}</h4>
                      </div>

                      <div>
                        <label className="text-sm text-gray-600">Status</label>
                        <p className="font-medium">{selectedInstrument.is_available}</p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-600">Category</label>
                        <p className="font-medium">{selectedInstrument.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <label className="text-sm text-gray-600">Description</label>
                    <div
                      className="mt-2 p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none text-black overflow-x-auto max-h-[200px] [&_h1]:text-base [&_h1]:font-normal"
                      dangerouslySetInnerHTML={{ __html: selectedInstrument.ins_des }}
                    />
                  </div>
                </div>
              </div>
            )}
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ManageInstruments;
