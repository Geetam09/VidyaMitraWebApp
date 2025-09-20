// router/AppRouter.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";

// Import your components
import Dashboard from "../components/Dashboard";
import VidhyaMitraLanding from "../components/VidhyaMitraLanding";
import RegisterPage from "../components/RegisterPage";
import LoginPage from "../components/LoginPage";
import FloatingChatbot from "../components/FloatingChatbot";

// Component to persist the current route
const PersistedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Save the current path to localStorage on route change
  useEffect(() => {
    localStorage.setItem("currentPath", location.pathname);
  }, [location]);

  // On initial load, redirect to the saved path if it exists
  useEffect(() => {
    const savedPath = localStorage.getItem("currentPath");
    if (savedPath && savedPath !== location.pathname) {
      navigate(savedPath, { replace: true });
    }
  }, [navigate, location.pathname]);

  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <PersistedRoute>
        <Routes>
          <Route path="/" element={<VidhyaMitraLanding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chatbot" element={<FloatingChatbot />} />
          {/* Add more routes here if needed */}
        </Routes>
      </PersistedRoute>
    </Router>
  );
};

export default AppRouter;
