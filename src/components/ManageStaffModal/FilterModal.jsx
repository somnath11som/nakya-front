import React from "react";

const FilterModal = ({ isOpen, onClose, selectedLocation, selectedDepartment, toggleCheckbox, fromDate, setFromDate, toDate, setToDate, handleFilterApply, departments }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-black p-6 rounded-lg w-1/4 relative">
        <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
        <button className="hover:text-black text-white absolute right-1 top-0" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-lg font-bold text-center">Filter By</h2>

        {/* Location */}
        <div className="mt-4">
          <h3 className="font-semibold">Location</h3>
          <hr className="my-1 border-gray-300" />

          {["City", "State", "Region"].map((item) => (
            <label key={item} className="flex items-center gap-2 mt-2">
              <input type="checkbox" checked={selectedLocation.includes(item)} onChange={() => toggleCheckbox("location", item)} />
              {item}
            </label>
          ))}
        </div>

        {/* Department */}
        <div className="mt-4">
          <h3 className="font-semibold">Department</h3>
          <hr className="my-1 border-gray-300" />
          <div className="max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {departments &&
              departments.map((dept) => (
                <label key={dept.id} className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={selectedDepartment.includes(dept.name)} onChange={() => toggleCheckbox("department", dept.name)} />
                  {dept.name}
                </label>
              ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="mt-4">
          <h3 className="font-semibold">Date Range</h3>
          <hr className="my-1 border-gray-300" />

          <div className="flex gap-3 mt-2">
            <div className="w-1/2">
              <label className="block text-sm mb-1">From Date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border rounded-md p-2 w-full" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm mb-1">To Date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border rounded-md p-2 w-full" />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button onClick={handleFilterApply} className="bg-[#BBA14F] text-white px-6 py-2 rounded-md hover:bg-[#9D8A3F] transition">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
