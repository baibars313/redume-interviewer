// src/i18n/translations.js
export const translations = {
  en: {
    goBack: "Go Back",
    submitAnswer: "Submit Answer",
    retry: "Retry",
    creatingSession: "Creating session...",
    endSession: "Yes, End Session",
    continueSession: "No, Continue",
    confirmEnd: "Are you sure you want to end the session? (Any unanswered questions will be lost.)",
    noAnswerFound: "No recorded answer found. Please record your answer first.",
    processAnswerFailed: "Failed to process answer. Please record your answer again and resubmit.",
    generateFailed: "Failed to generate questions. Please try again.",
  },
  fr: {
    goBack: "Retourner",
    submitAnswer: "Soumettre la réponse",
    retry: "Réessayer",
    creatingSession: "Création de la session...",
    endSession: "Oui, terminer la session",
    continueSession: "Non, continuer",
    confirmEnd: "Voulez-vous vraiment terminer la session ? (Toutes les questions non répondues seront perdues.)",
    noAnswerFound: "Aucune réponse enregistrée trouvée. Veuillez enregistrer votre réponse d'abord.",
    processAnswerFailed: "Échec du traitement de la réponse. Veuillez réenregistrer votre réponse et la soumettre à nouveau.",
    generateFailed: "Échec de la génération des questions. Veuillez réessayer.",
  },
};




import React, { useState, useEffect } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { API_URL } from "./constant";
import AudioRecorder from "./Recorder";
import SessionSummary from "./Details";
import { useAuthApi } from "../hooks/useAuthapi";
import { useAuthStore } from "../store/useAuthstore";
import { useLanguageStore } from "../store/useLanguageStore";


const QuestionStep = ({ data, onNext, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const api = useAuthApi();
  const userId = useAuthStore((state) => state.userId);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  const generateQuestions = async () => {
    setLoadingQuestions(true);
    setError("");
    setAudioBlob(null);
    try {
      const uuid = crypto.randomUUID();
      const formData = new FormData();
      if (data.previousSelected) {
        formData.append("s3_ref", data.resume);
      } else {
        formData.append("pdf_file", data.resume);
      }
      formData.append("job_description", data?.jobDescription);
      formData.append("job_title", data?.jobTitle);
      formData.append("num_questions", data?.questionCount);
      formData.append("company_name", data?.companyName);
      formData.append("session_id", uuid);
      formData.append("user_id", userId);
      formData.append("language", language);

      const response = await api.post(`/generate_questions/?language=${language}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSessionId(uuid);
      setQuestions(response.data.questions);
    } catch (err) {
      console.error("Error generating questions:", err);
      setError(t.generateFailed);
    }
    setLoadingQuestions(false);
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleSubmitAnswer = async () => {
    if (!audioBlob) {
      setError(t.noAnswerFound);
      return;
    }
    setAddingQuestion(true);
    setError("");
    setFeedback("");
    try {
      const formDataTranscription = new FormData();
      formDataTranscription.append("answer", audioBlob, `answer_${sessionId}_${currentQuestionIndex}.webm`);
      formDataTranscription.append("language", language);
      const transcriptionResponse = await api.post(`/transcribe_audio/?language=${language}`, formDataTranscription, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const formDataSubmission = new FormData();
      formDataSubmission.append("question_id", questions[currentQuestionIndex].id);
      formDataSubmission.append("answer", audioBlob, `answer_${sessionId}_${currentQuestionIndex}.webm`);
      formDataSubmission.append("transcript", transcriptionResponse.data.audio_text);
      formDataSubmission.append("language", language);
      await api.post(`/api/questions/`, formDataSubmission, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAudioBlob(null);

      if (currentQuestionIndex === questions.length - 1) {
        const qsResponse = await api.get(`/api/questions/?limit=${questions.length}&session_id=${sessionId}`);
        const allQuestions = qsResponse.data.results.map((item) => item.question);
        const allTranscripts = qsResponse.data.results.map((item) => item.transcript);

        await api.post(`/ai_feedback/?language=${language}`, {
          session_id: sessionId,
          questions: allQuestions,
          answers: allTranscripts,
          language,
        });

        const sessionSummaryResp = await api.get(`/api/session/${sessionId}/`);
        setFeedback(sessionSummaryResp.data);
        setCompleted(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error processing answer:", err);
      setError(t.processAnswerFailed);
      setAudioBlob(null);
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleRetryAll = () => {
    setError("");
    setQuestions([]);
    setSessionId("");
    setCurrentQuestionIndex(0);
    setAudioBlob(null);
    generateQuestions();
  };

  const handleConfirmEnd = () => {
    setCompleted(true);
    setShowEndModal(false);
    setAudioBlob(null);
  };

  const controlsDisabled = completed;

  return (
    <>
      {completed ? (
        <div>
          <div className="flex justify-start">
            <button className="bg-primary text-white py-2 px-4 rounded hover:bg-red-600 transition" onClick={onBack}>
              {t.goBack}
            </button>
          </div>
          <SessionSummary sessionId={sessionId} feedback={feedback} />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col mt-4">
          {sessionId ? (
            <>
              {questions.length === 0 || loadingQuestions ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin text-blue-500 mr-2" size={24} />
                </div>
              ) : (
                <div className="">
                  <div className="flex justify-end">
                    <button onClick={() => setShowEndModal(true)} className="text-gray-600 hover:text-gray-800 transition">
                      <FaTimes className="text-red-500 border border-red-500 rounded-full" size={20} />
                    </button>
                  </div>
                  <p className="mb-2 font-medium text-center">
                    Question {currentQuestionIndex + 1} of {questions.length}: {questions[currentQuestionIndex].question}
                  </p>
                  <AudioRecorder question={questions[currentQuestionIndex]} audioBlob={audioBlob} setAudioBlob={setAudioBlob} />
                  <div className="my-2">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!audioBlob || controlsDisabled}
                      className={`bg-primary text-white py-2 px-4 rounded transition flex justify-center items-center w-full text-center ${!audioBlob || controlsDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
                    >
                      {addingQuestion ? <FaSpinner className="animate-spin text-white mr-2" size={24} /> : t.submitAnswer}
                    </button>
                  </div>
                  {error && <div className="text-red-500 text-center"><p>{error}</p></div>}
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center">
              {loadingQuestions ? (
                <div className="flex items-center">
                  <FaSpinner className="animate-spin text-blue-500 mr-2" size={24} />
                  <p className="text-blue-900 mb-4">{t.creatingSession}</p>
                </div>
              ) : (
                <button onClick={generateQuestions} className="bg-primary text-white py-2 px-4 rounded hover:bg-red-600 transition">
                  {t.retry}
                </button>
              )}
            </div>
          )}

          {showEndModal && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg z-999">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <p className="mb-4 font-medium">{t.confirmEnd}</p>
                <div className="flex justify-around">
                  <button onClick={handleConfirmEnd} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition">
                    {t.endSession}
                  </button>
                  <button onClick={() => setShowEndModal(false)} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                    {t.continueSession}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default QuestionStep;