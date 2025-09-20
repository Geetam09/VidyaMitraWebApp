// src/components/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, User, Mail, Lock, Phone, School, BookOpen, Clock, Eye, EyeOff } from "lucide-react";
import { apiService } from "../services/apiService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    schoolName: "",
    password: "",
    confirmPassword: "",
    subjectSpecialization: "",
    teachingExperience: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Dropdown options
  const subjects = [
    "Mathematics",
    "English",
    "Science",
    "Social Studies",
    "Hindi",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Computer Science",
    "Physical Education",
    "Arts",
    "Music",
    "Other"
  ];

  const experienceOptions = [
    "0-1 years",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10-15 years",
    "15+ years"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await apiService.register(formData);
      setSuccess("Registration successful! Please sign in.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Logo and branding */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-3 mr-3 shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">VidhyaMitra</h1>
            </div>
          </div>

          {/* Register card */}
          <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white">Join VidhyaMitra</h2>
              <p className="text-gray-300 mt-1">Create your teacher account</p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-400/50 rounded-lg text-green-300 text-sm backdrop-blur-sm">
                {success}
              </div>
            )}

            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="First name"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Last name"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white placeholder-gray-400 backdrop-blur-sm"
                    placeholder="teacher@school.edu"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white placeholder-gray-400 backdrop-blur-sm"
                    placeholder="Enter your phone number"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* School Name */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  School Name
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    name="schoolName"
                    type="text"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white placeholder-gray-400 backdrop-blur-sm"
                    placeholder="Enter your school name"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Subject Specialization and Teaching Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Subject Specialization
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <select
                      name="subjectSpecialization"
                      value={formData.subjectSpecialization}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white backdrop-blur-sm appearance-none"
                      disabled={loading}
                      required
                    >
                      <option value="" className="bg-gray-700 text-gray-300">Select subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject} className="bg-gray-700 text-white">
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Teaching Experience
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <select
                      name="teachingExperience"
                      value={formData.teachingExperience}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white backdrop-blur-sm appearance-none"
                      disabled={loading}
                      required
                    >
                      <option value="" className="bg-gray-700 text-gray-300">Select experience</option>
                      {experienceOptions.map((experience) => (
                        <option key={experience} value={experience} className="bg-gray-700 text-white">
                          {experience}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Enter password"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Confirm password"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-medium text-purple-400 hover:text-purple-300 transition"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            <p>Empowering rural education through technology</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;