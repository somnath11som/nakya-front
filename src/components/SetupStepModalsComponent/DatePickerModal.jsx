import React, { useState } from "react";
import { format } from "date-fns";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const years = Array.from({ length: 50 }, (_, i) => 2000 + i); // Customize as needed

const DatePickerModal = ({ selectedDate, onClose, onSubmit }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [visibleMonth, setVisibleMonth] = useState(currentDate.getMonth());
  const [visibleYear, setVisibleYear] = useState(currentDate.getFullYear());

  const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
  const firstDay = new Date(visibleYear, visibleMonth, 1).getDay();

  const handleDateClick = (day) => {
    const newDate = new Date(visibleYear, visibleMonth, day);
    setCurrentDate(newDate);
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(visibleYear, visibleMonth + direction);
    setVisibleMonth(newDate.getMonth());
    setVisibleYear(newDate.getFullYear());
  };

  const handleSubmit = () => {
    onSubmit(currentDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-[420px] p-6 relative shadow-lg text-black">
        {/* Close Button */}
        <span className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl rounded-tr-lg"></span>
        <button className="hover:text-black text-white absolute right-1 top-0" onClick={onClose}>
          ✕
        </button>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold mb-2">Select Date</h2>

        {/* Selected Date */}
        <div className="text-sm text-gray-500 mb-1">Select Date</div>
        <div className="text-lg font-medium mb-4">
          {format(currentDate, "MM/dd/yyyy")}
        </div>

        {/* Month-Year Header */}
        <div className="flex justify-between items-center border rounded px-3 py-2 mb-4">
          {/* Year Dropdown (left side) */}
          <select
            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
            value={visibleYear}
            onChange={(e) => setVisibleYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Month Name */}
          <div className="font-medium text-sm">{months[visibleMonth]} {visibleYear}</div>

          {/* Arrows (right side) */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleMonthChange(-1)}
              className="border rounded px-2 py-1 text-sm"
            >
              &#8249;
            </button>
            <button
              onClick={() => handleMonthChange(1)}
              className="border rounded px-2 py-1 text-sm"
            >
              &#8250;
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 text-center gap-1 mt-2 mb-4 px-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div key={d} className="font-semibold text-sm text-gray-600">
              {d}
            </div>
          ))}
          {Array(firstDay).fill(null).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isSelected =
              currentDate.getFullYear() === visibleYear &&
              currentDate.getMonth() === visibleMonth &&
              currentDate.getDate() === day;

            return (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                className={`cursor-pointer w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm ${
                  isSelected
                    ? "bg-[#b99a49] text-white font-semibold"
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-[#b99a49] hover:bg-[#a6893d] text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePickerModal;
