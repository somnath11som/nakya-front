import React, { useState, useEffect, useCallback } from "react";
import { RiUserFill, RiDeleteBin6Line, RiCloseFill, RiSearchLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const CollaboratorModal = ({ onClose, onSelect }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Get token from Redux store or localStorage
  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (tokens && typeof tokens === "string") {
    tokens = tokens.replace(/"/g, "");
  }

  const STAFF_API_URL = "https://crp.mydevfactory.com/api/users/staffs/";

  // Fetch staff from API
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(STAFF_API_URL, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      setCollaborators(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error.response ? error.response.data : error);
      toast.error("Failed to fetch staff");
    }
    setLoading(false);
  }, [tokens]);

  // Fetch staff on component mount
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Handle adding/removing collaborators
  const toggleCollaborator = (staff) => {
    if (selected.some((item) => item.id === staff.id)) {
      setSelected(selected.filter((item) => item.id !== staff.id));
    } else {
      setSelected([...selected, staff]);
    }
  };

  // Filter collaborators based on case-insensitive search
  const filteredCollaborators = collaborators.filter((staff) => {
    if (!search.trim()) return true;

    const searchLower = search.toLowerCase();
    const nameToSearch = staff.name.toLowerCase();
    return nameToSearch.includes(searchLower);
  });

  // Handle save and close
  const handleSave = () => {
    onSelect(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white text-black p-6 rounded-lg w-[500px] relative">
        <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
        <button className="hover:text-black text-white absolute right-1 top-0" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-lg font-bold text-center">Select Collaborators</h2>

        {/* Search Input */}
        <div className="px-4 mt-3 relative">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 pl-10 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
          />
          <RiSearchLine className="absolute left-6 top-[13px] text-gray-500" size={18} />
        </div>

        {/* Selected Collaborators */}
        {selected.length > 0 && (
          <div className="px-4 mt-4 grid grid-cols-2 gap-2">
            {selected.map((staff) => (
              <div key={staff.id} className="flex items-center bg-gray-100 p-2 rounded-lg">
                <RiUserFill className="text-[#b89e5a] mr-2" size={20} />
                <span className="flex-1 text-[#b89e5a]">{staff.name}</span>
                <button onClick={() => toggleCollaborator(staff)}>
                  <RiDeleteBin6Line className="text-gray-600 hover:text-red-500" size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Collaborator List */}
        <div className="mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
          {loading ? (
            <div className="text-center py-4">Loading staff...</div>
          ) : filteredCollaborators.length > 0 ? (
            filteredCollaborators.map((staff) => (
              <div key={staff.id} className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black" onClick={() => toggleCollaborator(staff)}>
                <div className="flex items-center">
                  <RiUserFill className="text-[#b89e5a] mr-2" size={20} />
                  <span className="font-medium">{staff.name}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">{search ? "No matching staff found" : "No staff available"}</div>
          )}
        </div>

        {/* Save Button */}
        <button
          className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
          onClick={handleSave}
        >
          Add Collaborators
        </button>
      </div>
    </div>
  );
};

export default CollaboratorModal;
