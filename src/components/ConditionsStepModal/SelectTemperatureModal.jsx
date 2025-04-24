import React, { useState } from "react";
import { RiCloseFill, RiSearchLine } from "react-icons/ri";

const SelectTemperatureModal = ({ onClose, onSelect }) => {
  const [isAddingTemperature, setIsAddingTemperature] = useState(false);
  const [celsiusValue, setCelsiusValue] = useState("");
  const [fahrenheitValue, setFahrenheitValue] = useState("");

  const temperatures = [
    "37°C",
    "32°C", 
    "28°C",
    "25°C",
    "20°C",
    "15°C",
    "10°C",
    "4°C",
    "0°C",
    "-20°C",
    "-80°C"
  ];

  const handleCelsiusChange = (e) => {
    const celsius = e.target.value;
    setCelsiusValue(celsius);
    // Convert Celsius to Fahrenheit: (°C × 9/5) + 32 = °F
    const fahrenheit = celsius ? ((parseFloat(celsius) * 9/5) + 32).toFixed(1) : "";
    setFahrenheitValue(fahrenheit);
  };

  const handleFahrenheitChange = (e) => {
    const fahrenheit = e.target.value;
    setFahrenheitValue(fahrenheit);
    // Convert Fahrenheit to Celsius: (°F - 32) × 5/9 = °C
    const celsius = fahrenheit ? ((parseFloat(fahrenheit) - 32) * 5/9).toFixed(1) : "";
    setCelsiusValue(celsius);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      {/* Main Modal */}
      <div className="bg-white w-[500px] rounded-lg shadow-lg relative">
        {/* Close Button */}
        <div className="flex justify-between items-center border-b px-4 py-3 relative">
          <h2 className="text-lg font-semibold text-black w-full text-center">
            {isAddingTemperature ? "Create A New Temperature" : "Select Temperature"}
          </h2>
          <button onClick={onClose} className="text-white absolute right-0 top-0 z-40">
            <RiCloseFill size={22} />
          </button>
          <span className="absolute top-0 right-0 bg-[#b89e5a] p-3 rounded-bl-2xl"></span>
        </div>

        {/* Temperature Selection */}
        {!isAddingTemperature ? (
          <>
            {/* Search Input */}
            <div className="px-4 mt-3 relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-3 pl-10 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
              />
              <RiSearchLine className="absolute left-6 top-[13px] text-gray-500" size={18} />
            </div>

            {/* Temperature List */}
            <div className="px-4 mt-2 max-h-[250px] overflow-y-auto scrollbar-hide text-gray-800">
              {temperatures.map((temp, index) => (
                <div
                  key={index}
                  className="p-2 border-b py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-lg text-black"
                  onClick={() => {
                    onSelect(temp);
                    onClose();
                  }}
                >
                  {temp}
                </div>
              ))}
            </div>

            {/* Add New Temperature Button */}
            <div className="px-4 py-3">
              <button
                className="w-full bg-[#b89e5a] text-white p-2 rounded-lg"
                onClick={() => setIsAddingTemperature(true)}
              >
                Add New Temperature
              </button>
            </div>
          </>
        ) : (
          // Create Temperature Form
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Celsius (°C)</label>
                  <input
                    type="number"
                    placeholder="Enter Celsius"
                    value={celsiusValue}
                    onChange={handleCelsiusChange}
                    className="w-full p-3 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fahrenheit (°F)</label>
                  <input
                    type="number"
                    placeholder="Enter Fahrenheit"
                    value={fahrenheitValue}
                    onChange={handleFahrenheitChange}
                    className="w-full p-3 border-2 border-[#b89e5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89e5a] text-black"
                  />
                </div>
              </div>
              <button
                className="w-full bg-[#b89e5a] text-white p-2 rounded-lg"
                onClick={() => {
                  console.log("New Temperature Created:", `${celsiusValue}°C (${fahrenheitValue}°F)`);
                  setIsAddingTemperature(false);
                  setCelsiusValue("");
                  setFahrenheitValue("");
                }}
              >
                Save Temperature
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectTemperatureModal;
