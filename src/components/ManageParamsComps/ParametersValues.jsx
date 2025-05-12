import Layout from "../Layout";
import PropTypes from "prop-types";
import backIcon from "../../assets/Images/manageInstru/backIcon.png";
import { useCallback, useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { apiCallBack } from "../../utils/fetchAPI";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkTypeArr } from "../../utils/smallFun";
import { getApiEditPoint } from "../../Helpers/ParametersHelper";
import { LuPenLine } from "react-icons/lu";
import { toast } from "react-toastify";

const ParametersValues = ({ seletedParam, backTopParam }) => {
  const navigate = useNavigate();
  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (!tokens) {
    navigate("/");
  }
  tokens = tokens.replace(/"/g, "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dropValues, setDropValues] = useState([]);
  const [newParameterName, setNewParameterName] = useState("");
  //   const [pendingParameters, setPendingParameters] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const refreshComponent = async () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setNewParameterName("");
    setSelectedValue(null);
  };

  useEffect(() => {
    refreshComponent();
  }, []);

  const fetchDropdownValues = useCallback(async () => {
    setLoading(true);
    try {
      let apiEndpoint = getApiEditPoint(seletedParam?.id);
      if (!apiEndpoint) {
        toast.error("Invalid parameter. Please try again.");
        return;
      }

      const response = await apiCallBack("GET", `parameters/${apiEndpoint}`, null, tokens);
      if (checkTypeArr(response)) {
        setDropValues(response);
      } else {
        console.error("Error fetching parameters:", response);
      }
    } catch (error) {
      console.error("Error fetching parameters:", error);
    } finally {
      setLoading(false);
    }
  }, [tokens, seletedParam?.id]);

  useEffect(() => {
    fetchDropdownValues();
  }, [fetchDropdownValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      let apiEndpoint = getApiEditPoint(seletedParam?.id);
      if (!apiEndpoint) {
        toast.error("Invalid parameter. Please try again.");
        return;
      }

      const response = await apiCallBack("POST", `parameters/${apiEndpoint}`, { name: newParameterName }, tokens);
      if (response) {
        fetchDropdownValues();
        refreshComponent();
      } else {
        console.error("Error fetching parameters:", response);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Error fetching parameters:", error);
    } finally {
      setSaveLoading(false);
    }
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      let apiEndpoint = getApiEditPoint(seletedParam?.id);
      if (!apiEndpoint) {
        return toast.error("Invalid parameter. Please try again.");
      }
      if (!selectedValue?.id) {
        return toast.error("Id NOT CAPTURED. Close popup and try again.");
      }

      const response = await apiCallBack("PUT", `parameters/${apiEndpoint}${selectedValue?.id}/`, { name: selectedValue.name }, tokens);
      if (response) {
        fetchDropdownValues();
        refreshComponent();
      } else {
        console.error("Error fetching parameters:", response);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Error fetching parameters:", error);
    } finally {
      setEditLoading(false);
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    try {
      let apiEndpoint = getApiEditPoint(seletedParam?.id);
      if (!apiEndpoint) {
        return toast.error("Invalid parameter. Please try again.");
      }
      if (!selectedValue?.id) {
        return toast.error("Id NOT CAPTURED. Close popup and try again.");
      }

      const response = await apiCallBack("DELETE", `parameters/${apiEndpoint}${selectedValue?.id}/`, null, tokens);
      if (response?.status) {
        fetchDropdownValues();
        refreshComponent();
      } else {
        console.error("Error fetching parameters:", response);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Error fetching parameters:", error);
    } finally {
      setDeleteLoading(false);
    }
  };
  //   const removeFromPendingList = async () => {};
  //   const addToPendingList = async () => {};

  return (
    <>
      <Layout
        title={
          <div className="flex items-center gap-2">
            <div className="border border-[#BBA14F] rounded-full p-3 cursor-pointer" onClick={backTopParam}>
              <img src={backIcon} alt="Back" className="h-3 w-3" />
            </div>
            <span>{seletedParam?.name}</span>
          </div>
        }
      >
        <div className="px-8 pb-7 bg-[#292929]  rounded-lg">
          <div className="py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">{seletedParam?.name}</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-[#BBA14F] hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
            >
              <span>Add {seletedParam?.name}</span>
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
                <h3 className="text-center text-xl font-bold mb-6 text-black">Create {seletedParam?.name}</h3>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Input and Add Button */}
                  <label className="text-gray-600 text-sm block mb-1">{seletedParam?.name}</label>

                  <div className="flex items-center gap-2 mb-4 justify-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={`Enter ${seletedParam?.name}`}
                        value={newParameterName}
                        onChange={(e) => setNewParameterName(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none w-full text-black"
                      />
                    </div>
                    {/* <div className=" ">
                      <button type="button" onClick={addToPendingList} className="border border-[#b89e5a]  hover:text-white rounded-lg p-2 flex items-end justify-center">
                        <img src={plusIcon} alt="" /> 
                      </button>
                    </div> */}
                  </div>

                  {/* List of Pending Parameters */}
                  {/* {pendingParameters.length > 0 && (
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
                  )} */}

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

                <h3 className="text-center text-xl font-bold mb-6 text-black">Edit {seletedParam?.name}</h3>
                <form onSubmit={handleEdit}>
                  <label className="text-gray-600 text-sm block mb-1">Edit {seletedParam?.name}</label>
                  <input
                    type="text"
                    placeholder={`Edit ${seletedParam?.name}`}
                    value={selectedValue?.name || ""}
                    onChange={(e) => setSelectedValue({ ...selectedValue, name: e.target.value })}
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

                <h3 className="text-center text-xl font-bold mb-6 text-black">Delete {seletedParam?.name}</h3>
                <p className="text-gray-600 mb-6 text-center">
                  Are you sure you want to delete {seletedParam?.name} &quot;{selectedValue?.name}&quot;?
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
                      Loading...
                    </td>
                  </tr>
                ) : dropValues.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-400">
                      No parameters found. Add a new one to get started.
                    </td>
                  </tr>
                ) : (
                  checkTypeArr(dropValues) &&
                  dropValues.map((param) => (
                    <tr key={param.id} className="border-b border-gray-700 hover:bg-[#1e1e1e] transition">
                      <td className="p-4 px-8">{param.name}</td>
                      <td className="p-4 px-8 text-right flex justify-end items-center">
                        <div className="flex items-center space-x-6">
                          {!param.is_masterdata ? (
                            <>
                              <LuPenLine
                                className="icon_style"
                                onClick={() => {
                                  setSelectedValue(param);
                                  setIsEditModalOpen(true);
                                }}
                              />

                              <div className="h-6 w-[1px] bg-gray-600"></div>

                              <FaRegTrashAlt
                                className="icon_style"
                                onClick={() => {
                                  setSelectedValue(param);
                                  setIsDeleteModalOpen(true);
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <div className="relative group ">
                                {/* <img src={editicon} alt="Edit" className="w-6 h-6  cursor-not-allowed" /> */}
                                <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded p-2 w-40 right-10 -top-2 z-10 text-center">
                                  Predefined data can&apos;t be edited
                                </div>
                              </div>
                              <div className="h-6 w-[1px] bg-gray-600"></div>
                              <div className="relative group">
                                {/* <img src={deleteicon} alt="Delete" className="w-6 h-6  cursor-not-allowed" /> */}
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
    </>
  );
};

ParametersValues.propTypes = {
  seletedParam: PropTypes.any,
  backTopParam: PropTypes.any,
};

export default ParametersValues;
