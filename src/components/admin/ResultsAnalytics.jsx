import { useState, useEffect } from "react";
import { adminElectionAPI, adminResultsAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const ResultsAnalytics = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [results, setResults] = useState(null);
  const [voteLog, setVoteLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
    fetchVoteLog();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchResults(selectedElection);
    }
  }, [selectedElection]);

  const fetchElections = async () => {
    try {
      const response = await adminElectionAPI.getAllElections();
      setElections(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching elections:", error);
      setLoading(false);
    }
  };

  const fetchResults = async (electionId) => {
    try {
      const response = await adminResultsAPI.getAdminResultsByElection(
        electionId
      );
      setResults(response.data.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const fetchVoteLog = async () => {
    try {
      const response = await adminResultsAPI.getVoteLog();
      setVoteLog(response.data.data);
    } catch (error) {
      console.error("Error fetching vote log:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Results & Analytics
      </h1>

      {/* Election Selector */}
      <div className="mb-6">
        <label className="label">Select Election</label>
        <select
          value={selectedElection}
          onChange={(e) => setSelectedElection(e.target.value)}
          className="input max-w-md"
        >
          <option value="">-- Choose an election --</option>
          {elections.map((election) => (
            <option key={election._id} value={election._id}>
              {election.title} ({election.status})
            </option>
          ))}
        </select>
      </div>

      {/* Results Display */}
      {results && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Votes</p>
              <p className="text-3xl font-bold text-blue-600">
                {results.totalVotes}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-3xl font-bold text-green-600">
                {results.candidates?.length || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Election Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.election?.status}
              </p>
            </div>
          </div>

          {/* Candidates Results */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Candidate Results
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {results.candidates?.map((candidate, index) => {
                  const percentage =
                    results.totalVotes > 0
                      ? (
                          (candidate.voteCount / results.totalVotes) *
                          100
                        ).toFixed(2)
                      : 0;
                  return (
                    <div
                      key={candidate._id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-4">
                          {candidate.imageUrl && (
                            <img
                              src={candidate.imageUrl}
                              alt={candidate.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              #{index + 1} {candidate.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {candidate.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            {candidate.voteCount}
                          </p>
                          <p className="text-sm text-gray-600">{percentage}%</p>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Votes Log */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Votes (All Elections)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Election
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {voteLog.slice(0, 20).map((vote) => (
                <tr key={vote._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vote.userId?.email || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {vote.electionId?.title || "Unknown Election"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(vote.votedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsAnalytics;
