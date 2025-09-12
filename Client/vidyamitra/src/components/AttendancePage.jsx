import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Users, LeafyGreen } from "lucide-react";

export default function AttendancePage({ token, teacherId }) {
  const [students, setStudents] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    rate: 0,
  });

  // ✅ Fetch students list from API when page loads
  useEffect(() => {
    // Example: Replace with your backend API
    // fetch(`/api/students?teacherId=${teacherId}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setStudents(data);
    //   })
    //   .catch((err) => console.error("Failed to load students:", err));

    // 🔹 Dummy data for now:
    setStudents([
      { id: 1, name: "Alice Johnson", roll: "08A-001", time: "08:45", status: "Present" },
      { id: 2, name: "Michael Chen", roll: "08A-002", time: "08:50", status: "Present" },
      { id: 3, name: "Sophia Brown", roll: "08A-003", time: "--", status: "Absent" },
    ]);
  }, [teacherId, token]);

  // ✅ Handle status change for each student
  const handleStatusChange = (id, status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status } : student
      )
    );
  };

  // ✅ Save attendance to backend
  const handleSaveAttendance = () => {
    // Example: Adjust URL according to your Spring Boot backend
    // fetch(`/api/attendance/mark`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({
    //     teacherId,
    //     date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    //     students,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((response) => {
    //     console.log("Attendance saved:", response);
    //   })
    //   .catch((err) => console.error("Error saving attendance:", err));

    alert("✅ Attendance saved! (replace with API call)");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl text-center font-bold">Attendance Page</h1>
          <p className="text-gray-500 text-center font-semibold text-sm">
            Mark and track daily student attendance
          </p>
        </div>
        <div className="space-x-2">
          <button className="px-4 py-2 font-bold border rounded-lg">View History</button>
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 bg-green-600 font-bold text-white rounded-lg"
          >
            Save Attendance
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          label="Present"
          value={attendanceSummary.present}
          icon={<CheckCircle />}
          bgColor="linear-gradient(90deg, #34d399, #10b981)" // green gradient
        />
        <SummaryCard
          label="Absent"
          value={attendanceSummary.absent}
          icon={<XCircle />}
          bgColor="linear-gradient(90deg, #f87171, #ef4444)" // red gradient
        />
        <SummaryCard
          label="Late"
          value={attendanceSummary.late}
          icon={<Clock />}
          bgColor="linear-gradient(90deg, #fbbf24, #f59e0b)" // yellow gradient
        />
        <SummaryCard
          label="Attendance Rate"
          value={attendanceSummary.rate + "%"}
          icon={<Users />}
          bgColor="linear-gradient(90deg, #60a5fa, #2563eb)" // blue gradient
        />
      </div>


      {/* Mark Attendance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="col-span-2 bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="font-medium">Mark Attendance</p>
            <select className="border rounded px-2 py-1 text-sm">
              <option disabled selected>
                Select Class
              </option>
              <option>Grade 8 A</option>
              <option>Grade 8 B</option>
              <option>Grade 8 C</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search students..."
            className="w-full mb-3 px-3 py-2 border rounded-lg text-sm"
          />

          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-gray-500 text-sm">Roll: {student.roll}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{student.time}</span>
                  <button
                    onClick={() => handleStatusChange(student.id, "Present")}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      student.status === "Present"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, "Late")}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      student.status === "Late"
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Late
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, "Absent")}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      student.status === "Absent"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="font-medium mb-2">Calendar</p>
          <p className="text-sm text-gray-500 mb-3">
            Select date to view/mark attendance
          </p>
          <Calendar />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, bgColor }) {
  return (
    <div
      className={`rounded-xl p-4 flex justify-between items-center shadow-md text-white transition-transform transform hover:scale-105 animate-gradient`}
      style={{ background: bgColor }}
    >
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm">{label}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}


function Calendar() {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-2">
        <button>{"<"}</button>
        <p className="font-semibold">July 2025</p>
        <button>{">"}</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm text-gray-600">
        {days.map((d) => (
          <div key={d} className="font-medium">
            {d}
          </div>
        ))}
        {dates.map((d) => (
          <div
            key={d}
            className={`p-2 rounded-lg ${
              d === 25 ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
