import React, { useState, useEffect, useMemo } from "react";
import { FaCalculator } from "react-icons/fa";

// Define constant session data using useMemo to keep the reference stable.
const useSessionsData = () => {
  return useMemo(() => ([
    {
      jobTitle: "Software Engineer",
      sessionId: "SESSION12345",
      sessionFeedback:
        "Overall, your responses were excellent. Consider refining your technical presentation.",
      details: [
        {
          id: 1,
          question: "What are your strengths?",
          answerText:
            "I am skilled in problem-solving and developing scalable software.",
          audioUrl: "https://www.example.com/audio1.mp3",
        },
        {
          id: 2,
          question: "What are your weaknesses?",
          answerText:
            "I sometimes overanalyze details, but I'm working on being more decisive.",
          audioUrl: "https://www.example.com/audio2.mp3",
        },
        {
          id: 3,
          question: "Where do you see yourself in 5 years?",
          answerText: "I aspire to lead a dynamic development team.",
          audioUrl: "https://www.example.com/audio3.mp3",
        },
      ],
    },
    {
      jobTitle: "Product Manager",
      sessionId: "SESSION12346",
      sessionFeedback:
        "Great understanding of product strategy. Continue honing your stakeholder management skills.",
      details: [
        {
          id: 1,
          question: "What is your approach to managing a product?",
          answerText:
            "I focus on user-centric design and iterative development.",
          audioUrl: "https://www.example.com/audio4.mp3",
        },
        {
          id: 2,
          question: "How do you handle difficult stakeholders?",
          answerText:
            "By maintaining clear communication and building trust.",
          audioUrl: "https://www.example.com/audio5.mp3",
        },
      ],
    },
    // ... add more sessions as needed.
  ]), []);
};

const SessionTable = () => {
  // Instead of defining sessionsData inline, we call our custom hook.
  const sessionsData = useSessionsData();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSessions, setFilteredSessions] = useState(sessionsData);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Filter sessions based on the search term.
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSessions(sessionsData);
    } else {
      const filtered = sessionsData.filter(
        (session) =>
          session.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSessions(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, sessionsData]);

  // Pagination calculations.
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(
    indexOfFirstSession,
    indexOfLastSession
  );
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Modal handling.
  const openModal = (session) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSession(null);
  };

  console.log("SessionTable rendered");

  return (
    <div className="p-4  rounded-lg shadow-lg mt-6  max-w-3xl sm:w-full md:w-3/4 lg:2/3 mx-4 " >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-500 mb-2 md:mb-0">
          Sessions
        </h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title or session id..."
            className="border border-blue-500 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <svg
            className="w-5 h-5 absolute top-3 right-3 text-blue-500"
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
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-black">
          <thead className="text-xs  uppercase bg-100-500">
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
            {currentSessions.length > 0 ? (
              currentSessions.map((session, index) => (
                <tr key={index} className="bg-white border-b hover:bg-blue-50">
                  <td className="px-6 py-4">{session.jobTitle}</td>
                  <td className="px-6 py-4">{session.sessionId}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openModal(session)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
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
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`py-2 px-4 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`py-2 px-4 rounded ${
                  currentPage === pageNumber
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-blue-500 text-blue-500 hover:bg-blue-50"
                }`}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`py-2 px-4 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
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
              className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 text-2xl font-bold"
            >
              &times;
            </button>
            <div className="flex items-center mb-4">
              <FaCalculator className="text-blue-500 mr-2 text-3xl" />
              <h3 className="text-2xl font-bold text-blue-500">
                Session Details
              </h3>
            </div>
            <div className="mb-4">
              {selectedSession.details.map((detail, index) => (
                <div key={index} className="mb-4 border-b pb-2">
                  <p className="font-medium">{detail.question}</p>
                  <p className="mt-1">
                    <span className="font-semibold">Answer:</span>{" "}
                    {detail.answerText}
                  </p>
                  {detail.audioUrl && (
                    <audio controls className="mt-1 w-full">
                      <source src={detail.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 bg-blue-50 rounded">
              <p className="font-semibold text-blue-700">Session Feedback:</p>
              <p className="mt-1 text-blue-600">
                {selectedSession.sessionFeedback}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionTable;
