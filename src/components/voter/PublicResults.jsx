import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { publicResultsAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const PublicResults = () => {
  const { slug } = useParams();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResults();
  }, [slug]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await publicResultsAPI.getPublicResults(slug);
      const {
        election: electionData,
        candidates: candidatesData,
        totalVotes: total,
      } = response.data.data;

      setElection(electionData);
      setCandidates(candidatesData);
      setTotalVotes(total);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load results");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading results..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {election?.title} - Results
        </h1>
        <p className="text-gray-600 mb-6">Total Votes Cast: {totalVotes}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {candidates.map((candidate, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-gray-800">
                  {candidate.name}
                </h3>
                <span className="text-2xl font-bold text-blue-600">
                  {candidate.percentage}%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {candidate.description}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${candidate.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {candidate.voteCount} votes
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicResults;
