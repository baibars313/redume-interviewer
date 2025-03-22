import axios from "axios";
import React, { useState, useEffect } from "react";
import {FaSpinner } from "react-icons/fa";
import FeedBack from "./FeedBack";
import { API_URL } from "./constant";
import AudioRecorder from "./Recorder";
import SessionSummary from "./Details";
// Displays the current question with a simple fade-in transition




const QuestionStep = ({ data, onNext, onBack }) => {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [error, setError] = useState("")
  const [audioBlob, setAudioBlob] = useState(null)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [addingQuestion, setAddingQuestion] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Generate questions and create a session
  const generateQuestions = async () => {
    setLoadingQuestions(true)
    setError("")
    try {
      const uuid = crypto.randomUUID()
      const formData = new FormData()
      if (data.previousSelected) {
        formData.append("s3_ref", data.resume)
      } else {
        formData.append("pdf_file", data.resume)
      }
      formData.append("job_description", data.jobDescription)
      formData.append("job_title", data.jobTitle)
      formData.append("num_questions", 2)
      formData.append("session_id", uuid)
      formData.append("user_id", 1)

      const response = await axios.post(`${API_URL}/generate_questions/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setSessionId(uuid)
      setQuestions(response.data.questions)
    } catch (err) {
      console.error("Error generating questions:", err)
      setError("Failed to generate questions. Please try again.")
    }
    setLoadingQuestions(false)
  }

  useEffect(() => {
    generateQuestions()
  }, [])

  // Submit the recorded answer using the audioBlob provided by AudioRecorder.
  const handleSubmitAnswer = async () => {
    if (!audioBlob) {
      setError("No recorded answer found. Please record your answer first.")
      return
    }
    setAddingQuestion(true)
    setError("")
    setFeedback("")
    try {
      // Transcribe audio
      const formDataTranscription = new FormData()
      formDataTranscription.append("answer", audioBlob, `answer_${sessionId}_${currentQuestionIndex}.webm`)
      const transcriptionResponse = await axios.post(
        `${API_URL}/transcribe_audio/`,
        formDataTranscription,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      // Submit question answer with transcript
      const formDataSubmission = new FormData()
      formDataSubmission.append("question_id", questions[currentQuestionIndex].id)
      formDataSubmission.append("answer", audioBlob, `answer_${sessionId}_${currentQuestionIndex}.webm`)
      formDataSubmission.append("transcript", transcriptionResponse.data.audio_text)
      await axios.post(`${API_URL}/api/questions/`, formDataSubmission, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Clear the blob for the next question
      setAudioBlob(null)

      // If last question, fetch feedback; otherwise, proceed to next
      if (currentQuestionIndex === questions.length - 1) {
        const qsResponse = await axios.get(
          `${API_URL}/api/questions/?limit=${questions.length}&session_id=${sessionId}`
        )
        const allQuestions = qsResponse.data.results.map((item) => item.question)
        const allTranscripts = qsResponse.data.results.map((item) => item.transcript)
        const aiFeedbackResponse = await axios.post(`${API_URL}/ai_feedback/`, {
          session_id: sessionId,
          questions: allQuestions,
          answers: allTranscripts,
        })
        
        const session_summary=axios.get(`${API_URL}/api/session/${sessionId}/`)
        setFeedback(session_summary.data)
        setCompleted(true)
      } else {
        setCurrentQuestionIndex((prev) => prev + 1)
      }
    } catch (err) {
      console.error("Error processing answer:", err)
      setError("Failed to process answer. Please try again.")
    } finally {
      setAddingQuestion(false)
    }
  }

  const handleRetryAll = () => {
    setError("")
    setQuestions([])
    setSessionId("")
    setCurrentQuestionIndex(0)
    generateQuestions()
  }

  const controlsDisabled = completed

  return (
    <>
    {completed ? (
       <SessionSummary sessionId={sessionId} />
    ) : (
      <div>
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
              <AudioRecorder audioBlob={audioBlob} setAudioBlob={setAudioBlob} />
              <div className="my-2">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!audioBlob || controlsDisabled}
                  className={`bg-red-500 text-white py-2 px-4 rounded transition flex justify-center items-center w-full text-center ${
                    !audioBlob || controlsDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
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
                  <button onClick={handleRetryAll} className="underline">
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
        <div className="flex flex-col items-center justify-center">
          {loadingQuestions ? (
            <div className="flex items-center">
              <FaSpinner className="animate-spin text-blue-500 mr-2" size={24} />
              <p className="text-blue-900 mb-4">Creating session...</p>
            </div>
          ) : (
            <button
              onClick={generateQuestions}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Retry
            </button>
          )}
        </div>
        </>
      )}
      {/* Optionally, display feedback when completed */}
     
    </div>
    )}
   
    </>
  )
}

export default QuestionStep

