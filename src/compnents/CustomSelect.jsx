import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({
  options = [], // Array of predefined options
  onSelect = (value) => {}, // Callback function to receive selected value
  placeholder = "Select an option",
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const containerRef = useRef(null);

  // Toggle dropdown open/close
  const toggleOptions = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle option click
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  // Handle custom option submission
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim() !== "") {
      setSelectedOption(customInput.trim());
      onSelect(customInput.trim());
      setCustomInput("");
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="">
      {/* Custom select container */}
      <div >
        <button
          onClick={toggleOptions}
          className="w-full bg-white text-red-600 border border-red-600 rounded-md p-3 flex justify-between items-center shadow-sm hover:bg-red-50 transition-colors duration-300"
        >
          <span>{selectedOption || placeholder}</span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown list with smooth animation */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-red-600 rounded-md shadow-lg animate-fadeIn">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(option)}
                className="cursor-pointer text-red-600 p-2 hover:bg-red-50 transition-colors duration-200"
              >
                {option}
              </div>
            ))}

            <div className="border-t border-red-600"></div>

            {/* Custom input area */}
            <form onSubmit={handleCustomSubmit} className="p-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom value"
                className="w-full p-2 rounded-md border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
              />
              <button
                type="submit"
                className="mt-2 w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Enter
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 300ms ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CustomSelect;
