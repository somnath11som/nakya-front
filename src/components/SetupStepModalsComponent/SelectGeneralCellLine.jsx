import React, { useState, useEffect } from "react";
import { RiCloseFill, RiSearchLine } from "react-icons/ri";
import axios from "axios";
import { useSelector } from "react-redux";

const SelectGeneralCellLine = ({ onClose, onSelect }) => {
  const [isAddingCellLine, setIsAddingCellLine] = useState(false);
  const [cellLineName, setCellLineName] = useState("");
  const [cellLineDescription, setCellLineDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cellLines, setCellLines] = useState([]);
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

  // Fetch cell lines from API
  useEffect(() => {
    const fetchCellLines = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get token using the getToken function
        const token = getToken();

        const response = await axios.get("https://crp.mydevfactory.com/api/users/general-cell-line/", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        console.log("API Response:", response.data);

        // Handle different possible response structures
        if (response.data && Array.isArray(response.data)) {
          // If the API returns an array directly
          setCellLines(response.data);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // If the API returns a wrapper object with data property
          setCellLines(response.data.data);
        } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
          // Another common API structure
          setCellLines(response.data.results);
        } else {
          console.error("Unexpected API response format:", response.data);
          setError("Unexpected data format received from server");
          setCellLines([]);
        }
      } catch (error) {
        console.error("Error fetching cell lines:", error);
        setError("Failed to fetch cell lines. Please try again later.");
        setCellLines([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCellLines();
  }, [reduxToken]);

  // Filter cell lines based on search term
  const filteredCellLines = cellLines.filter((cell) => {
    // Handle different possible data structures
    if (typeof cell === "string") {
      return cell.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (cell && cell.name) {
      return cell.name.toLowerCase().includes(searchTerm.toLowerCase());
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

        <h2 className="text-lg font-bold text-center">{isAddingCellLine ? "Create A New Cell Line" : "Select Cell Line"}</h2>

        {!isAddingCellLine ? (
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

            {/* Cell Line List */}
            <div className="mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
              {isLoading ? (
                <div className="text-center py-4">Loading cell lines...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : filteredCellLines.length > 0 ? (
                filteredCellLines.map((cell, index) => (
                  <div
                    key={index}
                    className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black"
                    onClick={() => {
                      onSelect(typeof cell === "string" ? cell : cell.name);
                      onClose();
                    }}
                  >
                    {typeof cell === "string" ? cell : cell.name}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">{searchTerm ? "No matching cell lines found" : "No cell lines available"}</div>
              )}
            </div>

            {/* Add New Cell Line Button */}
            <button
              className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
              onClick={() => setIsAddingCellLine(true)}
            >
              Add New Cell Line
            </button>
          </>
        ) : (
          // Create Cell Line Form
          <div className="mt-2">
            <p className="text-center text-sm text-gray-500 mb-4">Enter details to create a new cell line.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Cell Line Name</label>
                <input
                  type="text"
                  placeholder="Enter Cell Line Name"
                  value={cellLineName}
                  onChange={(e) => setCellLineName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  placeholder="Enter Description"
                  value={cellLineDescription}
                  onChange={(e) => setCellLineDescription(e.target.value)}
                  className="w-full h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                />
              </div>
              <button
                className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
                onClick={async () => {
                  if (!cellLineName.trim()) {
                    alert("Please enter a cell line name");
                    return;
                  }

                  try {
                    // Get token using the getToken function
                    const token = getToken();

                    await axios.post(
                      "https://crp.mydevfactory.com/api/users/general-cell-line/",
                      {
                        name: cellLineName,
                        description: cellLineDescription,
                      },
                      {
                        headers: {
                          "Content-Type": "application/json",
                          ...(token && { Authorization: `Bearer ${token}` }),
                        },
                      }
                    );

                    // Refresh the cell lines list
                    const response = await axios.get("https://crp.mydevfactory.com/api/users/general-cell-line/", {
                      headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                      },
                    });

                    if (response.data && Array.isArray(response.data)) {
                      setCellLines(response.data);
                    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                      setCellLines(response.data.data);
                    } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
                      setCellLines(response.data.results);
                    }

                    // Reset form and close add form
                    setIsAddingCellLine(false);
                    setCellLineName("");
                    setCellLineDescription("");
                  } catch (error) {
                    console.error("Error creating cell line:", error);
                    alert("Failed to create cell line. Please try again.");
                  }
                }}
              >
                Save Cell Line
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectGeneralCellLine;
