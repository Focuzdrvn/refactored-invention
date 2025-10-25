import { useState, useEffect } from "react";
import { adminElectionAPI, adminCandidateAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const CandidateManager = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    electionId: "",
  });

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchCandidates(selectedElection);
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

  const fetchCandidates = async (electionId) => {
    try {
      const response = await adminCandidateAPI.getCandidates(electionId);
      setCandidates(response.data.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append(
        "electionId",
        formData.electionId || selectedElection
      );

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (editingCandidate) {
        await adminCandidateAPI.updateCandidate(
          editingCandidate._id,
          formDataToSend
        );
      } else {
        await adminCandidateAPI.createCandidate(formDataToSend);
      }

      fetchCandidates(selectedElection);
      resetForm();
    } catch (error) {
      console.error("Error saving candidate:", error);
      alert(error.response?.data?.message || "Error saving candidate");
    }
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      description: candidate.description || "",
      electionId: candidate.electionId,
    });
    setImagePreview(candidate.imageUrl);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await adminCandidateAPI.deleteCandidate(id);
        fetchCandidates(selectedElection);
      } catch (error) {
        console.error("Error deleting candidate:", error);
        alert(error.response?.data?.message || "Error deleting candidate");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      electionId: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingCandidate(null);
    setShowModal(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Candidate Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
          disabled={!selectedElection}
        >
          + Add Candidate
        </button>
      </div>

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

      {/* Candidates Grid */}
      {selectedElection && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {candidate.imageUrl && (
                <img
                  src={candidate.imageUrl}
                  alt={candidate.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {candidate.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {candidate.description || "No description"}
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  Votes:{" "}
                  <span className="font-semibold">{candidate.voteCount}</span>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(candidate)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(candidate._id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedElection && candidates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No candidates yet. Add your first candidate!
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCandidate ? "Edit Candidate" : "Add Candidate"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Candidate Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="input"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-full h-48 object-cover rounded"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCandidate ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManager;
