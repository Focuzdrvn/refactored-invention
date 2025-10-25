import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from "./components/auth/LoginPage";
import AdminLogin from "./components/auth/AdminLogin";
import VoterDashboard from "./components/voter/VoterDashboard";
import VotingPage from "./components/voter/VotingPage";
import PublicResults from "./components/voter/PublicResults";
import AdminDashboard from "./components/admin/AdminDashboard";
import ElectionManager from "./components/admin/ElectionManager";
import CandidateManager from "./components/admin/CandidateManager";
import VoterRollManager from "./components/admin/VoterRollManager";
import ResultsAnalytics from "./components/admin/ResultsAnalytics";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/results/:slug" element={<PublicResults />} />

            {/* Voter Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRole="Voter">
                  <VoterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vote/:slug"
              element={
                <ProtectedRoute allowedRole="Voter">
                  <VotingPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/elections"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <ElectionManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/candidates"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <CandidateManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/voterroll"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <VoterRollManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/results"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <ResultsAnalytics />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="card max-w-md text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                      404
                    </h1>
                    <p className="text-gray-600 mb-6">Page not found</p>
                    <a href="/" className="btn-primary">
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
