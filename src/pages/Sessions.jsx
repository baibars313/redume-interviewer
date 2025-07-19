import React, { useState, useEffect } from "react";
import { API_URL } from "../compnents/constant";
import { Link } from "react-router";
import { useAuthApi } from "../hooks/useAuthapi";
import { useAuthStore } from "../store/useAuthstore";
import { FaEye, FaTrash, FaSyncAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { showSuccess, showError } from '../utils/toast.jsx';

const SessionTable = () => {
  const userId = useAuthStore((state) => state.userId);
  const api = useAuthApi();

  const initialUrl = `/api/sessions/?limit=10&offset=0&user_id=${userId}`;

  const [sessionsData, setSessionsData] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [errorSessions, setErrorSessions] = useState(null);
  const [deletingSession, setDeletingSession] = useState(null);

  // Fetch data based on current URL
  const fetchData = async () => {
    setLoading(true);
    setErrorSessions(null);
    try {
      const response = await api.get(currentUrl);
      setSessionsData(response.data.results);
      setFilteredSessions(response.data.results);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
    } catch (error) {
      console.error("Error fetching session data:", error);
      setErrorSessions("Error fetching session data.");
      showError("Error fetching session data.");
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSessions(sessionsData);
    } else {
      const filtered = sessionsData.filter(
        (session) =>
          session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.session_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSessions(filtered);
    }
  }, [searchTerm, sessionsData]);

  // Re-fetch when currentUrl changes
  useEffect(() => {
    if (currentUrl) {
      fetchData();
    }
  }, [currentUrl]);

  // Delete session function
  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) {
      return;
    }

    setDeletingSession(sessionId);
    try {
      await api.delete(`/api/session/${sessionId}/`);
      setSessionsData(prev => prev.filter(session => session.session_id !== sessionId));
      setFilteredSessions(prev => prev.filter(session => session.session_id !== sessionId));
      showSuccess("Session deleted successfully!");
    } catch (error) {
      console.error("Error deleting session:", error);
      showError("Failed to delete session. Please try again.");
    } finally {
      setDeletingSession(null);
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (nextPageUrl) setCurrentUrl(nextPageUrl.replace(API_URL, ""));
  };

  const handlePrevPage = () => {
    if (prevPageUrl) setCurrentUrl(prevPageUrl.replace(API_URL, ""));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 py-8 px-4 animate-fade-in-up">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 ">
            Interview Sessions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
            Manage and review your interview sessions. Search, view details, or delete sessions as needed.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEye className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by job title or session id..."
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors gap-2"
              >
                <FaSyncAlt className="animate-spin-slow" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center animate-fade-in-up">
            <div className="flex items-center justify-center space-x-3">
              <FaSyncAlt className="animate-spin text-red-600 h-8 w-8" />
              <span className="text-xl font-medium text-gray-700">Loading sessions...</span>
            </div>
          </div>
        ) : errorSessions ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center animate-fade-in-up">
            <div className="flex items-center justify-center space-x-3 text-red-600">
              <FaSyncAlt className="w-8 h-8 animate-spin" />
              <span className="text-xl font-medium">{errorSessions}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <FaEye className="w-4 h-4" />
                        <span>Job Title</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <FaEye className="w-4 h-4" />
                        <span>Session ID</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <FaEye className="w-4 h-4" />
                        <span>Actions</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{session.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded-md">
                            {session.session_id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/sessiondetails?sessionId=${session.session_id}`}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105 gap-2"
                            >
                              <FaEye />
                              View Details
                            </Link>
                            
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              disabled={deletingSession === session.session_id}
                              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg transition-all duration-200 gap-2 ${
                                deletingSession === session.session_id
                                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                  : "text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105"
                              }`}
                            >
                              <FaTrash />
                              {deletingSession === session.session_id ? (
                                <>
                                  Deleting...
                                </>
                              ) : (
                                <>Delete</>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <FaEye className="w-16 h-16 text-gray-400" />
                          <div className="text-lg font-medium text-gray-900">
                            {searchTerm ? "No sessions found matching your search." : "No sessions found."}
                          </div>
                          <p className="text-gray-500">
                            {searchTerm ? "Try adjusting your search terms." : "Start by creating your first interview session."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {(prevPageUrl || nextPageUrl) && (
          <div className="mt-8 flex justify-center animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 px-6 py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePrevPage}
                  disabled={!prevPageUrl}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg transition-all duration-200 gap-2 ${
                    !prevPageUrl
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105"
                  }`}
                >
                  <FaChevronLeft />
                  Previous
                </button>
                <div className="text-sm text-gray-600">
                  Page navigation
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={!nextPageUrl}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg transition-all duration-200 gap-2 ${
                    !nextPageUrl
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105"
                  }`}
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionTable;
