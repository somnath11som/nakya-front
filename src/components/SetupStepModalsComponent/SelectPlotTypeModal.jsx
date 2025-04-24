import React, { useState, useEffect } from "react";
import { RiCloseFill, RiSearchLine } from "react-icons/ri";
import axios from "axios";
import { useSelector } from "react-redux";

const SelectPlotTypeModal = ({ onClose, onSelect }) => {
  const [plotTypes, setPlotTypes] = useState([]);
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

  // Fetch plot types from API
  useEffect(() => {
    const fetchPlotTypes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get token using the getToken function
        const token = getToken();

        const response = await axios.get("https://crp.mydevfactory.com/api/users/plot-types/", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        console.log("API Response:", response.data);

        // Handle different possible response structures
        if (response.data && Array.isArray(response.data)) {
          // If the API returns an array directly
          setPlotTypes(response.data);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // If the API returns a wrapper object with data property
          setPlotTypes(response.data.data);
        } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
          // Another common API structure
          setPlotTypes(response.data.results);
        } else {
          console.error("Unexpected API response format:", response.data);
          setError("Unexpected data format received from server");
          setPlotTypes([]);
        }
      } catch (error) {
        console.error("Error fetching plot types:", error);
        setError("Failed to fetch plot types. Please try again later.");
        setPlotTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlotTypes();
  }, [reduxToken]);

  // Filter plot types based on search term
  const filteredPlotTypes = plotTypes.filter((type) => {
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
      {/* Main Modal */}
      <div className="bg-white w-[500px] rounded-lg shadow-lg relative">
        {/* Close Button */}
        <div className="flex justify-between items-center border-b px-4 py-3 relative">
          <h2 className="text-lg font-semibold text-black w-full text-center">Select Plot Type</h2>
          <button onClick={onClose} className="text-white absolute right-0 top-0 z-40">
            <RiCloseFill size={22} />
          </button>
          <span className="absolute top-0 right-0 bg-[#b89e5a] p-3 rounded-bl-2xl"></span>
        </div>

        {/* Plot Type Selection */}
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

          {/* Plot Type List */}
          <div className="px-4 mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
            {isLoading ? (
              <div className="text-center py-4">Loading plot types...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : filteredPlotTypes.length > 0 ? (
              filteredPlotTypes.map((type, index) => (
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
              <div className="text-center py-4">No plot types found</div>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default SelectPlotTypeModal;
