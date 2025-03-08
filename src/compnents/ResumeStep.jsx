import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";



// Step 1: Resume selection or upload.
const ResumeStep = ({ data, onNext }) => {
  const [selectedResume, setSelectedResume] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // Dummy list of resumes for the select dropdown.
  const resumes = ["Resume1.pdf", "Resume2.pdf", "Resume3.pdf"];

  const handleNext = () => {
    if (!selectedResume && !file) {
      setError("Please select an existing resume or upload a new one.");
      return;
    }
    setError("");
    onNext({ resume: selectedResume || file });
  };

  return (
    <div className="text-gray-900">
      <p className="mb-2">Select an already uploaded resume:</p>
      <div className="relative w-full mb-4">
        <select
          value={selectedResume}
          onChange={(e) => setSelectedResume(e.target.value)}
          className="border border-red-500 p-3 rounded-lg w-full appearance-none"
        >
          <option value="">Select Resume</option>
          {resumes.map((res, idx) => (
            <option key={idx} value={res}>
              {res}
            </option>
          ))}
        </select>
        {/* Custom down arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <AiOutlineCheckCircle className="text-gray-700" size={20} />
        </div>
      </div>
      <h4 className="mb-2 text-center text-xl">Or upload a new resume</h4>
      <div className="bg-gray-100 p-4 rounded-lg text-center flex justify-between items-center my-4">
        <p className="text-sm text-gray-600 mb-2">Upload your resume in PDF or DOCX format:</p>
        <label htmlFor="file" className="bg-red-500 text-white py-2 px-4 rounded cursor-pointer">
          Upload
        </label>
        <input id="file" type="file" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
        {file && <p className="text-gray-600 mt-2">{file.name}</p>}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button onClick={handleNext} className="bg-red-500 text-white py-2 px-4 rounded w-full">
        Next
      </button>
    </div>
  );
};





export default ResumeStep;