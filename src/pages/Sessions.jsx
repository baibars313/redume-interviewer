import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalculator } from "react-icons/fa";
import { API_URL } from "../compnents/constant";
import SessionSummary from "../compnents/Details";

const SessionTable = () => {
  const initialUrl = `${API_URL}/api/sessions/?limit=10&offset=0`;
  const [sessionsData, setSessionsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorSessions, setErrorSessions] = useState(null);

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
    setErrorSessions(null);
    axios
      .get(url)
      .then((response) => {
        setSessionsData(response.data.results);
        setNextPageUrl(
          response.data.next ? getAbsoluteUrl(response.data.next) : null
        );
        setPrevPageUrl(
          response.data.previous ? getAbsoluteUrl(response.data.previous) : null
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sessions data: ", error);
        setErrorSessions("Error fetching sessions data.");
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

  // Handlers for showing details.
  const openDetail = (session) => {
    setSelectedSessionId(session.session_id);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedSessionId(null);
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

  // If detail view is open, show only the detail component.
  if (showDetail && selectedSessionId) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className=" py-8 px-2">
            <button
              onClick={closeDetail}
              className="text-red-500 py-2 px-4 rounded-lg mb-4 p-2 shadow-md  hover:bg-red-600 hover:text-white font-semibold"
            >
               {"<"} Go Back
            </button>
            <SessionSummary sessionId={selectedSessionId} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="p-4 rounded-lg shadow-lg mt-6 lg:max-w-[80vw] sm:w-full md:w-3/4 lg:w-2/3 mx-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-2xl font-bold text-red-500 mb-2 md:mb-0">
            Sessions
          </h2>
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
          <div className="text-center text-red-500">
            <p>Loading...</p>
          </div>
        ) : errorSessions ? (
          <div className="text-center text-red-500">
            <p>{errorSessions}</p>
          </div>
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
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-red-50"
                    >
                      <td className="px-6 py-4">{session.title}</td>
                      <td className="px-6 py-4">{session.session_id}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openDetail(session)}
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
      </div>
    </div>
  );
};

export default SessionTable;
