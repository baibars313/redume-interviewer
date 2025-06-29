import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useAuthApi } from "../hooks/useAuthapi";
import { useAuthStore } from "../store/useAuthstore"; 
import { useLanguageStore } from "../store/useLanguageStore"; 
import { Step1Translations } from "./constant";   // ✅ translation map

const ResumeStep = ({ data, onNext }) => {
  const [selectedResume, setSelectedResume] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [resumes, setResumes] = useState([]);

  const api = useAuthApi();
  const userId = useAuthStore((state) => state.userId);

  const language = useLanguageStore((state) => state.language); // ✅ get current language
  const t = Step1Translations[language]; // ✅ shortcut to translated labels

  const handleNext = () => {
    if (!selectedResume && !file) {
      setError(t.resumeError);
      return;
    }
    setError("");
    onNext({ resume: selectedResume || file, previousSelected: selectedResume !== "" });
  };

  const getResumes = async () => {
    try {
      const response = await api.get(`/api/sessions/?limit=5&user_id=${userId}`);
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
      <p className="mb-2">{t.selectUploaded}</p>
      <div className="relative w-full mb-4">
        <select
          value={selectedResume}
          onChange={(e) => {
            setSelectedResume(e.target.value);
            if (file) setFile(null);
          }}
          className="border border-red-500 p-3 rounded-lg w-full appearance-none"
        >
          <option value="">{t.selectResume}</option>
          {resumes.map((res, idx) => (
            <option key={idx} value={res.resume}>
              {res.resume}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <AiOutlineCheckCircle className="text-gray-700" size={20} />
        </div>
      </div>

      <h4 className="mb-2 text-center text-xl">{t.uploadTitle}</h4>
      <div className="bg-gray-100 p-4 rounded-lg text-center flex justify-between items-center my-4">
        <p className="text-sm text-gray-600 mb-2">{t.uploadPrompt}</p>
        <label
          htmlFor="file"
          className="bg-primary text-white py-2 px-4 rounded cursor-pointer"
        >
          {t.uploadButton}
        </label>
        <input
          id="file"
          type="file"
          onChange={(e) => {
            const uploadedFile = e.target.files[0];
            setFile(uploadedFile);
            if (selectedResume) setSelectedResume("");
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
        {t.next}
      </button>
    </div>
  );
};

export default ResumeStep;
