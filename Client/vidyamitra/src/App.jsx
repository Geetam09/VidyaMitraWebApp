// App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import StudentsPage from "./components/StudentsPage";
import AttendancePage from "./components/AttendancePage";
import TestPapersPage from "./components/TestPapersPage";
import AssignmentsPage from "./components/AssignmentsPage";
import TimetablePage from "./components/TimetablePage";
import ResourceLibraryPage from "./components/ResourceLibraryPage";
import CommunityPage from "./components/CommunityPage";
import SettingsPage from "./components/SettingsPage";

import ProfilePage from "./components/ProfilePage";
import SidebarLayout from "./components/SidebarLayout";
import VidhyaMitraLanding from "./components/VidhyaMitraLanding";
import Dashboard from "./components/Dashboard"; // Use Dashboard instead of DashboardPage
import './App.css';
import TestPapersList from "./components/TestPapersList";

// Wrapper to persist login and redirect
const ProtectedRoute = ({ token, teacherId, children }) => {
  if (!token || !teacherId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [teacherId, setTeacherId] = useState(() => localStorage.getItem("teacherId") || null);

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<VidhyaMitraLanding />} />

        {/* Register Page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard (protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token} teacherId={teacherId}>
              <Dashboard token={token} teacherId={teacherId} />
            </ProtectedRoute>
          }
        />

        <Route element={<SidebarLayout />}>
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/test-papers" element={<TestPapersPage />} />
          <Route path="/test-papers-list" element={<TestPapersList />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/resources" element={<ResourceLibraryPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
