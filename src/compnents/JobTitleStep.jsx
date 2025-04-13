import React, { useState } from "react";
import CustomSelect from "./CustomSelect";
import JobDescriptionStep from "./JobDescriptionStep";
// Step 2: Job title input.
const JobTitleStep = ({ data, onNext, onBack, setData, submit }) => {
  const [jobTitle, setJobTitle] = useState(data.jobTitle || "");
  const [error, setError] = useState("");



  return (
    <div className="text-blue-900">
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-2">
        <div>
          <CustomSelect
            onSelect={(value) => {
              setJobTitle(value);
              setData({ jobTitle: value });
            }}
            options={["Software Devloper", "CFO", "Sales Manager"]}
            placeholder="Select or Write Job Title"
          />
        </div>
        <div>
          <CustomSelect
            onSelect={(value) => {
              //add company name to data
              setData({ companyName: value });

            }}
            options={["Amazon", "Google", "Microsoft"]}
            placeholder="Select or Write Job Company"
          />
        </div>
        <div>

          <select
            className=" border  border-red-500 text-red-500  rounded-lg focus:ring-red-500 
               focus:border-red-500 block w-full p-3.5"
          >
            <option value="" disabled selected>Select a number</option>
            {Array.from({ length: 6 }, (_, i) => i + 5).map((num) => (
              <option onSelect={() => {
                setData({ questionCount: num });
              }} key={num} value={num}>
                {num} questions
              </option>
            ))}
          </select>
        </div>


      </div>
      <JobDescriptionStep
        data={data}
        onNext={onNext}
        onBack={onBack}
        handlesubmit={submit}
        title={jobTitle}
      />
    </div>
  );
};
export default JobTitleStep;
