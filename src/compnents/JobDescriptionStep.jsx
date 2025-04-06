import React, { useState } from "react";
import toast from "react-hot-toast";

const JobDescriptionStep = ({ data, onNext, onBack, title }) => {
  const [jobDescription, setJobDescription] = useState(data.jobDescription || "");
  const [error, setError] = useState("");


  // Helper function to count words in a string
  const countWords = (text) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  const wordCount = countWords(jobDescription);

  const handleNext = () => {
    if (!title.trim()) {
      toast.error('Please add Job title it is required!!')  
      return
    }
    onNext({ jobDescription });
  };

  

  return (
    <div className="p-4 my-4 bg-white ">
      {data.jobDescription && (
        <div className="mb-4">
          {/* <p className="font-bold text-gray-700">Existing Job Description:</p> */}
          {/* Optionally, display the existing description */}
        </div>
      )}

      {/* <PrevousDescription setJobDescription={setJobDescription} /> */}

      <p className="mb-2 text-gray-700">
        Add or update job description (must be at least 100 words). You can include details about your role and expertise.
      </p>
      <div className="relative mb-2">
        <textarea
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
          }}
          placeholder="Job Description (min 100 words)"
          className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={8}
        ></textarea>
       
      </div>
      <div className="flex justify-end text-sm mb-4">
        <span className={`${wordCount < 30 ? "text-red-500" : "text-gray-500"}`}>
          {wordCount} / 100 words
        </span>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobDescriptionStep;
