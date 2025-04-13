import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { API_URL } from "./constant";
import AudioRecorder from "./Recorder";
import SessionSummary from "./Details";

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
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);

  // Generate questions and create a session
  const generateQuestions = async () => {
    setLoadingQuestions(true);
    setError("");
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
      formData.append("user_id", 1);

      const response = await axios.post(`${API_URL}/generate_questions/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSessionId(uuid);
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

  // Reset timer when question changes and start counting up to 3 minutes.
  useEffect(() => {
    // When the current question changes, reset the timer.
    setTimeElapsed(0);
    const timerInterval = setInterval(() => {
      setTimeElapsed(prev => {
        if (prev < 180) { // 3 minutes = 180 seconds
          return prev + 1;
        } else {
          clearInterval(timerInterval);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [currentQuestionIndex]);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  // Handle answer submission. On error, clear audioBlob to allow re-recording.
  const handleSubmitAnswer = async () => {
    if (!audioBlob) {
      setError("No recorded answer found. Please record your answer first.");
      return;
    }
    setAddingQuestion(true);
    setError("");
    setFeedback("");
    try {
      // Transcribe audio
      const formDataTranscription = new FormData();
      formDataTranscription.append("answer", audioBlob, `answer_${sessionId}_${currentQuestionIndex}.webm`);
      const transcriptionResponse = await axios.post(
        `${API_URL}/transcribe_audio/`,
        formDataTranscription,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Submit question answer with transcript
      const formDataSubmission = new FormData();
      formDataSubmission.append("question_id", questions[currentQuestionIndex].id);
      formDataSubmission.append("answer", audioBlob, `answer_${sessionId}_${currentQuestionIndex}.webm`);
      formDataSubmission.append("transcript", transcriptionResponse.data.audio_text);
      await axios.post(`${API_URL}/api/questions/`, formDataSubmission, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Clear the blob and stop the timer for the current question
      setAudioBlob(null);

      // If this is the last question, fetch feedback; otherwise proceed to next question.
      if (currentQuestionIndex === questions.length - 1) {
        const qsResponse = await axios.get(
          `${API_URL}/api/questions/?limit=${questions.length}&session_id=${sessionId}`
        );
        const allQuestions = qsResponse.data.results.map((item) => item.question);
        const allTranscripts = qsResponse.data.results.map((item) => item.transcript);
        await axios.post(`${API_URL}/ai_feedback/`, {
          session_id: sessionId,
          questions: allQuestions,
          answers: allTranscripts,
        });

        // Optionally, you might need an additional API call to fetch final session details.
        const sessionSummaryResp = await axios.get(`${API_URL}/api/session/${sessionId}/`);
        setFeedback(sessionSummaryResp.data);
        setCompleted(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error processing answer:", err);
      setError("Failed to process answer. Please record your answer again and resubmit.");
      // Clear the existing recorded answer to allow re-recording.
      setAudioBlob(null);
    } finally {
      setAddingQuestion(false);
    }
  };

  // Function to refresh the entire session (if needed).
  const handleRetryAll = () => {
    setError("");
    setQuestions([]);
    setSessionId("");
    setCurrentQuestionIndex(0);
    generateQuestions();
  };

  // Handle the end-session modal confirm action
  const handleConfirmEnd = () => {
    // You may choose to call an API to mark session completed early.
    // For this example, we simply mark it as complete to display the session summary.
    setCompleted(true);
    setShowEndModal(false);
  };

  const controlsDisabled = completed;

  return (
    <>
      {completed ? (
        <SessionSummary sessionId={sessionId} feedback={feedback} />
      ) : (
        <div className="relative">
          {/* End Session Button */}
          <div className="absolute top-0 right-0 m-4">
            <button
              onClick={() => setShowEndModal(true)}
              className="bg-gray-600 text-white py-1 px-3 rounded hover:bg-gray-700 transition"
            >
              End Session
            </button>
          </div>

          {sessionId ? (
            <>
              {questions.length === 0 || loadingQuestions ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin text-blue-500 mr-2" size={24} />
                </div>
              ) : (
                <div>
                  <p className="mb-2 font-medium text-center transition-all duration-500 ease-in-out">
                    Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].question}
                  </p>

                  {/* Timer and progress bar */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-64 bg-gray-300 h-4 rounded-lg overflow-hidden">
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: `${(timeElapsed / 180) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-mono">
                      {formatTime(timeElapsed)} / 03:00
                    </span>
                  </div>

                  <AudioRecorder audioBlob={audioBlob} setAudioBlob={setAudioBlob} />

                  <div className="my-2">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!audioBlob || controlsDisabled}
                      className={`bg-primary text-white py-2 px-4 rounded transition flex justify-center items-center w-full text-center ${
                        !audioBlob || controlsDisabled
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
                      {/* The user may re-record their answer then press "Submit Answer" to resubmit */}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              {loadingQuestions ? (
                <div className="flex items-center">
                  <FaSpinner className="animate-spin text-blue-500 mr-2" size={24} />
                  <p className="text-blue-900 mb-4">Creating session...</p>
                </div>
              ) : (
                <button
                  onClick={generateQuestions}
                  className="bg-primary text-white py-2 px-4 rounded hover:bg-red-600 transition"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* End Session Modal */}
          {showEndModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <p className="mb-4 font-medium">
                  Are you sure you want to end the session?{" "}
                  <br />
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
