import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            E-Cell Voting
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Voter Login
                </Link>
                <Link
                  to="/admin/login"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Admin Login
                </Link>
              </>
            )}

            {user && role === "Voter" && (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
                <span className="text-gray-600">Welcome, {user.name}</span>
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </>
            )}

            {user && role === "Admin" && (
              <>
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/elections"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Elections
                </Link>
                <Link
                  to="/admin/candidates"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Candidates
                </Link>
                <Link
                  to="/admin/voterroll"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Voter Roll
                </Link>
                <Link
                  to="/admin/results"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Results
                </Link>
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
