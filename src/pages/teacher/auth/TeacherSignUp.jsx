// import { useState } from "react";
// import { CheckCircle, X } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router";

// const URL = "https://6823b82b65ba05803397b364.mockapi.io/users";

// export default function TeacherSignUp() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [showModal, setShowModal] = useState(false);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name || formData.name.trim().length < 4) {
//       newErrors.name = "Username must be at least 4 characters";
//     }

//     if (!formData.email.includes("@") || !formData.email.includes("tuwaiq")) {
//       newErrors.email = "Please enter a valid email";
//     }

//     if (!formData.password || formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       // Teacher user data with empty students array
//       const teacherData = {
//         username: formData.name,
//         password: formData.password,
//         email: formData.email,
//         role: "teacher",
//         phone: formData.phone || "",
//         students: []  // Initialize empty students array
//       };

//       axios.post(URL, teacherData)
//         .then(() => {
//           setShowModal(true);
//         })
//         .catch((error) => {
//           console.error("Signup failed:", error);
//         });
//     } else {
//       scrollToTop();
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       phone: ""
//     });
//     setErrors({});
//     navigate("/teacher/login");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//       <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           Teacher Sign Up
//         </h1>
        

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Username
//           </label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) => handleInputChange("name", e.target.value)}
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//               errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
//             }`}
//             placeholder="Enter your full name"
//           />
//           {errors.name && (
//             <p className="mt-1 text-sm text-red-600">{errors.name}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Email *
//           </label>
//           <input
//             type="email"
//             value={formData.email}
//             onChange={(e) => handleInputChange("email", e.target.value)}
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//               errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
//             }`}
//             placeholder="you@example.com"
//           />
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Phone
//           </label>
//           <input
//             type="tel"
//             value={formData.phone}
//             onChange={(e) => handleInputChange("phone", e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             placeholder="Phone number"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Password *
//           </label>
//           <input
//             type="password"
//             value={formData.password}
//             onChange={(e) => handleInputChange("password", e.target.value)}
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//               errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
//             }`}
//             placeholder="Create a password (min 6 characters)"
//           />
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Confirm Password *
//           </label>
//           <input
//             type="password"
//             value={formData.confirmPassword}
//             onChange={(e) =>
//               handleInputChange("confirmPassword", e.target.value)
//             }
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//               errors.confirmPassword
//                 ? "border-red-500 bg-red-50"
//                 : "border-gray-300"
//             }`}
//             placeholder="Re-enter your password"
//           />
//           {errors.confirmPassword && (
//             <p className="mt-1 text-sm text-red-600">
//               {errors.confirmPassword}
//             </p>
//           )}
//         </div>

//         <button
//           onClick={handleSubmit}
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
//         >
//           Create Teacher Account
//         </button>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
//             <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mx-auto mb-4">
//               <CheckCircle className="h-8 w-8 text-green-600" />
//             </div>
//             <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
//               Teacher Account Created!
//             </h2>
//             <p className="text-center text-gray-600 mb-4">
//               Welcome, {formData.name}!
//             </p>
//             <button
//               onClick={closeModal}
//               className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
//             >
//               Continue to Login
//             </button>
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <X size={24} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function scrollToTop() {
//   window.scrollTo({ top: 0, behavior: "smooth" });
// }