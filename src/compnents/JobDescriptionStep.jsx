import React, { useState } from "react";
import { showError } from '../utils/toast.jsx';
import { useLanguageStore } from "../store/useLanguageStore";

const JobDescriptionStep = ({ data, onNext, onBack, title }) => {
  const [jobDescription, setJobDescription] = useState(data.jobDescription || "");
  const [error, setError] = useState("");

  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  const handleNext = () => {
    if (!title.trim() || !data.questionCount || data.questionCount < 5) {
      showError(t.jobDescriptionError);
      return;
    }
    if (jobDescription.length > 2000) {
      showError('Job description can be max 2000 characters.');
      return;
    }
    onNext({ jobDescription });
  };

  return (
    <div>
      <label className="block mb-2 text-gray-700 font-medium">{t.jobDescriptionLabel}</label>
      <textarea
        value={jobDescription}
        onChange={e => setJobDescription(e.target.value)}
        maxLength={2000}
        placeholder={t.jobDescriptionPlaceholder}
        className="w-full border rounded p-2"
      />
      <div className="text-right text-xs text-gray-500">{jobDescription.length}/2000</div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button onClick={handleNext}>{t.nextButton}</button>
    </div>
  );
};

export default JobDescriptionStep;

const translations = {
  en: {
    jobDescriptionLabel: "Add or update job description (max 2000 characters). You can include details about your role and expertise.",
    jobDescriptionPlaceholder: "Job Description (max 2000 characters)",
    wordCountLabel: "characters",
    backButton: "Back",
    nextButton: "Next",
    jobDescriptionError: "Please add Job title and No. of questions – it is required!",
  },
  fr: {
    jobDescriptionLabel: "Ajoutez ou mettez à jour la description du poste (2000 caractères maximum). Vous pouvez inclure des détails sur votre rôle et votre expertise.",
    jobDescriptionPlaceholder: "Description du poste (2000 caractères max)",
    wordCountLabel: "caractères",
    backButton: "Retour",
    nextButton: "Suivant",
    jobDescriptionError: "Veuillez ajouter l'intitulé du poste et le nombre de questions – requis!",
  },
};