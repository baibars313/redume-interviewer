import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaStop, FaSpinner } from "react-icons/fa";
import FeedBack from "./FeedBack";
import { API_URL } from "./constant";
// Displays the current question with a simple fade-in transition
const QuestionDisplay = ({ question, index }) => (
  <p className="mb-2 font-medium text-center transition-all duration-500 ease-in-out">
    Question {index + 1}: {question}
  </p>
);

// Handles recording buttons and timer display with a red ping dot animation
const RecordingControls = ({
  recording,
  onStart,
  onStop,
  timer,
  formatTime,
  recordedAnswer,
  disabled,
}) => (
  <>
    <div className="flex items-center space-x-4 mb-4 justify-between">
      <button
        onClick={onStart}
        disabled={recording || disabled}
        className={`flex items-center bg-green-500 text-white py-2 px-4 rounded transition ${recording || disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
          }`}
      >
        <FaMicrophone className="mr-2" /> Start Recording
      </button>
      <button
        onClick={onStop}
        disabled={!recording || disabled}
        className={`flex items-center bg-red-500 text-white py-2 px-4 rounded transition ${!recording || disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
          }`}
      >
        <FaStop className="mr-2" /> Stop Recording
      </button>
    </div>
    <div className="flex justify-center items-center mb-4">
      {recording && (
        <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-ping mr-2"></span>
      )}
      <span className="text-white bg-red-500 p-3 shadow rounded-lg text-center">
        {formatTime(timer)}
      </span>
    </div>
  </>
);

// Displays the audio preview if available
const AudioPreview = ({ recordedAnswer }) => {
  if (!recordedAnswer) return null;
  return (
    <div className="mb-4 w-full">
      <audio
        className="w-full border-red-100 border rounded-full shadow"
        controls
        src={recordedAnswer}
      ></audio>
    </div>
  );
};

// The submit answer button
const AnswerSubmitButton = ({ onSubmit, disabled, addingQuestion }) => (
  <div className="my-2">
    <button
      onClick={onSubmit}
      disabled={disabled}
      className={`bg-red-500 text-white py-2 px-4 rounded transition flex justify-center items-center w-full text-center ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
        }`}
    >
      {addingQuestion ? <FaSpinner className="animate-spin text-white mr-2" size={24} /> : "Submit Answer"}
    </button>
  </div>
);

// Displays feedback and error messages with a retry option
const MessageDisplay = ({ feedback, error, onRetry }) => (
  <>
    {feedback && <p className="text-green-500 mb-4">{feedback}</p>}
    {error && (
      <div className="flex flex-col items-center">
        <p className="text-red-500 mt-4">{error}</p>
        <button
          onClick={onRetry}
          className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
        >
          Retry Session & Questions
        </button>
      </div>
    )}
  </>
);

// Shows a loader or retry button when creating a session using an animated spinner
const SessionLoader = ({ loading, createSession }) => (
  <div className="flex flex-col items-center justify-center">
    {loading ? (
      <div className="flex items-center">
        <FaSpinner className="animate-spin text-blue-500 mr-2" size={24} />
        <p className="text-blue-900 mb-4">Creating session...</p>
      </div>
    ) : (
      <button
        onClick={createSession}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
      >
        Retry
      </button>
    )}
  </div>
);

