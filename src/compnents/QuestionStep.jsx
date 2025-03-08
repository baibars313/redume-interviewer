import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";

const QuestionStep = ({ data, onNext, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [recordedAnswer, setRecordedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper function to format seconds to mm:ss.
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Simulate fetching questions from an API.
  useEffect(() => {
    setTimeout(() => {
      setQuestions([
        { id: 1, text: "What are your strengths?" },
        { id: 2, text: "What are your weaknesses?" },
        { id: 3, text: "Where do you see yourself in 5 years?" },
      ]);
    }, 500);
  }, []);

  // Timer effect to simulate max recording duration of 3 minutes.
  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 180) {
            // Auto-stop recording after 3 minutes.
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const handleStartRecording = () => {
    setRecording(true);
    setTimer(0);
    setError("");
    setRecordedAnswer(null);
    // Start the actual microphone recording here.
  };

  const handleStopRecording = () => {
    if (!recording) return;
    setRecording(false);
    // Simulate capturing the recorded answer.
    const answer = `Recorded answer for question ${questions[currentQuestionIndex].id}`;
    setRecordedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!recordedAnswer) {
      setError("No recorded answer found. Please record your answer first.");
      return;
    }
    setError("");
    // Simulate sending the answer to an API.
    setFeedback(`Answer for question ${questions[currentQuestionIndex].id} submitted successfully.`);
    // After a brief delay, move to the next question.
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setFeedback("");
        setRecordedAnswer(null);
        setTimer(0);
      } else {
        // Simulate receiving a session ID after the last question.
        setSessionId("SESSION12345");
      }
    }, 1000);
  };

  const handleNextStep = () => {
    if (sessionId) {
      onNext({ questions, sessionId });
    } else {
      setError("Please complete the question recordings and submit your answers.");
    }
  };

  const createSession = async () => {
    const uuid = crypto.randomUUID();
    setLoading(true);
    try {
      // Create a FormData object and append all the necessary fields
      const formData = new FormData();
      formData.append("session_id", uuid);
      formData.append("job_description", data.jobDescription);
      formData.append("user_id", 1);
      formData.append("title", data.jobTitle);
      formData.append("resume", data.resume);

      // Send the POST request with multipart/form-data headers
      const response = await axios.post("http://127.0.0.1:8000/api/sessions/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSessionId(response.data.session_id);
    } catch (error) {
      setError("Failed to create session. Please try again.");
      console.log(error);
    }
    setLoading(false);
  };



  return (
    <div>
      {sessionId ?
        <>
          {questions.length === 0 ? (
            <p>Loading questions...</p>
          ) : sessionId ? (
            <div>
              <p className="mb-4">
                All questions answered. Session ID: <span className="font-bold">{sessionId}</span>
              </p>
              <button
                onClick={handleNextStep}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
              >
                Submit & Finish
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-2 font-medium text-center">
                Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].text}
              </p>
              <div className="flex items-center space-x-4 mb-4 justify-between">
                <button
                  onClick={handleStartRecording}
                  disabled={recording}
                  className={`flex items-center bg-green-500 text-white py-2 px-4 rounded transition ${recording ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
                    }`}
                >
                  <FaMicrophone className="mr-2" /> Start Recording
                </button>
                <button
                  onClick={handleStopRecording}
                  disabled={!recording}
                  className={`flex items-center bg-red-500 text-white py-2 px-4 rounded transition ${!recording ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
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
                  {recording
                    ? formatTime(timer)
                    : recordedAnswer
                      ? "Recording stopped."
                      : "Not recording."}
                </span>
              </div>
              <div className="my-2">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={recording || !recordedAnswer}
                  className={`bg-red-500 text-white py-2 px-4 rounded transition w-full ${recording || !recordedAnswer ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
                    }`}
                >
                  Submit Answer
                </button>
              </div>
              {feedback && <p className="text-green-500 mb-4">{feedback}</p>}
            </div>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </> :
        <div className="flex flex-col items-center justify-center">

          {loading ? (
            <p className="text-blue-900 mb-4">Creating session...</p>
          ) : (
            <button
              onClick={createSession}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            >
              {loading ? "Creating session..." : "Retry"}
            </button>
          )}
        </div>
      }

    </div>
  );
};

export default QuestionStep;
