import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add JWT token and handle Content-Type
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only set Content-Type if it's not FormData (FormData sets its own boundary)
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (auto logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  googleCallback: (supabaseToken) =>
    api.post("/auth/google/callback", { supabaseToken }),
  adminLogin: (username, password) =>
    api.post("/auth/admin/login", { username, password }),
};

// Voter API
export const voterAPI = {
  getActiveElections: () => api.get("/elections"),
  getElectionBySlug: (slug) => api.get(`/elections/${slug}`),
  castVote: (data) => api.post("/vote", data),
};

// Admin Election API
export const adminElectionAPI = {
  createElection: (data) => api.post("/admin/elections", data),
  getAllElections: () => api.get("/admin/elections"),
  updateElection: (id, data) => api.put(`/admin/elections/${id}`, data),
  deleteElection: (id) => api.delete(`/admin/elections/${id}`),
};

// Admin Candidate API
export const adminCandidateAPI = {
  createCandidate: (data) => api.post("/admin/candidates", data),
  getCandidates: (electionId) => api.get(`/admin/candidates/${electionId}`),
  updateCandidate: (id, data) => api.put(`/admin/candidates/${id}`, data),
  deleteCandidate: (id) => api.delete(`/admin/candidates/${id}`),
};

// Admin Voter Roll API
export const adminVoterRollAPI = {
  addVoterEmails: (data) => api.post("/admin/voterroll", data),
  getAllVoters: (page = 1, limit = 20) =>
    api.get(`/admin/voterroll?page=${page}&limit=${limit}`),
  deleteVoterEmail: (email) =>
    api.delete("/admin/voterroll", { data: { email } }),
};

// Admin Results API
export const adminResultsAPI = {
  getAdminResults: () => api.get("/admin/results"),
  getAdminResultsByElection: (id) => api.get(`/admin/results/${id}`),
  getVoteLog: (page = 1, limit = 20) =>
    api.get(`/admin/votelog?page=${page}&limit=${limit}`),
};

// Public Results API
export const publicResultsAPI = {
  getPublicResults: (slug) => api.get(`/results/${slug}`),
};

export default api;
