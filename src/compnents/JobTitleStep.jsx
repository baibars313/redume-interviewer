import React, { useState } from "react";
// Step 2: Job title input.
const JobTitleStep = ({ data, onNext, onBack }) => {
  const [jobTitle, setJobTitle] = useState(data.jobTitle || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!jobTitle.trim()) {
      setError("Please enter a job title.");
      return;
    }
    setError("");
    onNext({ jobTitle });
  };

  return (
    <div className="text-blue-900">
      <p className="mb-2">Enter the job position or title:</p>
      <input
        type="text"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Job Title"
        className="border border-red-500 p-3 w-full mb-4 rounded-lg"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-between">
        <button onClick={onBack} className="bg-red-500 text-white py-2 px-4 rounded">
          Back
        </button>
        <button onClick={handleNext} className="bg-red-500 text-white py-2 px-4 rounded">
          Next
        </button>
      </div>
    </div>
  );
};
export default JobTitleStep;