import React from "react";

const ValueModal = ({ isOpen, onClose, title, color, fields }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#171717] p-6 rounded-lg w-[400px]">
        {/* Title with icon */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: color }}></span>
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Form Fields */}
        <form>
          {fields.map((field, index) => (
            <div key={index} className="mb-4">
              <label className="text-gray-300 block mb-1">{field.label}</label>
              {field.type === "select" ? (
                <select className="w-full bg-black text-white p-3 rounded">
                  {field.options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input type={field.type} placeholder={field.placeholder} className="w-full bg-black text-white p-3 rounded" />
              )}
            </div>
          ))}

          {/* Confirm Button */}
          <button type="button" className="w-full bg-[#bfa160] text-black font-semibold p-3 rounded">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default ValueModal;
