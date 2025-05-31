
import React, { useState } from "react";
import CustomSelect from "./CustomSelect";
import JobDescriptionStep from "./JobDescriptionStep";
import { useLanguageStore } from "../store/useLanguageStore"; 

const translations = {
  en: {
    jobTitlePlaceholder: "Select or Write Job Title",
    companyPlaceholder: "Select or Write Job Company",
    selectQuestionCount: "Select a number",
    questionLabel: "questions",
  },
  fr: {
    jobTitlePlaceholder: "Sélectionnez ou écrivez l'intitulé du poste",
    companyPlaceholder: "Sélectionnez ou écrivez le nom de l'entreprise",
    selectQuestionCount: "Sélectionnez un nombre",
    questionLabel: "questions",
  },
};




// Step 2: Job title input
const JobTitleStep = ({ data, onNext, onBack, setData, submit }) => {
  const [jobTitle, setJobTitle] = useState(data.jobTitle || "");
  const [error, setError] = useState("");

  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

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
            placeholder={t.jobTitlePlaceholder}
          />
        </div>

        <div>
          <CustomSelect
            onSelect={(value) => {
              setData({ companyName: value });
            }}
            options={["Amazon", "Google", "Microsoft"]}
            placeholder={t.companyPlaceholder}
          />
        </div>

        <div>
          <select
            className="border border-red-500 text-red-500 rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-3.5"
            value={data?.questionCount || ""}
            onChange={(e) => {
              setData({ ...data, questionCount: parseInt(e.target.value) });
            }}
          >
            <option value="" disabled>
              {t.selectQuestionCount}
            </option>
            {Array.from({ length: 6 }, (_, i) => i + 5).map((num) => (
              <option key={num} value={num}>
                {num} {t.questionLabel}
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
