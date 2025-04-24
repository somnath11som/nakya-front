import React, { useState } from "react";
import { RiCloseFill, RiSearchLine, RiArrowRightSLine } from "react-icons/ri";

const VesselTypeModal = ({ onClose, onSelect }) => {
  const [isAddingVesselType, setIsAddingVesselType] = useState(false);
  const [vesselTypeName, setVesselTypeName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const vesselTypes = {
    "Cell Culture": {
      "Adherent Culture": ["T-Flask", "Cell Stack", "Roller Bottle", "Cell Factory"],
      "Suspension Culture": ["Spinner Flask", "Shake Flask", "Wave Bag", "Stirred Tank"],
    },
    Fermentation: {
      "Batch Process": ["Benchtop Fermenter", "Pilot Scale", "Production Scale", "Mini Fermenter"],
      "Continuous Process": ["CSTR", "Bubble Column", "Airlift", "Packed Bed"],
    },
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const handleFinalSelect = (type) => {
    onSelect(type);
    onClose();
  };

  if (isAddingVesselType) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
        <div className="bg-white text-black p-6 rounded-lg w-[500px] relative">
          <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
          <button className="hover:text-black text-white absolute right-1 top-0" onClick={() => setIsAddingVesselType(false)}>
            ✕
          </button>

          <h2 className="text-lg font-bold text-center">Create A New Vessel Type</h2>

          <div className="mt-2">
            <p className="text-center text-sm text-gray-500 mb-4">Enter details to create a new vessel type.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Vessel Type Name</label>
                <input
                  type="text"
                  placeholder="Enter Vessel Type Name"
                  value={vesselTypeName}
                  onChange={(e) => setVesselTypeName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                />
              </div>
              <button
                className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4 w-full"
                onClick={() => {
                  console.log("New Vessel Type Created:", vesselTypeName);
                  setIsAddingVesselType(false);
                  setVesselTypeName("");
                }}
              >
                Save Vessel Type
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white text-black p-6 rounded-lg w-[500px] relative">
        <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
        <button className="hover:text-black text-white absolute right-1 top-0" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-lg font-bold text-center">Select Vessel Type</h2>

        <div className="px-4 mt-3 relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-3 pl-10 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
          />
          <RiSearchLine className="absolute left-6 top-[13px] text-gray-500" size={18} />
        </div>

        <div className="px-4 mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
          {/* Main Categories */}
          {Object.keys(vesselTypes).map((category) => (
            <div key={category}>
              <div
                className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black flex justify-between items-center"
                onClick={() => handleCategorySelect(category)}
              >
                <span>{category}</span>
                <RiArrowRightSLine size={20} />
              </div>

              {/* Sub Categories */}
              {selectedCategory === category && (
                <div className="ml-4">
                  {Object.keys(vesselTypes[category]).map((subCategory) => (
                    <div key={subCategory}>
                      <div
                        className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black flex justify-between items-center"
                        onClick={() => handleSubCategorySelect(subCategory)}
                      >
                        <span>{subCategory}</span>
                        <RiArrowRightSLine size={20} />
                      </div>

                      {/* Final Options */}
                      {selectedSubCategory === subCategory && (
                        <div className="ml-4">
                          {vesselTypes[category][subCategory].map((type) => (
                            <div key={type} className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black" onClick={() => handleFinalSelect(type)}>
                              {type}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          className="bg-[#BBA14F] hover:bg-yellow-600 text-white px-9 py-2 rounded-lg font-semibold transition transform hover:scale-105 block mx-auto mt-4"
          onClick={() => setIsAddingVesselType(true)}
        >
          Add New Vessel Type
        </button>
      </div>
    </div>
  );
};

export default VesselTypeModal;
