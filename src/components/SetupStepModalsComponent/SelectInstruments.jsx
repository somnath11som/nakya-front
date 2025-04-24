import React, { useState, useEffect } from "react";
import { RiCloseFill, RiSearchLine } from "react-icons/ri";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SelectInstruments = ({ onClose, onSelect }) => {
  const [isAddingInstrument, setIsAddingInstrument] = useState(false);
  const [instrumentName, setInstrumentName] = useState("");
  const [instrumentDescription, setInstrumentDescription] = useState("");
  const [instruments, setInstruments] = useState([]);
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

  // Fetch instruments from API
  useEffect(() => {
    const fetchInstruments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getToken();
        const response = await axios.get("https://crp.mydevfactory.com/api/users/instruments/", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setInstruments(response.data);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setInstruments(response.data.data);
        } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
          setInstruments(response.data.results);
        } else {
          console.error("Unexpected API response format:", response.data);
          setError("Unexpected data format received from server");
          setInstruments([]);
        }
      } catch (error) {
        console.error("Error fetching instruments:", error);
        setError("Failed to fetch instruments. Please try again later.");
        setInstruments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstruments();
  }, [reduxToken]);

  // Filter instruments based on search term
  const filteredInstruments = instruments.filter((instrument) => {
    if (typeof instrument === "string") {
      return instrument.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (instrument && instrument.name) {
      return instrument.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  // Handle create instrument
  const handleCreateInstrument = async () => {
    if (!instrumentName.trim()) {
      toast.error("Instrument name is required");
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();
      await axios.post(
        "https://crp.mydevfactory.com/api/users/instruments/",
        {
          name: instrumentName,
          description: instrumentDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      toast.success("Instrument created successfully");
      onSelect(instrumentName);
      onClose();
    } catch (error) {
      console.error("Error creating instrument:", error);
      toast.error("Failed to create instrument. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white text-black p-6 rounded-lg w-[500px] relative">
        <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
        <button className="hover:text-black text-white absolute right-1 top-0" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-lg font-bold text-center">{isAddingInstrument ? "Create A New Instrument" : "Select Instrument"}</h2>

        {!isAddingInstrument ? (
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

            {/* Instrument List */}
            <div className="mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
              {isLoading ? (
                <div className="text-center py-4">Loading instruments...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : filteredInstruments.length > 0 ? (
                filteredInstruments.map((instrument, index) => (
                  <div
                    key={index}
                    className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black"
                    onClick={() => {
                      onSelect(typeof instrument === "string" ? instrument : instrument.name);
                      onClose();
                    }}
                  >
                    {typeof instrument === "string" ? instrument : instrument.name}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">{searchTerm ? "No matching instruments found" : "No instruments available"}</div>
              )}
            </div>

            {/* Add New Instrument Button */}
            <button
              className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
              onClick={() => setIsAddingInstrument(true)}
            >
              Add New Instrument
            </button>
          </>
        ) : (
          // Create Instrument Form
          <div className="mt-2">
            <p className="text-center text-sm text-gray-500 mb-4">Enter details to create a new instrument.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Instrument Name</label>
                <input
                  type="text"
                  placeholder="Enter Instrument Name"
                  value={instrumentName}
                  onChange={(e) => setInstrumentName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  placeholder="Enter Description"
                  value={instrumentDescription}
                  onChange={(e) => setInstrumentDescription(e.target.value)}
                  className="w-full h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                />
              </div>
              <button
                className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
                onClick={handleCreateInstrument}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Instrument"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInstruments;
