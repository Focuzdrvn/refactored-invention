import { useState, useEffect } from "react";
import { adminVoterRollAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const VoterRollManager = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [singleEmail, setSingleEmail] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const response = await adminVoterRollAPI.getAllVoters();
      setVoters(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching voters:", error);
      setLoading(false);
    }
  };

  const handleAddSingle = async (e) => {
    e.preventDefault();
    try {
      await adminVoterRollAPI.addVoterEmails({ email: singleEmail });
      fetchVoters();
      setSingleEmail("");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding voter:", error);
      alert(error.response?.data?.message || "Error adding voter email");
    }
  };

  const handleAddBulk = async (e) => {
    e.preventDefault();
    try {
      const emailList = bulkEmails
        .split("\n")
        .map((email) => email.trim())
        .filter((email) => email);

      for (const email of emailList) {
        try {
          await adminVoterRollAPI.addVoterEmails({ email });
        } catch (err) {
          console.error(`Error adding ${email}:`, err);
        }
      }

      fetchVoters();
      setBulkEmails("");
      setShowModal(false);
      alert(`Successfully added ${emailList.length} voters!`);
    } catch (error) {
      console.error("Error adding bulk voters:", error);
      alert("Error adding bulk voters");
    }
  };

  const handleDelete = async (email) => {
    if (window.confirm(`Remove ${email} from voter roll?`)) {
      try {
        await adminVoterRollAPI.deleteVoterEmail(email);
        fetchVoters();
      } catch (error) {
        console.error("Error deleting voter:", error);
        alert(error.response?.data?.message || "Error deleting voter");
      }
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setBulkMode(false);
    setSingleEmail("");
    setBulkEmails("");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Voter Roll Management
        </h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Add Voters
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">{voters.length}</p>
          <p className="text-sm text-gray-600">Registered Voters</p>
        </div>
      </div>

      {/* Voters Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {voters.map((voter, index) => (
              <tr key={voter._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {voter.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(voter.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(voter.email)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {voters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No voters registered yet. Add your first voter!
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Voters</h3>
              <button
                onClick={resetModal}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setBulkMode(false)}
                className={`flex-1 py-2 px-4 rounded ${
                  !bulkMode
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Single Email
              </button>
              <button
                onClick={() => setBulkMode(true)}
                className={`flex-1 py-2 px-4 rounded ${
                  bulkMode
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Bulk Upload
              </button>
            </div>

            {/* Single Email Form */}
            {!bulkMode && (
              <form onSubmit={handleAddSingle} className="space-y-4">
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    required
                    placeholder="voter@example.com"
                    className="input"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Voter
                  </button>
                </div>
              </form>
            )}

            {/* Bulk Upload Form */}
            {bulkMode && (
              <form onSubmit={handleAddBulk} className="space-y-4">
                <div>
                  <label className="label">
                    Email Addresses (one per line)
                  </label>
                  <textarea
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    required
                    rows="6"
                    placeholder="voter1@example.com&#10;voter2@example.com&#10;voter3@example.com"
                    className="input"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add All Voters
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoterRollManager;
