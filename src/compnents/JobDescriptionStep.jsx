import React, { useState } from "react";
import PrevousDescription from "./PrevousDescription";
// Step 3: Job description (optional) with existing text shown (if available).
const JobDescriptionStep = ({ data, onNext, onBack, handlesubmit }) => {
  const [jobDescription, setJobDescription] = useState(data.jobDescription || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    // Job description is optional.
    onNext({ jobDescription });
  };

  return (
    <div> 
      {data.jobDescription && (
        <div className="mb-4">
          <p className="font-bold">Existing Job Description:</p>
        
        </div>
      )}
        <PrevousDescription setJobDescription={setJobDescription} />
      <p className="mb-2">Add or update job description (optional):</p>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Job Description"
        className="border border-red-500 p-2 w-full mb-4 rounded-lg"
        rows={4}
      ></textarea>
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
export default JobDescriptionStep;