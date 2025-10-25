import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { voterAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const VotingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [votingCandidate, setVotingCandidate] = useState(null);
  const lastTapTimeRef = useRef({});
  const tapTimeoutRef = useRef({});

  useEffect(() => {
    fetchElectionData();
  }, [slug]);

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      const response = await voterAPI.getElectionBySlug(slug);
      const {
        election: electionData,
        candidates: candidatesData,
        hasVoted: voted,
      } = response.data.data;

      setElection(electionData);
      setCandidates(candidatesData);
      setHasVoted(voted);
    } catch (err) {
      setError("Failed to load election data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSingleChoice = (candidateId) => {
    setSelectedCandidate(candidateId);
  };

  const handleMultipleChoice = (candidateId) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(
        selectedCandidates.filter((id) => id !== candidateId)
      );
    } else {
      if (selectedCandidates.length < election.maxVotes) {
        setSelectedCandidates([...selectedCandidates, candidateId]);
      } else {
        setError(`You can only select up to ${election.maxVotes} candidate(s)`);
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const handleDoubleTapVote = async (candidateId) => {
    const now = Date.now();
    const lastTap = lastTapTimeRef.current[candidateId] || 0;
    const timeDiff = now - lastTap;

    // Clear existing timeout
    if (tapTimeoutRef.current[candidateId]) {
      clearTimeout(tapTimeoutRef.current[candidateId]);
    }

    if (timeDiff < 300) {
      // Double tap detected! Vote immediately
      setVotingCandidate(candidateId);

      try {
        setSubmitting(true);
        setError("");

        const voteData = {
          electionId: election._id,
          candidateId: candidateId,
        };

        await voterAPI.castVote(voteData);
        setSuccess(
          `🎉 Vote cast for ${
            candidates.find((c) => c._id === candidateId)?.name
          }!`
        );
        setHasVoted(true);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to cast vote");
        console.error(err);
      } finally {
        setSubmitting(false);
        setVotingCandidate(null);
      }
    } else {
      // Single tap - just select
      if (election.electionType === "SingleChoice") {
        handleSingleChoice(candidateId);
      } else {
        handleMultipleChoice(candidateId);
      }

      // Set timeout to show hint
      tapTimeoutRef.current[candidateId] = setTimeout(() => {
        lastTapTimeRef.current[candidateId] = 0;
      }, 300);
    }

    lastTapTimeRef.current[candidateId] = now;
  };

  const handleSubmitVote = async () => {
    try {
      setSubmitting(true);
      setError("");

      let voteData;
      if (election.electionType === "SingleChoice") {
        if (!selectedCandidate) {
          setError("Please select a candidate");
          return;
        }
        voteData = {
          electionId: election._id,
          candidateId: selectedCandidate,
        };
      } else {
        if (selectedCandidates.length === 0) {
          setError("Please select at least one candidate");
          return;
        }
        voteData = {
          electionId: election._id,
          candidateIds: selectedCandidates,
        };
      }

      await voterAPI.castVote(voteData);
      setSuccess("Vote cast successfully!");
      setHasVoted(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cast vote");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <LoadingSpinner message="Loading election..." />
      </div>
    );

  if (!election)
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Election not found</div>
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

      {/* Navigation Bar */}
      <nav className="backdrop-blur-xl bg-gray-900/80 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Election Header Card */}
        <div className="mb-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-linear-to-r from-purple-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                {election.title}
              </h1>
              <p className="text-gray-300 text-base sm:text-lg mb-4">
                {election.description ||
                  "Cast your vote for your preferred candidate"}
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                  <svg
                    className="w-4 h-4 text-purple-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-purple-200">
                    {new Date(election.startDate).toLocaleDateString()} -{" "}
                    {new Date(election.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                  <svg
                    className="w-4 h-4 text-blue-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-blue-200">
                    {candidates.length} Candidates
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="px-5 py-3 bg-linear-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                <p className="text-white/80 text-xs uppercase tracking-wide mb-1">
                  Type
                </p>
                <p className="text-white font-bold text-sm">
                  {election.electionType === "MultipleChoice"
                    ? `Choose ${election.maxVotes}`
                    : "Single Choice"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-6 backdrop-blur-xl bg-green-500/20 border border-green-500/30 text-green-100 px-6 py-4 rounded-2xl flex items-center gap-3 animate-fade-in">
            <svg
              className="w-6 h-6 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 backdrop-blur-xl bg-red-500/20 border border-red-500/30 text-red-100 px-6 py-4 rounded-2xl flex items-center gap-3 animate-shake">
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

        {hasVoted ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50 animate-bounce">
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Vote Recorded! 🎉
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Thank you for participating in this election. Your voice
                matters!
              </p>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-gray-400 text-sm">
                  Your vote has been securely recorded and cannot be changed.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg">
                <span className="text-2xl">💡</span>
                <p className="text-white/90 text-sm font-medium">
                  <strong>Pro Tip:</strong> Double-tap any card to vote
                  instantly!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 perspective-1000">
              {candidates.map((candidate, index) => (
                <div
                  key={candidate._id}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* 3D Card Container */}
                  <div
                    className={`relative transform transition-all duration-300 preserve-3d cursor-pointer
                      ${
                        votingCandidate === candidate._id
                          ? "scale-105 rotate-y-12"
                          : "hover:scale-105 hover:-translate-y-2"
                      }
                      ${
                        (election.electionType === "SingleChoice" &&
                          selectedCandidate === candidate._id) ||
                        (election.electionType === "MultipleChoice" &&
                          selectedCandidates.includes(candidate._id))
                          ? "ring-4 ring-blue-400 shadow-2xl shadow-blue-500/50"
                          : "hover:shadow-2xl"
                      }`}
                    onClick={() => handleDoubleTapVote(candidate._id)}
                  >
                    {/* Card Background with Gradient */}
                    <div className="absolute inset-0 bg-linear-to-br from-purple-600 via-blue-500 to-cyan-400 rounded-2xl opacity-75 blur-xl group-hover:opacity-100 transition-opacity"></div>

                    {/* Main Card */}
                    <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      {/* Image Section */}
                      <div className="relative h-64 overflow-hidden">
                        {candidate.imageUrl ? (
                          <>
                            <img
                              src={candidate.imageUrl}
                              alt={candidate.name}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <svg
                              className="w-24 h-24 text-white/50"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}

                        {/* Selection Badge */}
                        {((election.electionType === "SingleChoice" &&
                          selectedCandidate === candidate._id) ||
                          (election.electionType === "MultipleChoice" &&
                            selectedCandidates.includes(candidate._id))) && (
                          <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-full p-2 shadow-lg animate-bounce">
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}

                        {/* Voting Indicator */}
                        {votingCandidate === candidate._id && (
                          <div className="absolute inset-0 bg-green-500/80 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-center">
                              <svg
                                className="w-16 h-16 text-white mx-auto mb-2 animate-pulse"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p className="text-white font-bold text-lg">
                                Voting...
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                          {candidate.name}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                          {candidate.description || "No description provided"}
                        </p>

                        {/* Selection Indicator */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            {election.electionType === "SingleChoice" ? (
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                ${
                                  selectedCandidate === candidate._id
                                    ? "border-blue-400 bg-blue-400"
                                    : "border-gray-400"
                                }`}
                              >
                                {selectedCandidate === candidate._id && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                            ) : (
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                                ${
                                  selectedCandidates.includes(candidate._id)
                                    ? "border-blue-400 bg-blue-400"
                                    : "border-gray-400"
                                }`}
                              >
                                {selectedCandidates.includes(candidate._id) && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                            )}
                            <span className="text-gray-400 text-sm">
                              {(election.electionType === "SingleChoice" &&
                                selectedCandidate === candidate._id) ||
                              (election.electionType === "MultipleChoice" &&
                                selectedCandidates.includes(candidate._id))
                                ? "Selected"
                                : "Tap to select"}
                            </span>
                          </div>

                          {/* Double Tap Hint */}
                          <div className="flex items-center gap-1 text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Double tap
                          </div>
                        </div>
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                      </div>
                    </div>
                  </div>

                  {/* 3D Shadow */}
                  <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-cyan-600/20 rounded-2xl blur-2xl -z-10 transform translate-y-4 scale-95 opacity-0 group-hover:opacity-100 transition-all"></div>
                </div>
              ))}
            </div>

            {/* Submit Button Container */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
              <button
                onClick={handleSubmitVote}
                disabled={
                  submitting ||
                  (election.electionType === "SingleChoice" &&
                    !selectedCandidate) ||
                  (election.electionType === "MultipleChoice" &&
                    selectedCandidates.length === 0)
                }
                className="w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Submitting Vote...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Submit My Vote</span>
                  </>
                )}
              </button>

              {/* Selection Status */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  {election.electionType === "SingleChoice" ? (
                    selectedCandidate ? (
                      <>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-gray-300 text-sm font-medium">
                          1 candidate selected
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <p className="text-gray-400 text-sm">
                          Select a candidate to continue
                        </p>
                      </>
                    )
                  ) : (
                    <>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedCandidates.length > 0
                            ? "bg-green-400 animate-pulse"
                            : "bg-gray-500"
                        }`}
                      ></div>
                      <p
                        className={`text-sm font-medium ${
                          selectedCandidates.length > 0
                            ? "text-gray-300"
                            : "text-gray-400"
                        }`}
                      >
                        {selectedCandidates.length} of {election.maxVotes}{" "}
                        selected
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VotingPage;
