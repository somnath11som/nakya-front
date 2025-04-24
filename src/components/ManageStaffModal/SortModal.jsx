import React from "react";

const SortModal = ({ isOpen, onClose, departments, designation, setDesignation, department, setDepartment, handleSortApply }) => {
  // Remove the sortOrder state and set a default
  const defaultSortOrder = "asc";

  // Add an internal sorting function implementation that uses the default sort order
  const applySorting = () => {
    // Call the parent's handleSortApply with the default ascending order
    handleSortApply(defaultSortOrder);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-black p-6 rounded-lg w-1/4 relative">
        <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
        <button className="hover:text-black text-white absolute right-1 top-0" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-lg font-bold text-center">Sort By</h2>
        <div className="mt-4">
          <label className="block text-sm font-semibold">Designation</label>
          <select className="w-full p-2 border rounded-md" value={designation} onChange={(e) => setDesignation(e.target.value)}>
            <option value="">Select Designation</option>
            <option value="Scientist">Scientist</option>
            <option value="Technician">Technician</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold">Department</label>
          <select className="w-full p-2 border rounded-md" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Select Department</option>
            {departments &&
              departments.map((dept, index) => (
                <option key={index} value={dept.id}>
                  {dept.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex justify-center mt-6">
          <button onClick={applySorting} className="bg-[#BBA14F] text-white px-6 py-2 rounded-md hover:bg-[#9D8A3F] transition">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortModal;
