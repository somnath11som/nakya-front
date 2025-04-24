import React, { useState, useEffect } from "react";
import { RiCloseFill, RiSearchLine } from "react-icons/ri";
import axios from "axios";
import { useSelector } from "react-redux";

const SelectExpType = ({ onClose, onSelect }) => {
  const [isAddingExpType, setIsAddingExpType] = useState(false);
  const [expTypeName, setExpTypeName] = useState("");
  const [expTypeDescription, setExpTypeDescription] = useState("");
  const [experimentTypes, setExperimentTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from Redux store
  const reduxToken = useSelector((state) => state.token);

  // Function to get token
  const getToken = () => {
    let token = reduxToken || localStorage.getItem("token");
    if (token) {
      token = token.replace(/"/g, "");
    }
    return token;
  };

  // Fetch experiment types from API
  useEffect(() => {
    const fetchExperimentTypes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get token using the getToken function
        const token = getToken();

        const response = await axios.get("https://crp.mydevfactory.com/api/users/experiment-types/", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        console.log("API Response:", response.data);

        // Handle different possible response structures
        if (response.data && Array.isArray(response.data)) {
          // If the API returns an array directly
          setExperimentTypes(response.data);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // If the API returns a wrapper object with data property
          setExperimentTypes(response.data.data);
        } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
          // Another common API structure
          setExperimentTypes(response.data.results);
        } else {
          console.error("Unexpected API response format:", response.data);
          setError("Unexpected data format received from server");
          setExperimentTypes([]);
        }
      } catch (error) {
        console.error("Error fetching experiment types:", error);
        setError("Failed to fetch experiment types. Please try again later.");
        setExperimentTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperimentTypes();
  }, [reduxToken]);

  // Filter experiment types based on search term
  const filteredExperimentTypes = experimentTypes.filter((type) => {
    // Handle different possible data structures
    if (typeof type === "string") {
      return type.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (type && type.name) {
      return type.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white text-black p-6 rounded-lg w-[500px] relative">
        <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
        <button className="hover:text-black text-white absolute right-1 top-0" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-lg font-bold text-center">{isAddingExpType ? "Create A New Experiment Type" : "Select Experiment Type"}</h2>

        {!isAddingExpType ? (
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

            {/* Experiment Type List */}
            <div className="mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
              {isLoading ? (
                <div className="text-center py-4">Loading experiment types...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : filteredExperimentTypes.length > 0 ? (
                filteredExperimentTypes.map((type, index) => (
                  <div
                    key={index}
                    className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black"
                    onClick={() => {
                      onSelect(typeof type === "string" ? type : type.name);
                      onClose();
                    }}
                  >
                    {typeof type === "string" ? type : type.name}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">No experiment types found</div>
              )}
            </div>

            {/* Add New Experiment Type Button */}
            <button
              className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
              onClick={() => setIsAddingExpType(true)}
            >
              Add New Experiment Type
            </button>
          </>
        ) : (
          // Create Experiment Type Form
          <div className="mt-2">
            <p className="text-center text-sm text-gray-500 mb-4">Enter details to create a new experiment type.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Experiment Type Name</label>
                <input
                  type="text"
                  placeholder="Enter Experiment Type Name"
                  value={expTypeName}
                  onChange={(e) => setExpTypeName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  placeholder="Enter Description"
                  value={expTypeDescription}
                  onChange={(e) => setExpTypeDescription(e.target.value)}
                  className="w-full h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                />
              </div>
              <button
                className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4 w-full"
                onClick={async () => {
                  if (!expTypeName.trim()) {
                    alert("Please enter an experiment type name");
                    return;
                  }

                  try {
                    // Get token using the getToken function
                    const token = getToken();

                    await axios.post(
                      "https://crp.mydevfactory.com/api/users/experiment-types/",
                      {
                        name: expTypeName,
                        description: expTypeDescription,
                      },
                      {
                        headers: {
                          "Content-Type": "application/json",
                          ...(token && { Authorization: `Bearer ${token}` }),
                        },
                      }
                    );

                    // Refresh the experiment types list
                    const response = await axios.get("https://crp.mydevfactory.com/api/users/experiment-types/", {
                      headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                      },
                    });

                    if (response.data && Array.isArray(response.data)) {
                      setExperimentTypes(response.data);
                    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                      setExperimentTypes(response.data.data);
                    } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
                      setExperimentTypes(response.data.results);
                    }

                    // Reset form and close add form
                    setIsAddingExpType(false);
                    setExpTypeName("");
                    setExpTypeDescription("");
                  } catch (error) {
                    console.error("Error creating experiment type:", error);
                    alert("Failed to create experiment type. Please try again.");
                  }
                }}
              >
                Save Experiment Type
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectExpType;
