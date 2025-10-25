import { useState, useEffect } from "react";
import { adminElectionAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const ElectionManager = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    status: "Draft",
    startDate: "",
    endDate: "",
    electionType: "SingleChoice",
    maxVotes: 1,
  });

  useEffect(() => {
    fetchElections();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingElection) {
        await adminElectionAPI.updateElection(editingElection._id, formData);
      } else {
        await adminElectionAPI.createElection(formData);
      }
      fetchElections();
      resetForm();
    } catch (error) {
      console.error("Error saving election:", error);
      alert(error.response?.data?.message || "Error saving election");
    }
  };

  const handleEdit = (election) => {
    setEditingElection(election);
    setFormData({
      title: election.title,
      status: election.status,
      startDate: election.startDate.split("T")[0],
      endDate: election.endDate.split("T")[0],
      electionType: election.electionType,
      maxVotes: election.maxVotes,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this election?")) {
      try {
        await adminElectionAPI.deleteElection(id);
        fetchElections();
      } catch (error) {
        console.error("Error deleting election:", error);
        alert(error.response?.data?.message || "Error deleting election");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      status: "Draft",
      startDate: "",
      endDate: "",
      electionType: "SingleChoice",
      maxVotes: 1,
    });
    setEditingElection(null);
    setShowModal(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Election Management
        </h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Create Election
        </button>
      </div>

      {/* Elections Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {elections.map((election) => (
              <tr key={election._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {election.title}
                  </div>
                  <div className="text-sm text-gray-500">{election.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      election.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : election.status === "Closed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {election.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {election.electionType}
                  {election.maxVotes > 1 && ` (Max: ${election.maxVotes})`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(election.startDate).toLocaleDateString()} -{" "}
                  {new Date(election.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(election)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(election._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingElection ? "Edit Election" : "Create Election"}
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
                <label className="label">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="label">Election Type</label>
                <select
                  name="electionType"
                  value={formData.electionType}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="SingleChoice">Single Choice</option>
                  <option value="MultipleChoice">Multiple Choice</option>
                </select>
              </div>

              {formData.electionType === "MultipleChoice" && (
                <div>
                  <label className="label">Max Votes</label>
                  <input
                    type="number"
                    name="maxVotes"
                    value={formData.maxVotes}
                    onChange={handleInputChange}
                    min="1"
                    className="input"
                  />
                </div>
              )}

              <div>
                <label className="label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="input"
                />
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
                  {editingElection ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionManager;
