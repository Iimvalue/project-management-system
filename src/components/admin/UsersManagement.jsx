import React, { useState, useEffect } from "react";
import axios from "axios";

const USERS_URL = "https://6823b82b65ba05803397b364.mockapi.io/users";

export default function UserManagement() {
  const [teachers, setTeachers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
    phone: "",
    teacherId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch teachers from the API
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(USERS_URL);
      const teachersData = data.filter((u) => u.role === "teacher");
      setTeachers(teachersData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch teachers");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new user
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const userToAdd = newUser.role === "student" ? newUser : { ...newUser, teacherId: "" };
      await axios.post(USERS_URL, userToAdd);
      setNewUser({
        username: "",
        password: "",
        email: "",
        role: "",
        phone: "",
        teacherId: "",
      });
    } catch (error) {
      setError("Failed to add user");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">User Management</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-gray-600">Loading...</div>}
      {!loading && (
        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Add New Student or Teacher</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                className="border rounded p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                className="border rounded p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                className="border rounded p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
            </div>
            <div>
              <label className="block text-gray-700">Role</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className="border rounded p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            {newUser.role === "student" && (
              <div>
                <label className="block text-gray-700">Select Teacher</label>
                <select
                  name="teacherId"
                  value={newUser.teacherId}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.username}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={newUser.phone}
                onChange={handleInputChange}
                className="border rounded p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Add User
            </button>
          </form>
        </section>
      )}
    </div>
  );
}