const QuestionStep = ({ data, onNext, onBack }) => {
  // State and refs
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [recordedAnswer, setRecordedAnswer] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [completed, setCompleted] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Helper function to format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer effect for recording duration (max 3 minutes)
  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 180) {
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recording]);

  // Start recording audio
  const handleStartRecording = async () => {
    setError("");
    setRecordedAnswer(null);
    setRecordedBlob(null);
    setTimer(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedBlob(audioBlob);
        setRecordedAnswer(audioUrl);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Microphone permission denied or error accessing microphone.");
    }
  };

  // Stop recording audio
  const handleStopRecording = () => {
    if (!recording) return;
    setRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  // Submit the recorded answer for transcription and question progression
  const handleSubmitAnswer = async () => {
    if (!recordedBlob) {
      setError("No recorded answer found. Please record your answer first.");
      return;
    }
    setAddingQuestion(true);
    setError("");
    setFeedback("");

    try {
      // Transcribe audio
      const formDataTranscription = new FormData();
      formDataTranscription.append("answer", recordedBlob, `answer_${sessionId}_${currentQuestionIndex}.webm`);
      const transcriptionResponse = await axios.post(
        `${API_URL}/transcribe_audio/`,
        formDataTranscription,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Prepare form data for question submission
      const formDataSubmission = new FormData();
      formDataSubmission.append("question", questions[currentQuestionIndex]);
      formDataSubmission.append("audio", recordedBlob, `answer_${sessionId}_${currentQuestionIndex}.webm`);
      formDataSubmission.append("transcript", transcriptionResponse.data.audio_text);
      formDataSubmission.append("session_id", sessionId);

      await axios.post(`${API_URL}/api/questions/`, formDataSubmission, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Clear recorded answer and reset timer
      setRecordedAnswer(null);
      setTimer(0);

      // If it was the last question, fetch all transcripts for feedback and complete the session
      if (currentQuestionIndex === questions.length - 1) {
        const qsResponse = await axios.get(`${API_URL}/api/questions/?limit=${questions.length}&session_id=${sessionId}`);
        const allQuestions = qsResponse.data.results.map((item) => item.question);
        const allTranscripts = qsResponse.data.results.map((item) => item.transcript);
        const aiFeedbackResponse = await axios.post(`${API_URL}/ai_feedback/`, {
          questions: allQuestions,
          answers: allTranscripts,
        });
        console.log(aiFeedbackResponse.data);
        setFeedback(aiFeedbackResponse.data.feedback);
        setCompleted(true);
        
      } else {
        // Move to next question if not the last one
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error processing answer:", err);
      setError("Failed to process answer. Please try again.");
    } finally {
      setAddingQuestion(false);
    }
  };

  // Create a session on the backend with an animated loader
  const createSession = async () => {
    setLoading(true);
    setError("");
    try {
      const uuid = crypto.randomUUID();
      const formData = new FormData();
      formData.append("session_id", uuid);
      formData.append("job_description", data.jobDescription);
      formData.append("user_id", 1);
      formData.append("title", data.jobTitle);
      formData.append("resume", data.resume);

      const response = await axios.post(`${API_URL}/api/sessions/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSessionId(response.data.session_id);
    } catch (err) {
      console.error("Error creating session:", err);
      setError("Failed to create session. Please try again.");
    }
    setLoading(false);
  };

  // Generate interview questions with loader indication
  const generateQuestions = async () => {
    setLoadingQuestions(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("pdf_file", data.resume);
      formData.append("job_description", data.jobDescription);
      formData.append("job_title", data.jobTitle);
      formData.append("num_questions", 2);

      const response = await axios.post(`${API_URL}/generate_questions/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setQuestions(response.data.questions);
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Failed to generate questions. Please try again.");
    }
    setLoadingQuestions(false);
  };

  // Retry both session and question creation
  const handleRetryAll = () => {
    setError("");
    setQuestions([]);
    setSessionId("");
    setCurrentQuestionIndex(0);
    createSession();
    generateQuestions();
  };

  // On mount, create session and generate questions
  useEffect(() => {
    createSession();
    generateQuestions();
  }, []);

  // Disable controls if the process is completed
  const controlsDisabled = completed;

  return (
    <div>
      {sessionId ? (
        <>
          {questions.length === 0 || loadingQuestions ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin text-blue-500 mr-2" size={24} />
            </div>
          ) : (
            <div>
              <QuestionDisplay question={questions[currentQuestionIndex]} index={currentQuestionIndex} />
              <RecordingControls
                recording={recording}
                onStart={handleStartRecording}
                onStop={handleStopRecording}
                timer={timer}
                formatTime={formatTime}
                recordedAnswer={recordedAnswer}
                disabled={controlsDisabled}
              />
              <AudioPreview recordedAnswer={recordedAnswer} />
              <AnswerSubmitButton
                onSubmit={handleSubmitAnswer}
                disabled={recording || !recordedAnswer || controlsDisabled}
                addingQuestion={addingQuestion}
              />
              <MessageDisplay feedback={""} error={error} onRetry={handleRetryAll} />
            </div>
          )}
        </>
      ) : (
        <SessionLoader loading={loading} createSession={createSession} />
      )}
      {completed && <FeedBack isOpen={completed} setIsOpen={setCompleted} text={feedback} />}
    </div>
  );
};

export default QuestionStep;
