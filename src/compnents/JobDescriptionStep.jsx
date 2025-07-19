import React, { useState } from "react";
import { showError } from '../utils/toast.jsx';
import { useLanguageStore } from "../store/useLanguageStore";


const JobDescriptionStep = ({ data, onNext, onBack, title }) => {
  const [jobDescription, setJobDescription] = useState(data.jobDescription || "");
  const [error, setError] = useState("");

  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  // Helper function to count words in a string
  const countWords = (text) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  const wordCount = countWords(jobDescription);

  const handleNext = () => {
    if (!title.trim() || !data.questionCount || data.questionCount < 5) {
      showError(t.jobDescriptionError);
      return;
    }
    onNext({ jobDescription });
  };

  return (
    <div className="p-4 my-4 bg-white">
      <p className="mb-2 text-gray-700">
        {t.jobDescriptionLabel}
      </p>

      <div className="relative mb-2">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder={t.jobDescriptionPlaceholder}
          className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={8}
        ></textarea>
      </div>

      <div className="flex justify-end text-sm mb-4">
        <span className={`${wordCount < 100 ? "text-red-500" : "text-gray-500"}`}>
          {wordCount} / 2000 {t.wordCountLabel}
        </span>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
        >
          {t.backButton}
        </button>
        <button
          onClick={handleNext}
          className="bg-primary text-white py-2 px-4 rounded hover:bg-red-600"
        >
          {t.nextButton}
        </button>
      </div>
    </div>
  );
};

export default JobDescriptionStep;


const translations = {
  en: {
    jobDescriptionLabel: "Add or update job description (must be at least 100 words). You can include details about your role and expertise.",
    jobDescriptionPlaceholder: "Job Description (min 100 words)",
    wordCountLabel: "words",
    backButton: "Back",
    nextButton: "Next",
    jobDescriptionError: "Please add Job title and No. of questions – it is required!",
  },
  fr: {
    jobDescriptionLabel: "Ajoutez ou mettez à jour la description du poste (au moins 100 mots). Vous pouvez inclure des détails sur votre rôle et votre expertise.",
    jobDescriptionPlaceholder: "Description du poste (minimum 100 mots)",
    wordCountLabel: "mots",
    backButton: "Retour",
    nextButton: "Suivant",
    jobDescriptionError: "Veuillez ajouter l'intitulé du poste et le nombre de questions – requis!",
  },
};