import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  onChange: (date: Date | null) => void;
  selectedDate: Date | null;
  label?: string;
  placeholder?: string;
}

export default function CustomDatePicker({
  onChange,
  selectedDate,
  label = "Select date",
  placeholder = "Pick a date",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (date: Date | null) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          className={`w-full px-4 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            isOpen ? "border-blue-500" : "border-gray-300"
          } ${!selectedDate ? "text-gray-400" : "text-gray-900"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {selectedDate ? format(selectedDate, "PPP") : placeholder}
          </span>
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 bg-white rounded-md shadow-lg">
            <DatePicker
              selected={selectedDate}
              onChange={handleChange}
              inline
              dateFormat="MMMM d, yyyy"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              onClickOutside={() => setIsOpen(false)}
              calendarClassName="border-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
