import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  AlertCircle,
  Edit2,
  Trash2,
  Save,
  X,
  UserRound,
} from "lucide-react";
import axios from "axios";

export default function StudentForm() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch students from API
  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://6823b82b65ba05803397b364.mockapi.io/users"
      );
      setStudents(response.data.filter((student) => student.role == "student"));
      setFilteredStudents(response.data.filter((student) => student.role == "student"));
    } catch (err) {
      setError("Failed to fetch students. Please try again.");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) =>
        student.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  // Handle edit mode
  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditForm({
      username: student.username || "",
      email: student.email || "",
      phone: student.phone || "",
    });
  };

  // Handle save edit
  const handleSaveEdit = async (studentId) => {
    try {
      const response = await axios.put(
        `https://6823b82b65ba05803397b364.mockapi.io/users/${studentId}`,
        editForm
      );

      // Update local state
      const updatedStudents = students.map((student) =>
        student.id === studentId ? { ...student, ...editForm } : student
      );
      setStudents(updatedStudents);
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError("Failed to update student. Please try again.");
      console.error("Error updating student:", err);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Handle delete
  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    setDeleteLoading(studentId);
    try {
      await axios.delete(
        `https://6823b82b65ba05803397b364.mockapi.io/users/${studentId}`
      );

      // Update local state
      const updatedStudents = students.filter(
        (student) => student.id !== studentId
      );
      setStudents(updatedStudents);
    } catch (err) {
      setError("Failed to delete student. Please try again.");
      console.error("Error deleting student:", err);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student Management
        </h1>
        <p className="text-gray-600">View and search registered students</p>
      </div>

      {/* Search and Refresh Section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchStudents}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Results Counter */}
      <div className="mb-4 text-sm text-gray-600">
        {searchTerm ? (
          <span>
            Found {filteredStudents.length} student(s) matching "{searchTerm}"
          </span>
        ) : (
          <span>Total Students: {students.length}</span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="animate-spin mr-2" size={24} />
          <span className="text-gray-600">Loading students...</span>
        </div>
      )}

      {/* Students List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No students found" : "No students registered"}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try adjusting your search term"
                  : "Students will appear here once they register"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header with user info and action buttons */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <User size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        {editingId === student.id ? (
                          <input
                            type="text"
                            value={editForm.username}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                username: e.target.value,
                              })
                            }
                            className="font-semibold text-gray-900 text-lg border border-gray-300 rounded px-2 py-1 w-full mb-1"
                          />
                        ) : (
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {student.username}
                          </h3>
                        )}
                        <p className="text-sm text-gray-500">
                          ID: {student.id}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 ml-2">
                      {editingId === student.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(student.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="Save changes"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                            title="Cancel edit"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit student"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            disabled={deleteLoading === student.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                            title="Delete student"
                          >
                            {deleteLoading === student.id ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Student details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      {editingId === student.id ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
                        />
                      ) : (
                        <span className="text-sm">{student.email}</span>
                      )}
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-2 text-gray-400" />
                      {editingId === student.id ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                          className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
                        />
                      ) : (
                        <span className="text-sm">
                          {student.phone || "No phone number"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-gray-600">
                      <UserRound size={16} className="mr-2 text-gray-400" />
                      {editingId === student.id ? (
                        <input
                          type="tel"
                          value={editForm.role}
                          onChange={(e) =>
                            setEditForm({ ...editForm, role: e.target.value })
                          }
                          className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
                        />
                      ) : (
                        <span className="text-sm">
                          {student.role || "No phone number"}
                        </span>
                      )}
                    </div>

                    {student.createdAt && (
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm">
                          Registered: {formatDate(student.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}