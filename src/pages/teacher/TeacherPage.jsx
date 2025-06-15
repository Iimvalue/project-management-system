import { useState, useEffect } from "react";
import { Mail, Users, Check, X, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";

const URL = "https://6823b82b65ba05803397b364.mockapi.io/users";

export default function TeacherPage() {
  const navigate = useNavigate();
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [supervisedStudents, setSupervisedStudents] = useState([]);
  const [pendingIdeas, setPendingIdeas] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.getItem("username") == null ? navigate("/teacher/login") : "";
    localStorage.getItem("role") == "user" ? navigate("/user/") : "";
    localStorage.getItem("role") == "teacher" ? navigate("/teacher/") : "";
  }, []);

  // Fetch current teacher and all users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const teacherId = localStorage.getItem("id");

        // Fetch current teacher
        const teacherRes = await axios.get(`${URL}/${teacherId}`);
        setCurrentTeacher(teacherRes.data);

        // Fetch all users
        const usersRes = await axios.get(URL);
        setAllUsers(usersRes.data);

        // Find students supervised by this teacher
        const students = usersRes.data.filter(
          (user) => user.role == "student" && user.teacherId == teacherId
        );

        setSupervisedStudents(students);

        // Collect all pending ideas from supervised students
        const ideas = [];
        students.forEach((student) => {
          if (student.ideas) {
            student.ideas.forEach((idea) => {
              if (idea.status === "pending") {
                ideas.push({
                  ...idea,
                  studentId: student.id,
                  studentName: student.username,
                  studentEmail: student.email,
                });
              }
            });
          }
        });
        setPendingIdeas(ideas);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/teacher/login");
  };

  // Handle idea approval
  const handleApproveIdea = async (idea) => {
    try {
      // Find the student who owns the idea
      const student = allUsers.find((user) => user.id === idea.studentId);

      // Update the idea status
      const updatedIdeas = student.ideas.map((i) =>
        i.id === idea.id ? { ...i, status: "accepted" } : i
      );

      // Update the student object
      const updatedStudent = {
        ...student,
        ideas: updatedIdeas,
      };

      // Update in API
      await axios.put(`${URL}/${student.id}`, updatedStudent);

      // Update local state
      setAllUsers((prev) =>
        prev.map((user) => (user.id === student.id ? updatedStudent : user))
      );

      // Remove from pending ideas
      setPendingIdeas((prev) => prev.filter((i) => i.id !== idea.id));
    } catch (error) {
      console.error("Error approving idea:", error);
    }
  };

  // Handle idea rejection
  const handleRejectIdea = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      // Find the student who owns the idea
      const student = allUsers.find(
        (user) => user.id === selectedIdea.studentId
      );

      // Update the idea status
      const updatedIdeas = student.ideas.map((i) =>
        i.id === selectedIdea.id
          ? {
              ...i,
              status: "rejected",
              rejectionReason: rejectionReason,
            }
          : i
      );

      // Update the student object
      const updatedStudent = {
        ...student,
        ideas: updatedIdeas,
      };

      // Update in API
      await axios.put(`${URL}/${student.id}`, updatedStudent);

      // Update local state
      setAllUsers((prev) =>
        prev.map((user) => (user.id === student.id ? updatedStudent : user))
      );

      // Remove from pending ideas
      setPendingIdeas((prev) => prev.filter((i) => i.id !== selectedIdea.id));

      // Close modal and reset
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedIdea(null);
    } catch (error) {
      console.error("Error rejecting idea:", error);
    }
  };

  // Get student's idea statistics
  const getStudentIdeaStats = (student) => {
    if (!student.ideas) return { accepted: 0, pending: 0, rejected: 0 };

    return {
      accepted: student.ideas.filter((i) => i.status === "accepted").length,
      pending: student.ideas.filter((i) => i.status === "pending").length,
      rejected: student.ideas.filter((i) => i.status === "rejected").length,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Teacher Dashboard
            </h1>
            <p className="text-gray-600">Welcome, {currentTeacher?.username}</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center"
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supervised Students Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Students Under Your Supervision ({supervisedStudents.length})
            </h2>

            {supervisedStudents.length > 0 ? (
              <div className="space-y-4">
                {supervisedStudents.map((student) => {
                  const stats = getStudentIdeaStats(student);
                  return (
                    <div
                      key={student.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-gray-800">
                            {student.username}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <Mail size={14} className="mr-1" />
                            {student.email}
                          </div>
                          {student.phone && (
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <Users size={14} className="mr-1" />
                              {student.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Student's ideas summary */}
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">
                          Ideas Summary:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm">
                            Accepted: {stats.accepted}
                          </div>
                          <div className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm">
                            Pending: {stats.pending}
                          </div>
                          <div className="bg-red-50 text-red-800 px-3 py-1 rounded-full text-sm">
                            Rejected: {stats.rejected}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No students assigned to you yet.</p>
                <p className="mt-2 text-sm">
                  Students will appear here once they register with your teacher
                  ID.
                </p>
              </div>
            )}
          </div>

          {/* Pending Ideas Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Pending Ideas for Review ({pendingIdeas.length})
            </h2>

            {pendingIdeas.length > 0 ? (
              <div className="space-y-4">
                {pendingIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">
                        {idea.title}
                      </h3>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        Pending
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mt-2">
                      {idea.description || "No description provided"}
                    </p>

                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <Users size={14} className="mr-1" />
                      Submitted by: {idea.studentName} ({idea.studentEmail})
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleApproveIdea(idea)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                      >
                        <Check size={16} className="mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedIdea(idea);
                          setShowRejectModal(true);
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                      >
                        <X size={16} className="mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No pending ideas for review.</p>
                <p className="mt-2 text-sm">
                  All ideas from your students have been reviewed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {showRejectModal && selectedIdea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Reject Idea: {selectedIdea.title}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Provide a reason for rejecting this idea..."
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectIdea}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
              >
                <X size={16} className="mr-1" />
                Confirm Rejection
              </button>
            </div>

            <button
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
