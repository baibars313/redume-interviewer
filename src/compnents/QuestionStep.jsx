import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { API_URL } from "./constant";
import AudioRecorder from "./Recorder";
import SessionSummary from "./Details";
import { useAuthApi } from "../hooks/useAuthapi";
import { useAuthStore } from "../store/useAuthstore";

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
  const api=useAuthApi()
  const userId = useAuthStore((state) => state.userId);

  // Generate questions and create a session.
  // Clear previous audioBlob on new session.
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

      const response = await api.post(`/generate_questions/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSessionId(uuid);
      console.log(response)
     
        setQuestions(response.data.questions);
        
     
      
      
      
      
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Failed to generate questions. Please try again.");
    }
    setLoadingQuestions(false);
   
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  // Handle answer submission.
  const handleSubmitAnswer = async () => {
    if (!audioBlob) {
      setError("No recorded answer found. Please record your answer first.");
      return;
    }
    setAddingQuestion(true);
    setError("");
    setFeedback("");
    try {
      // Transcribe audio.
      const formDataTranscription = new FormData();
      formDataTranscription.append("answer", audioBlob, `answer_${sessionId}_${currentQuestionIndex}.webm`);
      const transcriptionResponse = await api.post(
        `/transcribe_audio/`,
        formDataTranscription,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Submit answer with transcript.
      const formDataSubmission = new FormData();
      formDataSubmission.append("question_id", questions[currentQuestionIndex].id);
      formDataSubmission.append("answer", audioBlob, `answer_${sessionId}_${currentQuestionIndex}.webm`);
      formDataSubmission.append("transcript", transcriptionResponse.data.audio_text);
      await api.post(`/api/questions/`, formDataSubmission, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Clear recording state.
      setAudioBlob(null);

      // If this is the last question, fetch feedback; otherwise, move to the next question.
      if (currentQuestionIndex === questions.length - 1) {
        const qsResponse = await api.get(
          `/api/questions/?limit=${questions.length}&session_id=${sessionId}`
        );
        const allQuestions = qsResponse.data.results.map(item => item.question);
        const allTranscripts = qsResponse.data.results.map(item => item.transcript);
        await api.post(`/ai_feedback/`, {
          session_id: sessionId,
          questions: allQuestions,
          answers: allTranscripts,
        });

        const sessionSummaryResp = await api.get(`/api/session/${sessionId}/`);
        setFeedback(sessionSummaryResp.data);
        setCompleted(true);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error processing answer:", err);
      setError("Failed to process answer. Please record your answer again and resubmit.");
      setAudioBlob(null);
    } finally {
      setAddingQuestion(false);
    }
  };

  // Refresh the entire session.
  const handleRetryAll = () => {
    setError("");
    setQuestions([]);
    setSessionId("");
    setCurrentQuestionIndex(0);
    setAudioBlob(null);
    generateQuestions();
  };

  // Handle manual session end.
  const handleConfirmEnd = () => {
    setCompleted(true);
    setShowEndModal(false);
    setAudioBlob(null);
  };

  const controlsDisabled = completed;
  useEffect(() => {
    console.log(data)
  }
    , []);
  return (
    <>
      {completed ? (
       <div>
         <div className="flex justify-start">
          <button className="bg-primary text-white py-2 px-4 rounded hover:bg-red-600 transition" onClick={onBack}>
            Go Back
          </button>
         </div>
         <SessionSummary sessionId={sessionId} feedback={feedback} />
       </div>
      ) : (
        <div className="flex justify-center items-center flex-col mt-4">
          {/* Cross Icon as End Session Button (visible after session creation) */}


          {sessionId ? (
            <>
              {questions.length === 0 || loadingQuestions ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin text-blue-500 mr-2" size={24} />
                </div>
              ) : (
               <div className="flex justif-center items-center">
                 <div className="">
                  {sessionId && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowEndModal(true)}
                        className="text-gray-600 hover:text-gray-800 transition"
                      >
                        <FaTimes className="text-red-500 border border-red-500 rounded-full" size={20} />
                      </button>
                    </div>
                  )}
                  <p className="mb-2 font-medium text-center transition-all duration-500 ease-in-out">
                    Question {currentQuestionIndex + 1} of {questions.length}: {questions[currentQuestionIndex].question}
                  </p>

                  {/* Audio Recorder with built-in countdown */}
                  <AudioRecorder question={questions[currentQuestionIndex]} audioBlob={audioBlob} setAudioBlob={setAudioBlob} />

                  <div className="my-2">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!audioBlob || controlsDisabled}
                      className={`bg-primary text-white py-2 px-4 rounded transition flex justify-center items-center w-full text-center ${!audioBlob || controlsDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-600"
                        }`}
                    >
                      {addingQuestion ? (
                        <FaSpinner className="animate-spin text-white mr-2" size={24} />
                      ) : (
                        "Submit Answer"
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="text-red-500 text-center">
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Go Back Button */}
                </div>
               </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center ">
              {loadingQuestions ? (
                <div className="flex items-center">
                  <FaSpinner className="animate-spin text-blue-500 mr-2" size={24} />
                  <p className="text-blue-900 mb-4">Creating session...</p>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={generateQuestions}
                    className="bg-primary text-white py-2 px-4 rounded hover:bg-red-600 transition"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}

          {/* End Session Modal */}
          {showEndModal && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg z-999  ">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <p className="mb-4 font-medium">
                  Are you sure you want to end the session? <br />
                  (Any unanswered questions will be lost.)
                </p>
                <div className="flex justify-around">
                  <button
                    onClick={handleConfirmEnd}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                  >
                    Yes, End Session
                  </button>
                  <button
                    onClick={() => setShowEndModal(false)}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                  >
                    No, Continue
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
