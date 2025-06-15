import React, { useState, useEffect } from "react";
import {
  Search,
  Lightbulb,
  Calendar,
  RefreshCw,
  AlertCircle,
  Edit2,
  Trash2,
  Save,
  X,
  Check,
  XCircle,
} from "lucide-react";

const USERS_URL = "https://6823b82b65ba05803397b364.mockapi.io/users";

export default function IdeaForm() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState({ userId: null, ideaId: null });
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [rejecting, setRejecting] = useState({ userId: null, ideaId: null });
  const [rejectReason, setRejectReason] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch and transform users -> attach ideas array
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(USERS_URL);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      const transformed = data
        .filter((u) => u.role === "student")
        .map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          ideas: (user.ideas || []).map((idea) => ({
            id: idea.id,
            title: idea.title,
            description: idea.description || "",
            status: idea.status || "pending", // Default to pending
            rejectionReason: idea.rejectionReason || "",
            createdAt: idea.createdAt || new Date().toISOString(),
          })),
        }));
      setUsers(transformed);
      setFilteredUsers(transformed);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users
        .map((u) => ({
          ...u,
          ideas: u.ideas.filter((i) =>
            i.title.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((u) => u.ideas.length > 0);
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleEdit = (userId, idea) => {
    setEditing({ userId, ideaId: idea.id });
    setEditForm({ title: idea.title, description: idea.description });
  };

  const handleSaveEdit = async () => {
    const { userId, ideaId } = editing;
    try {
      // update nested ideas array
      const user = users.find((u) => u.id === userId);
      const updatedIdeas = user.ideas.map((i) =>
        i.id === ideaId ? { ...i, ...editForm } : i
      );

      const response = await fetch(`${USERS_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideas: updatedIdeas }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setUsers(
        users.map((u) => (u.id !== userId ? u : { ...u, ideas: updatedIdeas }))
      );
      setEditing({ userId: null, ideaId: null });
    } catch (err) {
      setError("Failed to update idea.");
    }
  };

  const handleAccept = async (userId, ideaId) => {
    try {
      const user = users.find((u) => u.id === userId);
      const updated = user.ideas.map((i) =>
        i.id === ideaId ? { ...i, status: "accepted", rejectionReason: "" } : i
      );

      const response = await fetch(`${USERS_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideas: updated }),
      });

      if (!response.ok) throw new Error("Failed to accept");

      setUsers(
        users.map((u) => (u.id !== userId ? u : { ...u, ideas: updated }))
      );
    } catch {
      setError("Failed to accept idea.");
    }
  };

  const handleRejectConfirm = async () => {
    const { userId, ideaId } = rejecting;
    if (!rejectReason.trim()) return alert("Provide rejection reason");
    try {
      const user = users.find((u) => u.id === userId);
      const updated = user.ideas.map((i) =>
        i.id === ideaId
          ? { ...i, status: "rejected", rejectionReason: rejectReason }
          : i
      );

      const response = await fetch(`${USERS_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideas: updated }),
      });

      if (!response.ok) throw new Error("Failed to reject");

      setUsers(
        users.map((u) => (u.id !== userId ? u : { ...u, ideas: updated }))
      );
      setRejecting({ userId: null, ideaId: null });
      setRejectReason("");
    } catch {
      setError("Failed to reject idea.");
    }
  };

  const handleDelete = async (userId, ideaId) => {
    const user = users.find((u) => u.id === userId);
    const idea = user.ideas.find((i) => i.id === ideaId);
    if (idea.status !== "rejected") {
      return alert("Only rejected ideas can be deleted");
    }
    if (
      !window.confirm(
        `Delete idea: "${idea.title}"?\nReason: ${idea.rejectionReason}`
      )
    )
      return;
    setDeleteLoading(ideaId);
    try {
      const filtered = user.ideas.filter((i) => i.id !== ideaId);

      const response = await fetch(`${USERS_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideas: filtered }),
      });

      if (!response.ok) throw new Error("Failed to delete");

      setUsers(
        users.map((u) => (u.id !== userId ? u : { ...u, ideas: filtered }))
      );
    } catch {
      setError("Failed to delete idea.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        text: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      accepted: {
        text: "Accepted",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      rejected: {
        text: "Rejected",
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student Ideas Management
        </h1>
        <p className="text-gray-600">
          Review, accept, or reject student ideas. All ideas start as "Pending"
          by default.
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="animate-spin mr-2" size={24} />
          <span className="text-gray-600">Loading...</span>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-8">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Lightbulb size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No ideas found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search term or refresh to load data.
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.username}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {user.ideas.length} idea{user.ideas.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {user.ideas.map((idea) => {
                    const isEditing =
                      editing.userId === user.id && editing.ideaId === idea.id;
                    const isRejecting =
                      rejecting.userId === user.id &&
                      rejecting.ideaId === idea.id;
                    return (
                      <div
                        key={idea.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {/* Title + badge */}
                        <div className="flex justify-between items-start mb-3">
                          {isEditing ? (
                            <input
                              value={editForm.title}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  title: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded px-2 py-1 text-lg w-full mr-2 bg-white"
                              placeholder="Enter idea title..."
                            />
                          ) : (
                            <h3 className="font-semibold text-lg text-gray-900 flex-1 mr-2">
                              {idea.title}
                            </h3>
                          )}
                          <StatusBadge status={idea.status} />
                        </div>

                        {/* Description */}
                        <div className="text-gray-600 mb-3">
                          {isEditing ? (
                            <textarea
                              value={editForm.description}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  description: e.target.value,
                                })
                              }
                              className="w-full h-20 border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                              placeholder="Enter idea description..."
                            />
                          ) : (
                            <p className="text-sm leading-relaxed">
                              {idea.description || "No description provided"}
                            </p>
                          )}
                        </div>

                        {/* Created at */}
                        {idea.createdAt && (
                          <div className="flex items-center text-gray-500 text-xs mb-3">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(idea.createdAt)}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-2 mb-3">
                          {isEditing ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                title="Save Changes"
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  setEditing({ userId: null, ideaId: null })
                                }
                                title="Cancel Edit"
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              {idea.status !== "accepted" && (
                                <button
                                  onClick={() => handleAccept(user.id, idea.id)}
                                  title="Accept Idea"
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <Check size={18} />
                                </button>
                              )}
                              {idea.status !== "rejected" && (
                                <button
                                  onClick={() =>
                                    setRejecting({
                                      userId: user.id,
                                      ideaId: idea.id,
                                    })
                                  }
                                  title="Reject Idea"
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <XCircle size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleEdit(user.id, idea)}
                                title="Edit Idea"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                disabled={
                                  deleteLoading === idea.id ||
                                  idea.status !== "rejected"
                                }
                                onClick={() => handleDelete(user.id, idea.id)}
                                title={
                                  idea.status === "rejected"
                                    ? "Delete Idea"
                                    : "Can only delete rejected ideas"
                                }
                                className={`p-2 rounded-lg transition-colors ${
                                  idea.status === "rejected"
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <Trash2
                                  size={18}
                                  className={
                                    deleteLoading === idea.id
                                      ? "animate-pulse"
                                      : ""
                                  }
                                />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Reject reason input */}
                        {isRejecting && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <label className="block text-sm font-medium text-red-800 mb-2">
                              Rejection Reason (Required)
                            </label>
                            <textarea
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Please provide a clear reason for rejecting this idea..."
                              className="w-full h-20 border border-red-300 rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none"
                            />
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={handleRejectConfirm}
                                disabled={!rejectReason.trim()}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Confirm Reject
                              </button>
                              <button
                                onClick={() => {
                                  setRejecting({ userId: null, ideaId: null });
                                  setRejectReason("");
                                }}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Show rejection reason */}
                        {idea.status === "rejected" &&
                          idea.rejectionReason &&
                          !isRejecting && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="text-sm">
                                <span className="font-medium text-red-800">
                                  Rejection Reason:
                                </span>
                                <p className="text-red-700 mt-1">
                                  {idea.rejectionReason}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
