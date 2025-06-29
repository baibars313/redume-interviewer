import React, { useState, useEffect } from "react";
import { API_URL } from "../compnents/constant";
import { Link } from "react-router";
import { useAuthApi } from "../hooks/useAuthapi";
import { useAuthStore } from "../store/useAuthstore";

const SessionTable = () => {
  const userId = useAuthStore((state) => state.userId);
  const api = useAuthApi();

  const initialUrl = `/api/sessions/?limit=10&offset=0&user_id=${userId}`;

  const [sessionsData, setSessionsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [errorSessions, setErrorSessions] = useState(null);

  // Fetch data based on current URL
  const fetchData = async () => {
    setLoading(true);
    setErrorSessions(null);
    try {
      const response = await api.get(currentUrl);
      setSessionsData(response.data.results);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
    } catch (error) {
      console.error("Error fetching session data:", error);
      setErrorSessions("Error fetching session data.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when currentUrl changes
  useEffect(() => {
    if (currentUrl) {
      fetchData();
    }
  }, [currentUrl]);

  // Pagination handlers
  const handleNextPage = () => {
    if (nextPageUrl) setCurrentUrl(nextPageUrl.replace(API_URL, ""));
  };

  const handlePrevPage = () => {
    if (prevPageUrl) setCurrentUrl(prevPageUrl.replace(API_URL, ""));
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-4 rounded-lg shadow-lg mt-6 lg:max-w-[80vw] sm:w-full md:w-3/4 lg:w-2/3 mx-4">
        {/* Search Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-500 mb-2 md:mb-0">Sessions</h2>
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

        {/* Table Display */}
        {loading ? (
          <div className="text-center text-blue-500"><p>Loading...</p></div>
        ) : errorSessions ? (
          <div className="text-center text-blue-500"><p>{errorSessions}</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-black">
              <thead className="text-xs uppercase bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3">Job Title</th>
                  <th className="px-6 py-3">Session ID</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessionsData.length > 0 ? (
                  sessionsData.map((session, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-blue-50">
                      <td className="px-6 py-4">{session.title}</td>
                      <td className="px-6 py-4">{session.session_id}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/sessiondetails?sessionId=${session.session_id}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center">No sessions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Buttons */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={!prevPageUrl}
            className={`py-2 px-4 rounded ${
              !prevPageUrl
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
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
                : "bg-blue-500 hover:bg-blue-600 text-white"
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
