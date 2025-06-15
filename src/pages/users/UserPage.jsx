import { useState, useEffect } from "react";
import { PlusCircle, Mail, Users, LogOut, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";

const URL = "https://6823b82b65ba05803397b364.mockapi.io/users";

export default function StudentPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [approvedIdeas, setApprovedIdeas] = useState([]);
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "" });
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [formError, setFormError] = useState("");
  const [assignedTeacher, setAssignedTeacher] = useState(null);

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/user/login");
  };

  useEffect(() => {
    localStorage.getItem("username") == null ? navigate("/user/login") : "";
    localStorage.getItem("role") == "user" ? navigate("/user/") : "";
    localStorage.getItem("role") == "teacher" ? navigate("/teacher/") : "";
  }, []);

  // Fetch current user and all users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("id");
        const usersRes = await axios.get(URL);

        setAllUsers(usersRes.data);

        const current = usersRes.data.find((user) => user.id == userId);

        if (current) {
          setCurrentUser(current);

          // Find assigned teacher if exists
          if (current.teacherId) {
            const teacher = usersRes.data.find(
              (user) => user.id === current.teacherId && user.role === "teacher"
            );
            if (teacher) {
              setAssignedTeacher(teacher);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Update approved ideas whenever users change
  useEffect(() => {
    if (allUsers.length > 0) {
      const approved = [];
      allUsers.forEach((user) => {
        if (user.ideas) {
          user.ideas.forEach((idea) => {
            if (idea.status === "accepted") {
              approved.push({
                ...idea,
                creatorId: user.id,
                creatorName: user.username,
              });
            }
          });
        }
      });
      setApprovedIdeas(approved);
    }
  }, [allUsers]);

  // Handle input changes for new idea form
  const handleIdeaInputChange = (e) => {
    const { name, value } = e.target;
    setNewIdea((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  // Submit new idea
  const submitNewIdea = async () => {
    if (!newIdea.title.trim()) {
      setFormError("Title is required!");
      return;
    }

    // Check if idea already exists in approved ideas (case-insensitive)
    const isApprovedDuplicate = approvedIdeas.some(
      (idea) => idea.title.toLowerCase() === newIdea.title.trim().toLowerCase()
    );

    if (isApprovedDuplicate) {
      setFormError(
        "This idea title already exists in approved ideas. Please choose a different title."
      );
      return;
    }

    // Check if user already has this idea (case-insensitive)
    const userHasIdea = currentUser.ideas?.some(
      (idea) => idea.title.toLowerCase() === newIdea.title.trim().toLowerCase()
    );

    if (userHasIdea) {
      setFormError("You've already submitted this idea.");
      return;
    }

    try {
      const ideaData = {
        id: Date.now().toString(),
        title: newIdea.title,
        description: newIdea.description,
        status: "pending",
        rejectionReason: "",
        createdAt: new Date().toISOString(),
        // Assign the teacher to the idea if available
        teacherId: currentUser.teacherId || "",
      };

      // Add the new idea to current user's ideas
      const updatedUser = {
        ...currentUser,
        ideas: [...(currentUser.ideas || []), ideaData],
      };

      // Update user in API
      await axios.put(`${URL}/${currentUser.id}`, updatedUser);

      // Update local state
      setCurrentUser(updatedUser);
      setAllUsers((prev) =>
        prev.map((user) => (user.id === currentUser.id ? updatedUser : user))
      );

      // Reset form
      setNewIdea({ title: "", description: "" });
      setShowIdeaForm(false);
      setFormError("");
    } catch (error) {
      console.error("Error submitting idea:", error);
      setFormError("Failed to submit idea. Please try again.");
    }
  };

  // Get teacher by ID
  const getTeacher = (teacherId) => {
    return allUsers.find(
      (user) => user.id === teacherId && user.role === "teacher"
    );
  };

  // Get team members by idea ID
  const getTeamMembers = (ideaId) => {
    if (!ideaId || !allUsers.length) return [];

    const members = [];
    allUsers.forEach((user) => {
      if (user.ideas && user.ideas.some((idea) => idea.id === ideaId)) {
        members.push({
          id: user.id,
          name: user.username,
          email: user.email,
          phone: user.phone,
        });
      }
    });

    return members;
  };

  if (!currentUser) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with logout button */}
        <header className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Student Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {currentUser.username}
            </p>

            {/* Display assigned teacher */}
            {assignedTeacher && (
              <div className="mt-3 flex items-center">
                <div className="ml-3">
                  <p className="font-medium">Assigned Teacher</p>
                  <p className="text-gray-600 text-sm">
                    {assignedTeacher.username} ({assignedTeacher.email})
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowIdeaForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center"
            >
              <PlusCircle className="mr-2" size={18} />
              Add New Idea
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center"
            >
              <LogOut className="mr-2" size={18} />
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Ideas Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Ideas</h2>

            {currentUser.ideas && currentUser.ideas.length > 0 ? (
              <div className="space-y-4">
                {currentUser.ideas.map((idea) => (
                  <div
                    key={idea.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                      idea.status === "accepted"
                        ? "border-green-200 bg-green-50"
                        : idea.status === "rejected"
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedIdea(idea)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800">
                        {idea.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          idea.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : idea.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {idea.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {idea.description || "No description"}
                    </p>

                    {idea.status === "rejected" && idea.rejectionReason && (
                      <div className="mt-2 text-red-600 text-sm">
                        <strong>Reason: </strong>
                        {idea.rejectionReason}
                      </div>
                    )}

                    {idea.teacherId && (
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <Users size={14} className="mr-1" />
                        Teacher:{" "}
                        {getTeacher(idea.teacherId)?.username || "Unknown"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't submitted any ideas yet.</p>
                <button
                  onClick={() => setShowIdeaForm(true)}
                  className="mt-3 text-blue-500 hover:text-blue-700 flex items-center justify-center"
                >
                  <PlusCircle className="mr-1" size={16} />
                  Create your first idea
                </button>
              </div>
            )}
          </div>

          {/* Approved Ideas Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Approved Ideas (Avoid Duplication)
            </h2>

            {approvedIdeas.length > 0 ? (
              <div className="space-y-4">
                {approvedIdeas.map((idea) => (
                  <div
                    key={`approved-${idea.id}`}
                    className="border border-green-200 bg-green-50 rounded-lg p-4"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">
                        {idea.title}
                      </h3>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Approved
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {idea.description || "No description"}
                    </p>

                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <Users size={14} className="mr-1" />
                      Submitted by: {idea.creatorName}
                    </div>

                    {idea.teacherId && (
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Users size={14} className="mr-1" />
                        Teacher:{" "}
                        {getTeacher(idea.teacherId)?.username || "Unknown"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No approved ideas yet. Be the first to get your idea approved!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Idea Modal */}
      {showIdeaForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Submit New Idea
            </h2>

            {/* Form error message */}
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={newIdea.title}
                  onChange={handleIdeaInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Your innovative idea title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newIdea.description}
                  onChange={handleIdeaInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your idea in detail"
                  rows={4}
                />
              </div>

              {/* Show assigned teacher for the idea */}
              {assignedTeacher && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">
                    This idea will be assigned to:{" "}
                    <span className="font-medium">
                      {assignedTeacher.username}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowIdeaForm(false);
                  setFormError("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitNewIdea}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
              >
                <Mail size={16} className="mr-1" />
                Submit to Admin
              </button>
            </div>

            <button
              onClick={() => {
                setShowIdeaForm(false);
                setFormError("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Idea Detail Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedIdea.title}
              </h2>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  selectedIdea.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : selectedIdea.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {selectedIdea.status}
              </span>
            </div>

            <p className="text-gray-600 mb-6">
              {selectedIdea.description || "No description provided"}
            </p>

            {selectedIdea.status === "rejected" &&
              selectedIdea.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-red-800 mb-1">
                    Rejection Reason
                  </h3>
                  <p className="text-red-700">{selectedIdea.rejectionReason}</p>
                </div>
              )}

            {/* Teacher Information */}
            {selectedIdea.teacherId && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">
                  Assigned Teacher
                </h3>
                <div className="flex items-center bg-gray-50 rounded-lg p-3">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <p className="font-medium">
                      {getTeacher(selectedIdea.teacherId)?.username ||
                        "Unknown"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {getTeacher(selectedIdea.teacherId)?.email || "No email"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members */}
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Team Members</h3>
              <div className="space-y-3">
                {getTeamMembers(selectedIdea.id).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center bg-gray-50 rounded-lg p-3"
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                    <div className="ml-3">
                      <p className="font-medium">{member.name}</p>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Mail size={12} className="mr-1" />
                        {member.email || "No email"}
                      </div>
                      {member.phone && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Users size={12} className="mr-1" />
                          {member.phone}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedIdea(null)}
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
