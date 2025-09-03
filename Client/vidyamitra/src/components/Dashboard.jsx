// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { GraduationCap, LogOut, BookOpen, Users, Settings, Mail, Book, User } from "lucide-react";
import { apiService } from "../services/apiService";

const Dashboard = ({ onLogout, token, teacherId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("Dashboard props received:", { token, teacherId });

  useEffect(() => {
    console.log("Dashboard useEffect triggered with:", { token, teacherId });
    
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for teacherId:", teacherId);
        const profileData = await apiService.getTeacherById(token, teacherId);
        console.log("Profile data received:", profileData);
        setProfile(profileData);
        setError("");
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError("Failed to load profile. Please try again.");
        // Don't logout immediately, just show error
      } finally {
        setLoading(false);
      }
    };

    if (token && teacherId) {
      fetchProfile();
    } else {
      console.log("Missing token or teacherId, cannot fetch profile");
      setLoading(false);
    }
  }, [token, teacherId, onLogout]);

  const handleLogout = () => {
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-green-600 rounded-lg p-2">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">EduRural</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {profile?.firstName || 'Teacher'}!
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Welcome to your Dashboard, {profile?.firstName || 'Teacher'}!
          </h2>
          <p className="text-green-100">
            Manage your classes, track student progress, and access teaching resources.
          </p>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <User className="w-6 h-6 mr-2 text-blue-600" />
              Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-lg">
                    {profile.firstName} {profile.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-lg">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Book className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subject</p>
                  <p className="font-medium text-lg">{profile.subjectTaught || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Classes</p>
                  <p className="font-medium text-lg">{profile.classCount} Classes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer group">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">My Classes</h3>
            </div>
            <p className="text-gray-600 text-sm">Manage your classes and course content</p>
            <div className="mt-4 text-blue-600 text-sm font-medium">
              {profile?.classCount || 0} active classes
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer group">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-lg p-3 group-hover:bg-green-200 transition-colors">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Students</h3>
            </div>
            <p className="text-gray-600 text-sm">View and manage student information</p>
            <div className="mt-4 text-green-600 text-sm font-medium">
              Manage student progress
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer group">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-lg p-3 group-hover:bg-purple-200 transition-colors">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Settings</h3>
            </div>
            <p className="text-gray-600 text-sm">Configure your account preferences</p>
            <div className="mt-4 text-purple-600 text-sm font-medium">
              Update profile settings
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Teaching Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{profile?.classCount || 0}</div>
              <div className="text-sm text-gray-600">Total Classes</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-gray-600">Assignments</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Question Papers</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;