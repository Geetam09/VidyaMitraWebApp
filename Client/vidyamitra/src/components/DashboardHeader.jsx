import { GraduationCap, Globe, MessageSquare, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = ({
  firstName = "Teacher",
  unreadMessages = 0,
  onLogout,
  children,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication tokens from localStorage
    ["token", "teacherId", "authToken"].forEach((key) => localStorage.removeItem(key));

    if (onLogout) onLogout();
    navigate("/"); // Redirect to login/home page
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div className="flex items-center group">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-2 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-800">VidhyaMitra</h1>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-6">
            {/* Globe and Messages */}
            <div className="flex items-center space-x-4">
              <Globe className="h-5 w-5 text-gray-500 cursor-pointer hover:scale-110 transition-transform duration-300" />

              <div className="relative cursor-pointer">
                <MessageSquare className="h-5 w-5 text-gray-500 hover:scale-110 transition-transform duration-300" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {unreadMessages}
                  </span>
                )}
              </div>
            </div>

            {/* Greeting */}
            <div className="text-gray-700 font-medium hidden sm:block">
              Good morning,{" "}
              <span className="text-purple-600 font-semibold">{firstName}</span>!
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Logout
            </button>
          </div>
        </div>

        {/* Optional children (e.g., breadcrumbs or filters) */}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </header>
  );
};

export default DashboardHeader;
