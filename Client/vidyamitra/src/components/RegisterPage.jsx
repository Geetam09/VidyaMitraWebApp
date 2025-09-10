// src/components/RegisterPage.jsx
import { useState } from "react";
import { User } from "lucide-react";
import { apiService } from "../services/apiService";
import { GraduationCap } from "lucide-react";

const RegisterPage = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    schoolName: "",
    subjectSpecialization: "",
    teachingExperience: "",
    password: "",
    confirmPassword: ""
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Prepare data for API (remove confirmPassword)
      const { confirmPassword, ...apiData } = formData;
      
      const result = await apiService.register(apiData);
      setSuccess("Registration successful! Please sign in.");
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-xl overflow-hidden">
        {/* Header Section with Blue Background */}
        <div className="bg-green-600 text-white p-6">
          <div className="flex flex-col items-center">
            <div className="bg-green-600 rounded-full ">
              <GraduationCap className="h-15 w-15 p-2 text-black shadow-lg" />
            </div>
            <h1 className="text-xl font-semibold text-black">
              Join EduRural
            </h1>
            <p className="text-green-100 text-center mt-1">Create your teacher account and start managing your classes</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800">Create Account</h2>
            <p className="text-sm text-gray-600">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                 className="w-full px-4 py-2 text-black rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-black rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 text-black rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 text-black rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
                disabled={loading}
                required
              />
            </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name
              </label>
              <input
                name="schoolName"
                type="text"
                value={formData.schoolName}
                onChange={handleChange}
                className="w-full px-4 py-2 text-black rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
                disabled={loading}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Specialization
              </label>
              <select
                name="subjectSpecialization"
                value={formData.subjectSpecialization}
                onChange={handleChange}
                className="w-full px-4 py-2 text-black rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
                disabled={loading}
                required
              >
                <option value="">Select your subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Languages">Languages</option>
                <option value="Arts">Arts</option>
                <option value="Physical Education">Physical Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teaching Experience
              </label>
              <select
                name="teachingExperience"
                value={formData.teachingExperience}
                onChange={handleChange}
                className="w-full px-4 py-2 text-black rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
                disabled={loading}
                required
              >
                <option value="">Select experience</option>
                <option value="0-2 years">0-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="6-10 years">6-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full px-4 py-2 text-black rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 text-black rounded-lg outline outline-green-400 focus:ring-2 focus:ring-green-400"
                disabled={loading}
                required
              />
            </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={loading}
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 text-center text-xs text-gray-500">
          EduRural Teacher Management System
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;