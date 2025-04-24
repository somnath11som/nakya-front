import React, { useState } from "react";
import { RiCloseFill, RiSearchLine, RiToolsFill, RiDeleteBin6Line } from "react-icons/ri";

const SelectInstrumentsModal = ({ onClose, onSelect }) => {
  const allInstruments = [
    "pH Meter",
    "Dissolved Oxygen Probe",
    "Temperature Sensor",
    "Flow Meter",
    "Pressure Gauge",
    "Conductivity Meter",
    "Turbidity Meter"
  ];

  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const toggleInstrument = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((item) => item !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  const filteredInstruments = allInstruments.filter(name => {
    const searchLower = search.toLowerCase();
    const nameLower = name.toLowerCase();
    return searchLower.split('').every(char => nameLower.includes(char));
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
      <div className="bg-white w-[500px] rounded-lg shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b px-4 py-3 relative">
          <h2 className="text-lg font-semibold text-black w-full text-center">Select Instruments</h2>
          <button onClick={onClose} className="text-white absolute right-0 top-0 z-40">
            <RiCloseFill size={22} />
          </button>
          <span className="absolute top-0 right-0 bg-[#b89e5a] p-3 rounded-bl-2xl"></span>
        </div>

        {/* Search Bar */}
        <div className="px-4 mt-3 relative">
          <input
            type="text"
            placeholder="Search Instruments"
            className="w-full p-2 border-2 border-[#b89e5a] rounded-lg pl-10 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <RiSearchLine className="absolute left-6 top-[13px] text-gray-500" size={18} />
        </div>

        {/* Selected Instruments */}
        {selected.length > 0 && (
          <div className="px-4 mt-4 grid grid-cols-2 gap-2">
            {selected.map((name) => (
              <div key={name} className="flex items-center bg-gray-100 p-2 rounded-lg">
                <RiToolsFill className="text-[#b89e5a] mr-2" size={20} />
                <span className="flex-1 text-[#b89e5a]">{name}</span>
                <button onClick={() => toggleInstrument(name)}>
                  <RiDeleteBin6Line className="text-gray-600" size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Instruments List */}
        <div className="px-4 mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
          {filteredInstruments.map((name) => (
            <div
              key={name}
              className="flex items-center p-2 cursor-pointer border-b hover:bg-gray-100 rounded-lg"
              onClick={() => toggleInstrument(name)}
            >
              <RiToolsFill className="text-[#b89e5a] mr-2" size={20} />
              <span>{name}</span>
            </div>
          ))}
        </div>

        {/* Add Instruments Button */}
        <div className="px-4 py-3">
          <button 
            onClick={() => {
              onSelect(selected);
              onClose();
            }}
            className="w-full bg-[#b89e5a] text-white p-2 rounded-lg"
          >
            Add Selected Instruments
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectInstrumentsModal;
