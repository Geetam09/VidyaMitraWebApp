import { Home, Users, Calendar, FileText, BookOpen, MessageSquare, Settings } from "lucide-react";

export default function SidebarLayout({ children, onLogout }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold text-green-600">EduRural</div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={<Home size={18} />} label="Dashboard" />
          <SidebarItem icon={<Users size={18} />} label="Students" />
          <SidebarItem icon={<Calendar size={18} />} label="Attendance" />
          <SidebarItem icon={<FileText size={18} />} label="Test Papers" />
          <SidebarItem icon={<BookOpen size={18} />} label="Assignments" />
          <SidebarItem icon={<Calendar size={18} />} label="Timetable" />
          <SidebarItem icon={<MessageSquare size={18} />} label="Community" badge="3" />
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </nav>

        {/* Teacher info + Logout */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
              MA
            </div>
            <div>
              <p className="font-semibold">Ms. Anderson</p>
              <p className="text-sm text-gray-500">Mathematics Teacher</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-3 w-full text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

function SidebarItem({ icon, label, badge }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
      <div className="flex items-center space-x-2">
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}
