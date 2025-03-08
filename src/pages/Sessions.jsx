import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalculator } from "react-icons/fa";
import { API_URL } from "../compnents/constant";

const SessionTable = () => {
  const initialUrl = `${API_URL}/api/sessions/?limit=10&offset=0`;
  const [sessionsData, setSessionsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Helper to enforce HTTPS and create absolute URLs.
  const getAbsoluteUrl = (url) => {
    if (!url) return null;
    try {
      let absoluteUrl = new URL(url, API_URL).href;
      if (absoluteUrl.startsWith("http://")) {
        absoluteUrl = absoluteUrl.replace("http://", "https://");
      }
      return absoluteUrl;
    } catch (e) {
      return url;
    }
  };

  // Function to fetch session data from the API
  const fetchData = (url) => {
    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        setSessionsData(response.data.results);
        setNextPageUrl(response.data.next ? getAbsoluteUrl(response.data.next) : null);
        setPrevPageUrl(response.data.previous ? getAbsoluteUrl(response.data.previous) : null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sessions data: ", error);
        setLoading(false);
      });
  };

  // Fetch session data when currentUrl changes.
  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  // Update API endpoint when search term changes.
  useEffect(() => {
    let url = `${API_URL}/api/sessions/?limit=10&offset=0`;
    if (searchTerm.trim() !== "") {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    setCurrentUrl(url);
  }, [searchTerm]);

  // Function to fetch questions for a given session id.
  const fetchQuestions = (sessionId) => {
    setLoadingQuestions(true);
    axios
      .get(`${API_URL}/api/questions/?session_id=${selectedSession.session_id}`)
      .then((response) => {
        setSessionQuestions(response.data.results);
        setLoadingQuestions(false);
      })
      .catch((error) => {
        console.error("Error fetching questions: ", error);
        setLoadingQuestions(false);
      });
  };

  // Modal handling.
  const openModal = (session) => {
    setSelectedSession(session);
    // Fetch questions using the session's id.
    fetchQuestions(session.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSession(null);
    setSessionQuestions([]);
  };

  // Handlers for API-driven pagination.
  const handleNextPage = () => {
    if (nextPageUrl) {
      setCurrentUrl(nextPageUrl);
    }
  };

  const handlePrevPage = () => {
    if (prevPageUrl) {
      setCurrentUrl(prevPageUrl);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-4 rounded-lg shadow-lg mt-6 lg:max-w-[80vw] sm:w-full md:w-3/4 lg:2/3 mx-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-2xl font-bold text-red-500 mb-2 md:mb-0">Sessions</h2>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title or session id..."
              className="border border-red-500 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <svg
              className="w-5 h-5 absolute top-3 right-3 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        {loading ? (
          <div className="text-center text-red-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-black">
              <thead className="text-xs uppercase bg-red-600 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Session ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessionsData && sessionsData.length > 0 ? (
                  sessionsData.map((session, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-red-50">
                      <td className="px-6 py-4">{session.title}</td>
                      <td className="px-6 py-4">{session.session_id}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openModal(session)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center">
                      No sessions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* API-Driven Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={!prevPageUrl}
            className={`py-2 px-4 rounded ${
              !prevPageUrl
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={!nextPageUrl}
            className={`py-2 px-4 rounded ${
              !nextPageUrl
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
        {/* Modal for Session Details */}
        {showModal && selectedSession && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={closeModal}
            ></div>
            <div className="bg-white rounded-lg shadow-lg p-6 relative max-h-screen overflow-y-auto w-11/12 md:w-2/3">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl font-bold"
              >
                &times;
              </button>
              <div className="flex items-center mb-4">
                <FaCalculator className="text-red-500 mr-2 text-3xl" />
                <h3 className="text-2xl font-bold text-red-500">Session Details</h3>
              </div>
              <div className="mb-4 border-b pb-2">
                <p>
                  <span className="font-semibold">Job Description:</span>{" "}
                  {selectedSession.job_description}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Resume:</span>{" "}
                  {selectedSession.resume}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Active:</span>{" "}
                  {selectedSession.is_active ? "Yes" : "No"}
                </p>
              </div>
              {/* Questions & Answers Section */}
              {loadingQuestions ? (
                <div className="text-center text-red-500">Loading questions...</div>
              ) : (
                sessionQuestions &&
                sessionQuestions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xl font-bold text-red-500 mb-2">
                      Questions & Answers
                    </h4>
                    {sessionQuestions.map((question, index) => (
                      <div key={index} className="mb-4 border p-2 rounded">
                        <p className="font-semibold">Q: {question.question}</p>
                        {question.transcript && (
                          <p className="mt-1">Transcript: {question.transcript}</p>
                        )}
                        {question.answer && (
                          <div className="mt-1">
                            <audio controls>
                              <source
                                src={getAbsoluteUrl(question.answer)}
                                type="audio/webm"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionTable;
