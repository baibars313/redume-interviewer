import axios from "axios";
import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { API_URL } from "./constant";
import { useAuthApi } from "../hooks/useAuthapi";
import { useAuthStore } from "../store/useAuthstore";

// Step 1: Resume selection or upload.
const ResumeStep = ({ data, onNext }) => {
  const [selectedResume, setSelectedResume] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const api = useAuthApi();
  const userId  = useAuthStore((state) => state.userId);

  // Dummy list of resumes for the select dropdown.
  const [resumes, setResumes] = useState([]);

  const handleNext = () => {
    if (!selectedResume && !file) {
      setError("Please select an existing resume or upload a new one.");
      return;
    }
    setError("");
    onNext({ resume: selectedResume || file, previousSelected: selectedResume !== "" });
  };

  const getResumes = async () => {
    try {
      const response = await api.get(`/api/sessions/?limit=5&user_id=${userId}`);
      console.log(response);
      setResumes(response.data.results);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      
    }
  };

  useEffect(() => {
    getResumes();
  }, []);

  return (
    <div className="text-gray-900">
      <p className="mb-2">Select an already uploaded resume:</p>
      <div className="relative w-full mb-4">
        <select
          value={selectedResume}
          onChange={(e) => {
            setSelectedResume(e.target.value);
            // Clear file if a resume is selected.
            if (file) {
              setFile(null);
            }
          }}
          className="border border-red-500 p-3 rounded-lg w-full appearance-none"
        >
          <option value="">Select Resume</option>
          {resumes.map((res, idx) => (
            <option key={idx} value={res.resume}>
              {res.resume}
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
        <p className="text-sm text-gray-600 mb-2">
          Upload your resume in PDF or DOCX format:
        </p>
        <label
          htmlFor="file"
          className="bg-primary text-white py-2 px-4 rounded cursor-pointer"
        >
          Upload
        </label>
        <input
          id="file"
          type="file"
          onChange={(e) => {
            const uploadedFile = e.target.files[0];
            setFile(uploadedFile);
            // Clear resume selection if a file is uploaded.
            if (selectedResume) {
              setSelectedResume("");
            }
          }}
          className="hidden"
        />
      </div>
      {file && (
        <p className="text-gray-600 mt-2 text-center my-4">{file.name}</p>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleNext}
        className="bg-primary text-white py-2 px-4 rounded w-full"
      >
        Next
      </button>
    </div>
  );
};

export default ResumeStep;
