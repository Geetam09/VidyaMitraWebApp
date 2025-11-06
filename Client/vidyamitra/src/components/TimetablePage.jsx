import React, { useState } from "react";
import FloatingChatbot from "./FloatingChatbot";

import jsPDF from "jspdf";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const subjectColors = {
  "Mathematics": "bg-blue-100 text-blue-700",
  "Science": "bg-green-100 text-green-700",
  "English": "bg-purple-100 text-purple-700",
  "Social Studies": "bg-yellow-100 text-yellow-700",
  "Hindi": "bg-pink-100 text-pink-700",
  "Art": "bg-indigo-100 text-indigo-700",
  "Computer Science": "bg-cyan-100 text-cyan-700",
  "Music": "bg-fuchsia-100 text-fuchsia-700",
  "Physical Education": "bg-lime-100 text-lime-700",
  "Games": "bg-orange-100 text-orange-700",
  "Study Period": "bg-gray-100 text-gray-700",
  "Library Period": "bg-amber-100 text-amber-700",
  "Free Period": "bg-slate-100 text-slate-700",
  "Assembly": "bg-blue-100 text-blue-700",
  "Parent Meeting": "bg-rose-100 text-rose-700",
  "Lunch Break": "bg-gray-200 text-gray-700",
  "Half Day": "bg-gray-200 text-gray-700",
  "Science Lab": "bg-cyan-100 text-cyan-700",
  "Art & Craft": "bg-violet-100 text-violet-700",
  "Study Hall": "bg-gray-100 text-gray-700",
  "Break": "bg-gray-200 text-gray-700"
};

