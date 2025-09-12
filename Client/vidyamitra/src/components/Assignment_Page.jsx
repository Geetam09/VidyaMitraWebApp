import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, User } from "lucide-react";
import axios from "axios";

export default function Assignments() {
  const [stats, setStats] = useState({
    activeAssignments: 0,
    submissionsToday: 0,
    pendingGrading: 0,
    averageScore: 0,
  });

  const [assignments, setAssignments] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace URLs with your Spring Boot API endpoints
        const statsRes = await axios.get("/api/assignments/stats");
        const assignmentsRes = await axios.get("/api/assignments");
        const recentRes = await axios.get("/api/submissions/recent");

        setStats(statsRes.data);
        setAssignments(assignmentsRes.data);
        setRecentSubmissions(recentRes.data);
      } catch (err) {
        console.error("Error fetching assignment data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assignment Management</h1>
        <div className="space-x-2">
          <Button variant="outline">Export Reports</Button>
          <Button className="bg-green-600 text-white">+ Create Assignment</Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-500">Active Assignments</p>
              <h2 className="text-2xl font-bold">{stats.activeAssignments}</h2>
            </div>
            <Calendar className="text-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-500">Submissions Today</p>
              <h2 className="text-2xl font-bold">{stats.submissionsToday}</h2>
            </div>
            <CheckCircle className="text-green-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-500">Pending Grading</p>
              <h2 className="text-2xl font-bold">{stats.pendingGrading}</h2>
            </div>
            <Clock className="text-yellow-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-500">Average Score</p>
              <h2 className="text-2xl font-bold">{stats.averageScore}%</h2>
            </div>
            <User className="text-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-2 gap-4">
        {assignments.map((a, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">{a.title}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    a.status === "active"
                      ? "bg-blue-100 text-blue-600"
                      : a.status === "grading"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {a.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{a.description}</p>
              <p className="text-sm">Due: {a.dueDate}</p>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="bg-black h-2 rounded"
                  style={{ width: `${a.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{a.submitted}/{a.total} submitted</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Submissions */}
      <div>
        <h2 className="text-lg font-bold mb-2">Recent Submissions</h2>
        <div className="space-y-2">
          {recentSubmissions.map((s, i) => (
            <Card key={i}>
              <CardContent className="flex justify-between items-center p-2">
                <div>
                  <p className="font-medium">{s.studentName}</p>
                  <p className="text-xs text-gray-500">{s.assignmentTitle}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    s.status === "submitted"
                      ? "bg-green-100 text-green-600"
                      : s.status === "graded"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {s.status}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}