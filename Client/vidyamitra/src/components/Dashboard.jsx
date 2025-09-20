import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  LogOut, 
  BookOpen, 
  Users, 
  Settings, 
  Mail, 
  Book, 
  User, 
  Clock,
  MessageSquare,
  Plus,
  BarChart3,
  Calendar,
  TrendingUp,
  Award,
  Globe,
  Sidebar
} from "lucide-react";
import { apiService } from "../services/apiService";
// import { apiService } from "../services/apiService";
import FloatingChatbot from "./FloatingChatbot";
import SidebarLayout from "./SidebarLayout";

const Dashboard = ({ token, teacherId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animateCards, setAnimateCards] = useState(false); // Add this state for animation control
  const navigate = useNavigate();

  // Mock data for charts and stats
  const staticData = {
    todaysClasses: 4,
    totalStudents: 95,
    activeAssignments: 8,
    unreadMessages: 3,
    attendanceData: {
      present: 83,
      absent: 12,
      late: 5
    },
    subjectPerformance: [
      { subject: 'Math', score: 85 },
      { subject: 'Science', score: 78 },
      { subject: 'English', score: 82 },
      { subject: 'Social', score: 75 }
    ],
    weeklyAttendance: [
      { day: 'Mon', percentage: 92 },
      { day: 'Tue', percentage: 88 },
      { day: 'Wed', percentage: 94 },
      { day: 'Thu', percentage: 87 },
      { day: 'Fri', percentage: 91 }
    ],
    assignmentProgress: [
      { week: 1, completed: 65, submitted: 91 },
      { week: 2, completed: 78, submitted: 88 },
      { week: 3, completed: 85, submitted: 95 },
      { week: 4, completed: 94, submitted: 91 }
    ],
    todaysSchedule: [
      { subject: 'Mathematics', grade: '8A', room: '12', time: '09:00 AM', status: 'ongoing' },
      { subject: 'Science', grade: '7B', room: 'Lab 1', time: '10:30 AM', status: 'upcoming' },
      { subject: 'English', grade: '9A', room: '15', time: '01:00 PM', status: 'upcoming' },
      { subject: 'Mathematics', grade: '8B', room: '12', time: '02:30 PM', status: 'upcoming' }
    ],
    classAttendance: [
      { grade: '8A', present: 28, total: 32, percentage: 87.5 },
      { grade: '7B', present: 25, total: 28, percentage: 89.3 },
      { grade: '9A', present: 30, total: 35, percentage: 85.7 }
    ]
  };

  console.log("Dashboard props received:", { token, teacherId });

  useEffect(() => {
    console.log("Dashboard useEffect triggered with:", { token, teacherId });

    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for teacherId:", teacherId);
        const profileData = await apiService.getTeacherById(teacherId, token);
        console.log("Profile data received:", profileData);
        setProfile(profileData);
        setError("");
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError("Failed to load profile. Please try again.");
        handleLogout(); // <-- use this instead of onLogout()
      } finally {
        setLoading(false);
      }
    };

    if (token && teacherId) {
      fetchProfile();
      setTimeout(() => setAnimateCards(true), 100); // Add this line
    } else {
      setLoading(false);
      setAnimateCards(true); // Add this line for fallback
    }
  }, [token, teacherId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-purple-600"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Loading Dashboard</h2>
          <p className="text-gray-600">Preparing your teaching insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md mx-auto">
          <div className="text-red-500 mb-4 text-lg">⚠️ {error}</div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition"
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
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center group">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-2 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-800">VidhyaMitra</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Globe className="h-5 w-5 text-gray-500 cursor-pointer transform hover:scale-110 transition-all duration-300" />
                <div className="relative cursor-pointer">
                  <MessageSquare className="h-5 w-5 text-gray-500 transform hover:scale-110 transition-all duration-300" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {staticData.unreadMessages}
                  </span>
                </div>
              </div>
              
              <div className="text-gray-700 font-medium">
                Good morning, <span className="text-purple-600 font-semibold">{profile?.firstName || 'Teacher'}</span>!
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
              >
                <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-8">
          <div className={`transform transition-all duration-1000 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Good morning, <span className="text-purple-600">{profile?.firstName || 'Teacher'}</span>!
            </h2>
            <p className="text-gray-600 text-lg">Here's what's happening in your classes today</p>
          </div>
          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl flex items-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
            <Plus className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            Quick Add
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Today's Classes", value: staticData.todaysClasses, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Students", value: staticData.totalStudents, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Active Assignments", value: staticData.activeAssignments, icon: BookOpen, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Unread Messages", value: staticData.unreadMessages, icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" }
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 hover:scale-105 hover:shadow-xl group ${
                animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                </div>
                <div className={`${stat.bg} rounded-2xl p-3 group-hover:scale-110 transition-all duration-300`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Today's Attendance Distribution */}
          <div className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 hover:shadow-xl ${
            animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`} style={{ transitionDelay: '400ms' }}>
            <div className="flex items-center mb-4">
              <div className="bg-green-50 rounded-lg p-2 mr-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Today's Attendance Distribution</h3>
                <p className="text-sm text-gray-500">Overall attendance breakdown</p>
              </div>
            </div>
            
            {/* Donut Chart */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-44 h-44">
                <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="35" stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="35" stroke="#10b981" strokeWidth="12" fill="transparent"
                    strokeDasharray={`${staticData.attendanceData.present * 2.2} 220`}
                    strokeLinecap="round" className="transition-all duration-1000"
                  />
                  <circle
                    cx="50" cy="50" r="35" stroke="#ef4444" strokeWidth="12" fill="transparent"
                    strokeDasharray={`${staticData.attendanceData.absent * 2.2} 220`}
                    strokeDashoffset={-staticData.attendanceData.present * 2.2}
                    strokeLinecap="round" className="transition-all duration-1000"
                  />
                  <circle
                    cx="50" cy="50" r="35" stroke="#f59e0b" strokeWidth="12" fill="transparent"
                    strokeDasharray={`${staticData.attendanceData.late * 2.2} 220`}
                    strokeDashoffset={-(staticData.attendanceData.present + staticData.attendanceData.absent) * 2.2}
                    strokeLinecap="round" className="transition-all duration-1000"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Present', value: `${staticData.attendanceData.present}%`, color: 'bg-green-500' },
                { label: 'Absent', value: `${staticData.attendanceData.absent}%`, color: 'bg-red-500' },
                { label: 'Late', value: `${staticData.attendanceData.late}%`, color: 'bg-yellow-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${item.color} rounded-full mr-2`}></div>
                    <span className="text-gray-600 text-sm">{item.label}: {item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Performance Overview */}
          <div className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 hover:shadow-xl ${
            animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`} style={{ transitionDelay: '500ms' }}>
            <div className="flex items-center mb-6">
              <div className="bg-blue-50 rounded-lg p-2 mr-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Subject Performance Overview</h3>
                <p className="text-sm text-gray-500">Average scores by subject</p>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="relative h-48 mb-4">
              <div className="absolute inset-0 flex items-end justify-between px-2">
                {staticData.subjectPerformance.map((subject, index) => (
                  <div key={index} className="flex flex-col items-center w-16">
                    <div className="relative w-12 bg-gray-100 rounded-t-lg mb-2" style={{ height: '140px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-1000"
                        style={{ 
                          height: animateCards ? `${(subject.score / 100) * 140}px` : '0px',
                          transitionDelay: `${index * 200 + 500}ms`
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 text-center font-medium">{subject.subject}</span>
                  </div>
                ))}
              </div>
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-8">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Attendance Trend */}
          <div className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 hover:shadow-xl ${
            animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`} style={{ transitionDelay: '600ms' }}>
            <div className="flex items-center mb-6">
              <div className="bg-purple-50 rounded-lg p-2 mr-3">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Weekly Attendance Trend</h3>
                <p className="text-sm text-gray-500">Attendance percentage over the week</p>
              </div>
            </div>
            
            {/* Line Chart Representation */}
            <div className="relative h-32 mb-4">
              <svg className="w-full h-full" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[20, 40, 60, 80].map((y) => (
                  <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                ))}
                {/* Data line */}
                <polyline
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  points={staticData.weeklyAttendance.map((item, index) => 
                    `${index * 60 + 30},${100 - item.percentage}`
                  ).join(' ')}
                  className={`transition-all duration-1000 ${animateCards ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Data points */}
                {staticData.weeklyAttendance.map((item, index) => (
                  <circle
                    key={index}
                    cx={index * 60 + 30}
                    cy={100 - item.percentage}
                    r="4"
                    fill="#8b5cf6"
                    className={`transition-all duration-1000 ${animateCards ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: `${index * 100 + 600}ms` }}
                  />
                ))}
              </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              {staticData.weeklyAttendance.map((item) => (
                <span key={item.day}>{item.day}</span>
              ))}
            </div>
          </div>

          {/* Assignment Progress */}
          <div className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 hover:shadow-xl ${
            animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`} style={{ transitionDelay: '700ms' }}>
            <div className="flex items-center mb-6">
              <div className="bg-green-50 rounded-lg p-2 mr-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Assignment Progress</h3>
                <p className="text-sm text-gray-500">Completion vs submission rates over time</p>
              </div>
            </div>
            
            {/* Area Chart */}
            <div className="relative h-32 mb-4">
              <svg className="w-full h-full" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="completedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="submittedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                
                {/* Completed area */}
                <path
                  d={`M 0,${100 - staticData.assignmentProgress[0].completed} 
                      L 100,${100 - staticData.assignmentProgress[1].completed} 
                      L 200,${100 - staticData.assignmentProgress[2].completed} 
                      L 300,${100 - staticData.assignmentProgress[3].completed} 
                      L 300,100 L 0,100 Z`}
                  fill="url(#completedGradient)"
                  className={`transition-all duration-1000 ${animateCards ? 'opacity-100' : 'opacity-0'}`}
                />
                
                {/* Submitted area */}
                <path
                  d={`M 0,${100 - staticData.assignmentProgress[0].submitted} 
                      L 100,${100 - staticData.assignmentProgress[1].submitted} 
                      L 200,${100 - staticData.assignmentProgress[2].submitted} 
                      L 300,${100 - staticData.assignmentProgress[3].submitted} 
                      L 300,100 L 0,100 Z`}
                  fill="url(#submittedGradient)"
                  className={`transition-all duration-1000 ${animateCards ? 'opacity-100' : 'opacity-0'}`}
                />
                
                {/* Lines */}
                <polyline
                  fill="none" stroke="#10b981" strokeWidth="2"
                  points={staticData.assignmentProgress.map((item, index) => 
                    `${index * 100},${100 - item.completed}`
                  ).join(' ')}
                  className={`transition-all duration-1000 ${animateCards ? 'opacity-100' : 'opacity-0'}`}
                />
                <polyline
                  fill="none" stroke="#3b82f6" strokeWidth="2"
                  points={staticData.assignmentProgress.map((item, index) => 
                    `${index * 100},${100 - item.submitted}`
                  ).join(' ')}
                  className={`transition-all duration-1000 ${animateCards ? 'opacity-100' : 'opacity-0'}`}
                />
              </svg>
              
              {/* Tooltip for Week 4 */}
              <div className="absolute top-2 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                <div className="text-xs font-semibold text-gray-700 mb-1">Week 4</div>
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600">Completed: 94%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs text-blue-600">Submitted: 91%</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Schedule and Class Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Schedule */}
          <div className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 hover:shadow-xl ${
            animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`} style={{ transitionDelay: '800ms' }}>
            <div className="flex items-center mb-6">
              <div className="bg-orange-50 rounded-lg p-2 mr-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Today's Schedule</h3>
            </div>
            
            <div className="space-y-4">
              {staticData.todaysSchedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 group border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${item.status === 'ongoing' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    <div>
                      <p className="text-gray-800 font-semibold group-hover:text-blue-600 transition-colors duration-300">{item.subject}</p>
                      <p className="text-gray-500 text-sm">{item.grade} • Room {item.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-700 font-medium">{item.time}</p>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      item.status === 'ongoing' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Attendance */}
          <div className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 transform transition-all duration-700 hover:shadow-xl ${
            animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`} style={{ transitionDelay: '900ms' }}>
            <div className="flex items-center mb-6">
              <div className="bg-blue-50 rounded-lg p-2 mr-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Class Attendance</h3>
            </div>
            
            <div className="space-y-6">
              {staticData.classAttendance.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-semibold text-lg">{item.grade}</span>
                    <span className="text-gray-600">
                      <span className="text-gray-800 font-medium">{item.present}</span>/{item.total}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                        style={{ 
                          width: animateCards ? `${item.percentage}%` : '0%',
                          transitionDelay: `${index * 200 + 900}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">{item.percentage}% present</span>
                    <span className="text-green-600 text-sm font-medium">Excellent</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <FloatingChatbot/>
      <SidebarLayout/>
    </div>
  );
};

export default Dashboard;