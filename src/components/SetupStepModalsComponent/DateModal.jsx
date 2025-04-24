// import React, { useState } from "react";
// import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isBefore } from "date-fns";

// const DateModal = ({ isOpen, onClose, selectedDate, setSelectedDate }) => {
//   const [currentMonth, setCurrentMonth] = useState(new Date());

//   if (!isOpen) return null;

//   const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
//   const monthDays = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
//   const firstDayIndex = getDay(monthDays[0]);

//   const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
//   const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
//         {/* Modal Header */}
//         <h2 className="text-center text-lg font-semibold text-black">Select Date</h2>
//         <button className="absolute top-3 right-4 text-black" onClick={onClose}>✖</button>

//         {/* Selected Date */}
//         <p className="text-center mt-2 text-black">
//           {selectedDate ? format(selectedDate, "MMM dd, EEE, yyyy") : "Select Date"}
//         </p>

//         {/* Calendar Controls */}
//         <div className="flex justify-between items-center mt-4">
//           <button onClick={handlePrevMonth} className="p-2 rounded bg-gray-200 text-black">{"<"}</button>
//           <span className="font-medium text-black">{format(currentMonth, "MMMM yyyy")}</span>
//           <button onClick={handleNextMonth} className="p-2 rounded bg-gray-200 text-black">{">"}</button>
//         </div>

//         {/* Days of the Week */}
//         <div className="grid grid-cols-7 mt-4 text-black">
//           {daysOfWeek.map((day) => (
//             <div key={day} className="text-center font-semibold">{day}</div>
//           ))}
//         </div>

//         {/* Days of the Month */}
//         <div className="grid grid-cols-7 mt-2">
//           {Array.from({ length: firstDayIndex }).map((_, i) => <div key={i}></div>)}
//           {monthDays.map((day) => (
//             <button
//               key={day}
//               onClick={() => {
//                 setSelectedDate(day);
//                 onClose();
//               }}
//               className={`p-2 rounded-full text-center text-black 
//                 ${selectedDate && format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") ? "bg-yellow-500 text-white" : "hover:bg-gray-200"}
//                 ${isBefore(day, new Date()) ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"}`}
//               disabled={isBefore(day, new Date())} // Disable past dates
//             >
//               {format(day, "d")}
//             </button>
//           ))}
//         </div>

//         {/* Submit Button */}
//         <button className="bg-yellow-500 text-white w-full mt-4 p-2 rounded" onClick={onClose}>
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DateModal;


import React, { useState, useEffect } from "react";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isBefore, isValid, addDays } from "date-fns";

const DateModal = ({ isOpen, onClose, selectedDate, setSelectedDate }) => {
  // Initialize with today's date if no selectedDate
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(selectedDate || today);
  const [isEditing, setIsEditing] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [error, setError] = useState("");

  // Update manual date when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      try {
        setManualDate(format(selectedDate, "MM/dd/yyyy"));
      } catch (error) {
        console.error("Invalid date format:", error);
      }
    }
  }, [selectedDate]);

  if (!isOpen) return null;

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  
  // Ensure we're working with valid dates
  const safeCurrentMonth = new Date(currentMonth);
  const monthStart = startOfMonth(safeCurrentMonth);
  const monthEnd = endOfMonth(safeCurrentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayIndex = getDay(monthStart);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
    setError("");
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
    setError("");
  };

  const handleDateClick = (day) => {
    try {
      const tomorrow = addDays(new Date().setHours(0, 0, 0, 0), 1);
      if (isBefore(day, tomorrow)) {
        setError("Please select a future date");
        return;
      }
      setSelectedDate(day);
      setManualDate(format(day, "MM/dd/yyyy"));
      setError("");
      onClose();
    } catch (error) {
      setError("Error selecting date");
      console.error("Error in handleDateClick:", error);
    }
  };

  const handleManualSubmit = () => {
    try {
      const parsedDate = parse(manualDate, "MM/dd/yyyy", new Date());
      const tomorrow = addDays(new Date().setHours(0, 0, 0, 0), 1);

      if (!isValid(parsedDate)) {
        setError("Please enter a valid date in MM/DD/YYYY format");
        return;
      }

      if (isBefore(parsedDate, tomorrow)) {
        setError("Please select a future date");
        return;
      }

      setSelectedDate(parsedDate);
      setCurrentMonth(parsedDate);
      setIsEditing(false);
      setError("");
    } catch (error) {
      setError("Please enter a valid date in MM/DD/YYYY format");
      console.error("Error in handleManualSubmit:", error);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleManualSubmit();
    } else {
      setIsEditing(true);
      setError("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
        {/* Modal Header */}
        <h2 className="text-center text-lg font-semibold text-black">Select Date</h2>
        <button className="absolute top-3 right-4 text-black" onClick={onClose}>✖</button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}

        {/* Selected Date Section */}
        <div className="flex items-center justify-center mt-2">
          {isEditing ? (
            <input
              type="text"
              value={manualDate}
              onChange={(e) => {
                setManualDate(e.target.value);
                setError("");
              }}
              placeholder="MM/DD/YYYY"
              className="text-center border border-gray-400 p-2 rounded w-40 text-black"
            />
          ) : (
            <p className="text-center text-black">
              {selectedDate ? format(selectedDate, "MMM dd, EEE, yyyy") : "Select Date"}
            </p>
          )}
          <button
            onClick={handleEditToggle}
            className="ml-2 px-2 py-1 bg-gray-300 rounded text-black text-sm"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        {/* Calendar Controls */}
        <div className="flex justify-between items-center mt-4">
          <button onClick={handlePrevMonth} className="p-2 rounded bg-gray-200 text-black">{"<"}</button>
          <span className="font-medium text-black">{format(safeCurrentMonth, "MMMM yyyy")}</span>
          <button onClick={handleNextMonth} className="p-2 rounded bg-gray-200 text-black">{">"}</button>
        </div>

        {/* Days of the Week */}
        <div className="grid grid-cols-7 mt-4 text-black">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-semibold">{day}</div>
          ))}
        </div>

        {/* Days of the Month */}
        <div className="grid grid-cols-7 mt-2">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
          {monthDays.map((day) => {
            const tomorrow = addDays(new Date().setHours(0, 0, 0, 0), 1);
            const isSelected = selectedDate && format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            const isPast = isBefore(day, tomorrow);
            
            return (
              <button
                key={format(day, "yyyy-MM-dd")}
                onClick={() => handleDateClick(day)}
                className={`p-2 rounded-full text-center
                  ${isSelected ? "bg-yellow-500 text-white" : "text-black hover:bg-gray-200"}
                  ${isPast ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"}`}
                disabled={isPast}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        {isEditing ? (
          <button 
            className="bg-yellow-500 text-white w-full mt-4 p-2 rounded"
            onClick={handleManualSubmit}
          >
            Submit
          </button>
        ) : (
          <button 
            className="bg-yellow-500 text-white w-full mt-4 p-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default DateModal;
