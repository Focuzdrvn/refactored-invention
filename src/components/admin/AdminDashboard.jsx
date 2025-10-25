import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/elections"
            className="card hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-gray-800">Elections</h2>
            <p className="text-gray-600 mt-2">Manage all elections</p>
          </Link>

          <Link
            to="/admin/candidates"
            className="card hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-4">👥</div>
            <h2 className="text-xl font-bold text-gray-800">Candidates</h2>
            <p className="text-gray-600 mt-2">Manage candidates</p>
          </Link>

          <Link
            to="/admin/voterroll"
            className="card hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-800">Voter Roll</h2>
            <p className="text-gray-600 mt-2">Manage eligible voters</p>
          </Link>

          <Link
            to="/admin/results"
            className="card hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-gray-800">Results</h2>
            <p className="text-gray-600 mt-2">View analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