const TimetablePage = () => {
  const initialTimetable = [
    {
      time: "08:00 - 08:45",
      Monday: { subject: "Mathematics", class: "7A", room: "Room 12" },
      Tuesday: { subject: "Science", class: "7A", room: "Lab 2" },
      Wednesday: { subject: "Social Studies", class: "7A", room: "Room 10" },
      Thursday: { subject: "Hindi", class: "9B", room: "Room 18" },
      Friday: { subject: "Social Studies", class: "7A", room: "Room 16" },
      Saturday: { subject: "Parent Meeting", class: "", room: "Staff Room" }
    },
    {
      time: "08:45 - 09:30",
      Monday: { subject: "Hindi", class: "9B", room: "Room 12" },
      Tuesday: { subject: "Mathematics", class: "9B", room: "Room 15" },
      Wednesday: { subject: "Science", class: "9B", room: "Lab 2" },
      Thursday: { subject: "Free Period", class: "", room: "" },
      Friday: { subject: "Mathematics", class: "7A", room: "Room 12" },
      Saturday: { subject: "Science", class: "7B", room: "Lab 1" }
    },
    {
      time: "09:30 - 10:15",
      Monday: { subject: "Science", class: "8A", room: "Lab 1" },
      Tuesday: { subject: "English", class: "8A", room: "Room 15" },
      Wednesday: { subject: "Mathematics", class: "8A", room: "Room 12" },
      Thursday: { subject: "Art", class: "8A", room: "Art Room" },
      Friday: { subject: "Computer Science", class: "8A", room: "Computer Lab" },
      Saturday: { subject: "English", class: "9A", room: "Room 15" }
    },
    {
      time: "10:15 - 10:30",
      Monday: { subject: "Break", class: "", room: "" },
      Tuesday: { subject: "Break", class: "", room: "" },
      Wednesday: { subject: "Break", class: "", room: "" },
      Thursday: { subject: "Break", class: "", room: "" },
      Friday: { subject: "Break", class: "", room: "" },
      Saturday: { subject: "Break", class: "", room: "" }
    },
    {
      time: "10:30 - 11:15",
      Monday: { subject: "Science Lab", class: "8A", room: "Lab 1" },
      Tuesday: { subject: "Art & Craft", class: "8A", room: "Art Room" },
      Wednesday: { subject: "Music", class: "All", room: "Music Room" },
      Thursday: { subject: "Half Day", class: "", room: "" },
      Friday: { subject: "Physical Education", class: "All", room: "Playground" },
      Saturday: { subject: "Hindi", class: "9A", room: "Room 18" }
    },
    {
      time: "11:15 - 12:00",
      Monday: { subject: "Music", class: "All", room: "Music Room" },
      Tuesday: { subject: "Physical Education", class: "All", room: "Playground" },
      Wednesday: { subject: "Computer Science", class: "8A", room: "Computer Lab" },
      Thursday: { subject: "Games", class: "All", room: "Playground" },
      Friday: { subject: "Study Period", class: "9A", room: "Library" },
      Saturday: { subject: "Social Studies", class: "9A", room: "Room 10" }
    },
    {
      time: "12:00 - 12:45",
      Monday: { subject: "Library Period", class: "7B", room: "Library" },
      Tuesday: { subject: "Study Hall", class: "7B", room: "Library" },
      Wednesday: { subject: "Assembly", class: "All", room: "Hall" },
      Thursday: { subject: "Free Period", class: "", room: "" },
      Friday: { subject: "Science", class: "9A", room: "Lab 1" },
      Saturday: { subject: "Mathematics", class: "8A", room: "Room 12" }
    },
    {
      time: "12:45 - 13:30",
      Monday: { subject: "Lunch Break", class: "", room: "" },
      Tuesday: { subject: "Lunch Break", class: "", room: "" },
      Wednesday: { subject: "Lunch Break", class: "", room: "" },
      Thursday: { subject: "Lunch Break", class: "", room: "" },
      Friday: { subject: "Lunch Break", class: "", room: "" },
      Saturday: { subject: "Lunch Break", class: "", room: "" }
    }
  ];

  const [timetable, setTimetable] = useState(initialTimetable);
  const [editing, setEditing] = useState({ timeSlot: null, day: null });
  const [subjectInput, setSubjectInput] = useState("");
  const [classInput, setClassInput] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", room: "", color: "" });

  const allSubjects = Object.keys(subjectColors).filter(subject => subject !== "Default");

  const handleCellClick = (timeSlot, day) => {
    setEditing({ timeSlot, day });
    const cell = timetable.find(slot => slot.time === timeSlot)?.[day];
    setSubjectInput(cell?.subject || "");
    setClassInput(cell?.class || "");
    setRoomInput(cell?.room || "");
    setInProgress(cell?.inProgress || false);
  };

  const handleSave = () => {
    if (!subjectInput.trim()) return;
    setTimetable(prev =>
      prev.map(slot =>
        slot.time === editing.timeSlot
          ? {
              ...slot,
              [editing.day]: {
                subject: subjectInput,
                class: classInput,
                room: roomInput,
                inProgress
              }
            }
          : slot
      )
    );
    setEditing({ timeSlot: null, day: null });
    setSubjectInput("");
    setClassInput("");
    setRoomInput("");
    setInProgress(false);
  };

  const handleRemove = () => {
    setTimetable(prev =>
      prev.map(slot =>
        slot.time === editing.timeSlot
          ? { ...slot, [editing.day]: { subject: "", class: "", room: "" } }
          : slot
      )
    );
    setEditing({ timeSlot: null, day: null });
  };

  const handleExportPDF = () => {
    setExporting(true);
    
    try {
      // Create PDF in landscape mode
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const tableWidth = pageWidth - (margin * 2);
      const colWidth = tableWidth / (days.length + 1);
      let yPosition = margin;

      // Add header with background
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, pageWidth, 25, 'F');
      
      // Title
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("Timetable Management System", pageWidth / 2, 15, { align: "center" });
      
      // Subtitle
      doc.setFontSize(10);
      doc.setTextColor(200, 200, 200);
      doc.text("Professional Weekly Schedule", pageWidth / 2, 22, { align: "center" });

      yPosition = 35;

      // Draw table header
      doc.setFillColor(67, 56, 202);
      doc.rect(margin, yPosition, tableWidth, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      
      // Time column header
      doc.text("Time", margin + (colWidth / 2), yPosition + 5, { align: "center" });
      
      // Day columns headers
      days.forEach((day, index) => {
        const x = margin + colWidth + (index * colWidth);
        doc.text(day, x + (colWidth / 2), yPosition + 5, { align: "center" });
      });

      yPosition += 8;

      // Draw table rows
      timetable.forEach((slot, rowIndex) => {
        // Alternate row background
        if (rowIndex % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, yPosition, tableWidth, 15, 'F');
        }

        // Draw cell borders
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);
        
        // Time cell
        doc.rect(margin, yPosition, colWidth, 15);
        doc.setTextColor(128, 90, 213);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(8);
        doc.text(slot.time, margin + (colWidth / 2), yPosition + 8, { align: "center" });

        // Day cells
        days.forEach((day, dayIndex) => {
          const x = margin + colWidth + (dayIndex * colWidth);
          doc.rect(x, yPosition, colWidth, 15);
          
          const cell = slot[day];
          if (cell?.subject) {
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'normal');
            
            let textY = yPosition + 4;
            
            // Subject
            doc.setFontSize(7);
            const subjectLines = doc.splitTextToSize(cell.subject, colWidth - 4);
            subjectLines.forEach(line => {
              doc.text(line, x + (colWidth / 2), textY, { align: "center" });
              textY += 3;
            });
            
            // Class and Room
            if (cell.class || cell.room) {
              const details = [];
              if (cell.class) details.push(cell.class);
              if (cell.room) details.push(cell.room);
              
              doc.setFontSize(6);
              const detailsText = details.join(' - ');
              const detailsLines = doc.splitTextToSize(detailsText, colWidth - 4);
              detailsLines.forEach(line => {
                doc.text(line, x + (colWidth / 2), textY, { align: "center" });
                textY += 2.5;
              });
            }
            
            // In Progress
            if (cell.inProgress) {
              doc.setFontSize(5);
              doc.setTextColor(59, 130, 246);
              doc.text("[In Progress]", x + (colWidth / 2), textY, { align: "center" });
            }
          } else {
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(7);
            doc.text("Free", x + (colWidth / 2), yPosition + 8, { align: "center" });
          }
        });

        yPosition += 15;

        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = margin;
          
          // Redraw header on new page
          doc.setFillColor(67, 56, 202);
          doc.rect(margin, yPosition, tableWidth, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          doc.setFont(undefined, 'bold');
          doc.text("Time", margin + (colWidth / 2), yPosition + 5, { align: "center" });
          days.forEach((day, index) => {
            const x = margin + colWidth + (index * colWidth);
            doc.text(day, x + (colWidth / 2), yPosition + 5, { align: "center" });
          });
          yPosition += 8;
        }
      });

      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // Save the PDF
      doc.save("timetable-schedule.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const getSubjectColor = (subject) => {
    if (subject === "Break" || subject === "Lunch Break")
      return "bg-gradient-to-br from-slate-200 to-slate-300";
    return subjectColors[subject] || "bg-gradient-to-br from-slate-500 to-slate-600";
  };

  // Floating glassy background elements
  const FloatingElements = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <FloatingElements />
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white border border-gray-100 rounded-3xl px-8 py-6 mb-6 shadow-xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight drop-shadow-lg">
              Timetable Management System
            </h1>
            <p className="text-lg text-purple-600 font-light">
              Professional Weekly Schedule Management
            </p>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Weekly Timetable
            </h2>
            <p className="text-gray-600 font-light">Click on any period to edit</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <span>+</span>
              New Subject
            </button>
            <button
              onClick={handleExportPDF}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-lg hover:shadow-violet-500/25 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <span>📄</span>
                  <span>Export PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Timetable */}
        <div className="rounded-3xl p-6 bg-white border border-gray-100 shadow-xl mb-12">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-2">
              <thead>
                <tr>
                  <th className="p-4 text-base font-semibold text-gray-800 text-left bg-gray-50 rounded-xl">
                    Time
                  </th>
                  {days.map(day => (
                    <th key={day} className="p-4 text-base font-semibold text-gray-800 text-center bg-gray-50 rounded-xl">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timetable.map((slot, slotIndex) => (
                  <tr key={slot.time} className="group">
                    <td className="p-4 font-medium text-purple-600 text-sm min-w-[120px] bg-gray-50 rounded-xl transition-all duration-300">
                      {slot.time}
                    </td>
                    {days.map(day => {
                      const cell = slot[day];
                      const colorClass = subjectColors[cell?.subject] || "bg-gray-100 text-gray-700";
                      return (
                        <td
                          key={day}
                          className={`relative p-3 min-w-[140px] min-h-[80px] cursor-pointer rounded-2xl transition-all duration-300 ${colorClass} border border-gray-100 shadow hover:shadow-lg hover:scale-105 hover:border-gray-200`}
                          onClick={() => handleCellClick(slot.time, day)}
                        >
                          {cell?.subject ? (
                            <div className="flex flex-col items-center text-center h-full justify-center">
                              <span className="font-semibold text-base leading-tight">
                                {cell.subject}
                              </span>
                              {cell.class && (
                                <span className="text-xs mt-1 leading-tight">
                                  {cell.class}
                                </span>
                              )}
                              {cell.room && (
                                <span className="text-xs mt-1 leading-tight">
                                  {cell.room}
                                </span>
                              )}
                              {cell.inProgress && (
                                <span className="mt-2 text-xs px-2 py-1 rounded-full bg-blue-500 text-white font-medium">
                                  In Progress
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="text-gray-300 text-xl font-light hover:text-gray-400 transition-colors">+</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject Legend */}
        <div className="rounded-3xl p-6 bg-white border border-gray-100 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Subject Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(subjectColors).map(([subject, color]) => (
              <div
                key={subject}
                className={`flex items-center space-x-2 p-2 rounded-lg ${color} border border-gray-100 transition-all duration-200 hover:scale-105`}
              >
                <div className="w-2 h-2 rounded-full bg-white/80"></div>
                <span className="text-xs font-medium">{subject}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing.timeSlot !== null && editing.day !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div className="relative w-full max-w-md mx-4 bg-white/90 border border-white/30 rounded-3xl shadow-2xl p-8 animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200"
              onClick={() => setEditing({ timeSlot: null, day: null })}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-gray-800 text-center tracking-tight">
              Edit Period
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/80 transition-all duration-200"
                  value={editing.timeSlot}
                  onChange={e => {
                    const newTime = e.target.value;
                    setTimetable(prev =>
                      prev.map(slot =>
                        slot.time === editing.timeSlot
                          ? { ...slot, time: newTime }
                          : slot
                      )
                    );
                    setEditing(edit => ({ ...edit, timeSlot: newTime }));
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={subjectInput}
                  onChange={e => setSubjectInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/80 transition-all duration-200"
                >
                  <option value="">Select Subject</option>
                  <option value="Break">Break</option>
                  <option value="Lunch Break">Lunch Break</option>
                  <option value="Free Period">Free Period</option>
                  {allSubjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              {subjectInput && !["Break", "Lunch Break", "Free Period", "Half Day"].includes(subjectInput) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/80 transition-all duration-200"
                      placeholder="e.g., 7A, 8B, All"
                      value={classInput}
                      onChange={e => setClassInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/80 transition-all duration-200"
                      placeholder="e.g., Room 12, Lab 1, Playground"
                      value={roomInput}
                      onChange={e => setRoomInput(e.target.value)}
                    />
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-3 accent-yellow-500 scale-125"
                      checked={inProgress}
                      onChange={e => setInProgress(e.target.checked)}
                    />
                    <span className="text-gray-700 font-medium">Mark as In Progress</span>
                  </label>
                </>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all duration-200 disabled:opacity-50"
                  onClick={handleSave}
                  disabled={!subjectInput.trim()}
                >
                  Save
                </button>
                {timetable
                  .find(slot => slot.time === editing.timeSlot)?.[editing.day]
                  ?.subject && (
                  <button
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow hover:from-red-500 hover:to-pink-600 hover:scale-105 transition-all duration-200"
                    onClick={handleRemove}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div className="relative w-full max-w-md mx-4 bg-white/90 border border-white/30 rounded-3xl shadow-2xl p-8 animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200"
              onClick={() => setShowAddForm(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-gray-800 text-center tracking-tight">
              Add New Subject
            </h3>
            <div className="space-y-5">
              <input
                type="text"
                placeholder="Subject Name"
                value={newSubject.name}
                onChange={e => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/80 transition-all duration-200"
              />
              <input
                type="text"
                placeholder="Default Room"
                value={newSubject.room}
                onChange={e => setNewSubject(prev => ({ ...prev, room: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white/80 transition-all duration-200"
              />
              <select
                value={newSubject.color}
                onChange={e => setNewSubject(prev => ({ ...prev, color: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-400 focus:outline-none bg-white/80 transition-all duration-200"
              >
                <option value="">Select Color Theme</option>
                <option value="bg-blue-100 text-blue-700">Blue</option>
                <option value="bg-green-100 text-green-700">Green</option>
                <option value="bg-purple-100 text-purple-700">Purple</option>
                <option value="bg-yellow-100 text-yellow-700">Yellow</option>
                <option value="bg-pink-100 text-pink-700">Pink</option>
              </select>
              <button
                onClick={() => {
                  if (!newSubject.name.trim()) return;
                  subjectColors[newSubject.name] = newSubject.color || "bg-blue-100 text-blue-700";
                  setNewSubject({ name: "", room: "", color: "" });
                  setShowAddForm(false);
                }}
                disabled={!newSubject.name.trim()}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all duration-200 disabled:opacity-50"
              >
                Create Subject
              </button>
            </div>
          </div>
        </div>
      )}
      <FloatingChatbot />
    </div>
  );
};

export default TimetablePage;