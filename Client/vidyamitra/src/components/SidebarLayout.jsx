import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { apiService } from '../services/apiService';
import {
  LayoutDashboard, Users, CalendarCheck, FileText, BookOpen, Clock, Library,
  MessageCircle, Settings, User, LogOut, Menu, ChevronLeft
} from "lucide-react";
import "./SidebarLayout.css";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Students", path: "/students", icon: <Users size={18} /> },
  { name: "Attendance", path: "/attendance", icon: <CalendarCheck size={18} /> },
  { name: "Test Papers", path: "/test-papers", icon: <FileText size={18} /> },
  { name: "Assignments", path: "/assignments", icon: <BookOpen size={18} /> },
  { name: "Timetable", path: "/timetable", icon: <Clock size={18} /> },
  { name: "Resource Library", path: "/resources", icon: <Library size={18} /> },
  { name: "Community", path: "/community", icon: <MessageCircle size={18} /> },
  { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  { name: "Profile", path: "/profile", icon: <User size={18} /> },
];

const SidebarLayout = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const teacherId = localStorage.getItem('teacherId');
        
        if (token && teacherId) {
          const teacherData = await apiService.getTeacherById(teacherId, token);
          setTeacher(teacherData);
        } else {
          // If no token or teacherId, redirect to login
          navigate("/login");
        }
      } catch (error) {
        console.error('Failed to fetch teacher profile:', error);
        // If token is invalid, clear storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('teacherId');
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('teacherId');
    setTeacher(null);
    navigate("/login");
  };

  // Format teacher name with appropriate title
  const getTeacherName = () => {
    if (loading) return "Loading...";
    if (!teacher) return "Teacher";
    
    const title = teacher.gender?.toLowerCase() === 'male' ? 'Mr.' : 'Ms.';
    return `${title} ${teacher.firstName || ''} ${teacher.lastName || ''}`.trim();
  };

  // Get teacher subject or default role
  const getTeacherRole = () => {
    if (loading) return "Loading...";
    if (!teacher) return "Teacher";
    
    return teacher.subject ? `${teacher.subject} Teacher` : "Teacher";
  };

  // Show loading state while fetching teacher data
  if (loading) {
    return (
      <div className="sidebar-layout">
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-layout">
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            {isOpen && <span className="logo-text">VidhyaMitra</span>}
            <button 
              className="sidebar-toggle-btn" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <div className="sidebar-profile">
            <div className="profile-icon">
              <User size={isOpen ? 32 : 28} />
            </div>
            {isOpen && (
              <div className="profile-info">
                <div className="sidebar-profile-name">{getTeacherName()}</div>
                <div className="sidebar-profile-role">{getTeacherRole()}</div>
              </div>
            )}
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                  title={item.name}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  {isOpen && <span className="sidebar-link-text">{item.name}</span>}
                  {!isOpen && (
                    <span className="tooltip">{item.name}</span>
                  )}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                className="sidebar-link logout"
                onClick={handleLogout}
                title="Logout"
              >
                <span className="sidebar-icon"><LogOut size={18}/></span>
                {isOpen && <span className="sidebar-link-text">Logout</span>}
                {!isOpen && (
                  <span className="tooltip">Logout</span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      <div 
        className={`mobile-overlay ${isOpen ? "active" : ""}`} 
        onClick={() => setIsOpen(false)}
      />
      
      <main className={`main-content ${isOpen ? "" : "expanded"}`}>
        <button 
          className="sidebar-fab" 
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;