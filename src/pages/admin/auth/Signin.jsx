import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";

const URL = "https://6823b82b65ba05803397b364.mockapi.io/users";

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [timer, setTimer] = useState();

  useEffect(() => {
    localStorage.getItem("username") != null ? navigate("/admin/users") : "";
  }, []);
  
  useEffect(() => {
    if (showModal) {
      setTimer(3);
    }
  }, [showModal]);

  useEffect(() => {
    if (!showModal || timer <= 0) return;
    const timeoutId = setTimeout(() => {
      setTimer(timer - 1);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [showModal, timer]);

  useEffect(() => {
    if (showModal && timer === 0) {
      setShowModal(false);
      navigate("/admin/users");
    }
  }, [showModal, timer, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 4) {
      newErrors.name = "Username must be at least 4 characters";
    }
    if (!formData.password || formData.password.length < 3) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleLogin = async () => {
    if (!validateForm()) return scrollToTop();

    try {
      const res = await axios.get(URL);
      const found = res.data.find(
        (u) => u.username === formData.name && u.password === formData.password
      );
      if (found) {
        localStorage.setItem("id", found.id);
        localStorage.setItem("username", found.username);
        localStorage.setItem("role", found.role);
        setUser(found);
        setShowModal(true);
      } else {
        setErrors({ password: "Incorrect username or password" });
      }
    } catch {
      alert("Login failed. Please try again later.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    console.log(localStorage.getItem("role"));
    
    if(localStorage.getItem("role") == "admin"){
      navigate("/admin/users");
    } else{
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin SignIn
        </h1>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Enter your username"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Login
        </button>
        
        {/* Demo credentials note */}
        <div className="text-center mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Demo Access:</strong> Use username <span className="font-mono">admin </span> 
            , password <span className="font-mono">admin</span>
          </p>
        </div>
      </div>

      {showModal && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-center text-gray-600 mb-2">
              Logged in as{" "}
              <span className="font-semibold">{user.username}</span>
            </p>
            <p className="text-center text-sm text-gray-500 mb-4">
              Redirecting in <span className="font-medium">{timer}</span>s…
            </p>
            <button
              onClick={closeModal}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
            >
              Go to Home Now
            </button>
            <button
              onClick={closeModal}
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

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}