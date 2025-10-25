import { useState, useEffect } from "react";
import { voterAPI } from "../../services/api";
import ElectionCard from "./ElectionCard";
import LoadingSpinner from "../common/LoadingSpinner";

const VoterDashboard = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchActiveElections();
  }, []);

  const fetchActiveElections = async () => {
    try {
      setLoading(true);
      const response = await voterAPI.getActiveElections();
      setElections(response.data.data);
    } catch (err) {
      setError("Failed to load elections");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <LoadingSpinner message="Loading active elections..." />
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-1/2 -right-48 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -bottom-48 left-1/2 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative backdrop-blur-xl bg-gray-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-purple-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Active Elections
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
              Vote for your preferred candidates in ongoing elections
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error && (
          <div className="mb-8 backdrop-blur-xl bg-red-500/20 border border-red-500/30 text-red-100 px-6 py-4 rounded-2xl flex items-center gap-3">
            <svg
              className="w-6 h-6 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {elections.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 sm:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                No Active Elections
              </h2>
              <p className="text-gray-400 text-lg">
                There are no elections available at the moment. Check back
                later!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {elections.map((election, index) => (
              <div
                key={election._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ElectionCard election={election} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoterDashboard;
