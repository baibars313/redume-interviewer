import React, { useState } from "react";
import CustomSelect from "./CustomSelect";
import JobDescriptionStep from "./JobDescriptionStep";
// Step 2: Job title input.
const JobTitleStep = ({ data, onNext, onBack, setData, submit }) => {
  const [jobTitle, setJobTitle] = useState(data.jobTitle || "");
  const [error, setError] = useState("");



  return (
    <div className="text-blue-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-2">
        <div>
          <CustomSelect
            onSelect={(value) => {
              setJobTitle(value);
            }}
            options={["Software Devloper", "CFO", "Sales Manager"]}
            placeholder="Select or Write Job Title"
          />
        </div>
        <div>
          <CustomSelect
            onSelect={(value) => {
              setJobTitle(value);
            }}
            options={["Amazon", "Google", "Microsoft"]}
            placeholder="Select or Write Job Title"
          />
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
