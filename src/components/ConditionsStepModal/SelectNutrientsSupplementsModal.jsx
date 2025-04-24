import React, { useState } from "react";
import { RiCloseFill, RiSearchLine, RiDeleteBin6Line } from "react-icons/ri";
import { IoAdd } from "react-icons/io5";

const SelectNutrientsSupplementsModal = ({ onClose, onSelect }) => {
  const [isAddingNutrient, setIsAddingNutrient] = useState(false);
  const [nutrientName, setNutrientName] = useState("");
  const [nutrientsList, setNutrientsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const nutrients = [
    "Vitamin A",
    "Vitamin B Complex",
    "Vitamin C",
    "Vitamin D",
    "Vitamin E",
    "Calcium",
    "Iron",
    "Magnesium",
    "Zinc",
    "Omega-3",
    "Protein Powder",
    "Fiber Supplement",
    "Probiotics",
    "Folic Acid",
    "Biotin",
    "Collagen",
    "Coenzyme Q10",
    "Glucosamine",
    "Melatonin",
    "Potassium"
  ];

  // Add a new nutrient to the list
  const handleAddNutrient = () => {
    if (nutrientName.trim() !== "") {
      setNutrientsList([...nutrientsList, nutrientName.trim()]);
      setNutrientName("");
    }
  };

  // Remove a nutrient from the list
  const handleRemoveNutrient = (index) => {
    setNutrientsList(nutrientsList.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white w-[500px] rounded-lg shadow-lg relative">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b px-4 py-3 relative">
          <h2 className="text-lg font-semibold text-black w-full text-center">
            {isAddingNutrient ? "Add Nutrients / Supplements" : "Select Nutrient/Supplement"}
          </h2>
          <button onClick={onClose} className="absolute right-0 top-0 z-40">
            <RiCloseFill size={22} className="text-white" />
          </button>
          <span className="absolute top-0 right-0 bg-[#b89e5a] p-3 rounded-bl-2xl"></span>
        </div>

        {/* First Modal: Select Nutrient/Supplement */}
        {!isAddingNutrient ? (
          <>
            {/* Search Bar */}
            <div className="px-4 mt-3 relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-3 pl-10 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <RiSearchLine className="absolute left-6 top-[13px] text-gray-500" size={18} />
            </div>

            {/* Nutrient List */}
            <div className="px-4 mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
              {nutrients
                .filter((nutrient) =>
                  nutrient.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((nutrient, index) => (
                  <div
                    key={index}
                    className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black"
                    onClick={() => {
                      onSelect(nutrient);
                      onClose();
                    }}
                  >
                    {nutrient}
                  </div>
                ))}
            </div>

            {/* Add New Nutrient Button */}
            <div className="px-4 py-3">
              <button
                className="w-full bg-[#b89e5a] text-white p-2 rounded-lg"
                onClick={() => setIsAddingNutrient(true)}
              >
                Add New Nutrient/Supplement
              </button>
            </div>
          </>
        ) : (
          /* Second Modal: Add New Nutrient/Supplement */
          <div className="p-6">
            <label className="text-gray-600 text-sm">Nutrients / Supplements Name</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                placeholder="Enter Nutrients / Supplements Name"
                value={nutrientName}
                onChange={(e) => setNutrientName(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
              />
              <button
                onClick={handleAddNutrient}
                className="p-3 bg-[#b89e5a] text-white rounded-lg flex items-center justify-center"
              >
                <IoAdd size={20} />
              </button>
            </div>

            {/* Display Added Nutrients */}
            <div className="mt-4 space-y-2">
              {nutrientsList.map((nutrient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-200 px-4 py-2 rounded-lg text-black"
                >
                  <span>{nutrient}</span>
                  <RiDeleteBin6Line
                    className="text-gray-600 cursor-pointer hover:text-red-500"
                    size={18}
                    onClick={() => handleRemoveNutrient(index)}
                  />
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-4">
              <button
                className="w-full bg-[#b89e5a] text-white p-3 rounded-lg font-semibold"
                onClick={() => setIsAddingNutrient(false)}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectNutrientsSupplementsModal;
