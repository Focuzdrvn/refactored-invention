import { Link } from "react-router-dom";

const ElectionCard = ({ election }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="group relative h-full">
      {/* Glowing Background */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-3xl opacity-60 blur-xl group-hover:opacity-100 transition-opacity"></div>

      {/* Card */}
      <div className="relative h-full backdrop-blur-xl bg-gray-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/20 flex flex-col">
        {/* Status Badge */}
        <div className="absolute top-6 right-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-xs font-bold uppercase tracking-wide">
              {election.status}
            </span>
          </div>
        </div>

        {/* Election Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 pr-24 group-hover:text-blue-300 transition-colors">
          {election.title}
        </h2>

        {/* Election Type Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-xl border border-purple-500/30 mb-6 self-start">
          <svg
            className="w-4 h-4 text-purple-300"
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
          <span className="text-purple-200 text-sm font-medium">
            {election.electionType === "MultipleChoice"
              ? "Multiple Choice"
              : "Single Choice"}
          </span>
        </div>

        {/* Election Details */}
        <div className="space-y-3 mb-6 flex-1">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-300 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                Election Period
              </p>
              <p className="text-gray-200 text-sm font-medium">
                {formatDate(election.startDate)} →{" "}
                {formatDate(election.endDate)}
              </p>
            </div>
          </div>

          {election.description && (
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-gray-300 text-sm line-clamp-2">
                  {election.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Vote Button */}
        <Link
          to={`/vote/${election.slug}`}
          className="w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-4 rounded-2xl font-bold text-center shadow-2xl shadow-blue-500/30 transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3 group/btn"
        >
          <span>Vote Now</span>
          <svg
            className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default ElectionCard;
