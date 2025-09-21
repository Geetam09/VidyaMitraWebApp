import React, { useState, useEffect } from 'react';
import { apiService } from "../services/apiService";
import FloatingChatbot from "./FloatingChatbot";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardHeader from "./DashboardHeader";

// Example dropdown options (replace with your actual data)
const classOptions = [
  { value: "", label: "All Classes" },
  { value: "1", label: "Grade 7B" },
  { value: "2", label: "Grade 8A" },
  { value: "3", label: "Grade 9A" },
];
const languageOptions = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Marathi", label: "Marathi" },
];

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateCards, setAnimateCards] = useState(false);
  const [token] = useState(localStorage.getItem('token'));
  const [teacherId] = useState(localStorage.getItem('teacherId'));
  const [profile, setProfile] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    rollNumber: "",
    parentName: "",
    parentContact: "",
    parentEmail: "",
    parentPreferredLanguage: "",
    schoolClassId: "",
    photo: null,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Validation state
  const [formErrors, setFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});

  useEffect(() => {
    fetchStudents();
    setTimeout(() => setAnimateCards(true), 100);

    // Fetch teacher profile for header
    const fetchProfile = async () => {
      try {
        const data = await apiService.getTeacherById(teacherId, token);
        setProfile(data);
      } catch (err) {
        setProfile(null);
      }
    };
    if (token && teacherId) fetchProfile();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, students, classFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllStudents(token);
      setStudents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;
    
    // Apply class filter
    if (classFilter) {
      filtered = filtered.filter(student => 
        student.schoolClassId == classFilter
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        (`${student.firstName || ''} ${student.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.rollNumber ? student.rollNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false)
      );
    }
    
    setFilteredStudents(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await apiService.deleteStudent(id, token);
        setStudents(students.filter(student => student.id !== id));
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!newStudent.firstName.trim()) errors.firstName = "First name is required";
    if (!newStudent.lastName.trim()) errors.lastName = "Last name is required";
    if (!newStudent.rollNumber) errors.rollNumber = "Roll number is required";
    if (!newStudent.parentName.trim()) errors.parentName = "Parent name is required";
    if (!newStudent.parentContact) errors.parentContact = "Parent contact is required";
    if (!/^\d{10}$/.test(newStudent.parentContact)) errors.parentContact = "Enter a valid 10-digit contact";
    if (!newStudent.parentEmail.trim()) errors.parentEmail = "Parent email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.parentEmail)) errors.parentEmail = "Enter a valid email";
    if (!newStudent.schoolClassId) errors.schoolClassId = "Class is required";
    if (!newStudent.parentPreferredLanguage) errors.parentPreferredLanguage = "Preferred language is required";
    return errors;
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setAddLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", newStudent.firstName);
      formData.append("lastName", newStudent.lastName);
      formData.append("rollNumber", newStudent.rollNumber);
      formData.append("parentName", newStudent.parentName);
      formData.append("parentContact", newStudent.parentContact);
      formData.append("parentEmail", newStudent.parentEmail);
      formData.append("parentPreferredLanguage", newStudent.parentPreferredLanguage);
      formData.append("schoolClassId", newStudent.schoolClassId);
      if (newStudent.photo) formData.append("photo", newStudent.photo);

      await apiService.createStudent(newStudent, token);
      setShowAddModal(false);
      setNewStudent({
        firstName: "",
        lastName: "",
        rollNumber: "",
        parentName: "",
        parentContact: "",
        parentEmail: "",
        parentPreferredLanguage: "",
        schoolClassId: "",
        photo: null,
      });
      setFormErrors({});
      fetchStudents();
    } catch (err) {
      alert("Failed to add student: " + err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setNewStudent({ ...newStudent, photo: e.target.files[0] });
  };

  const handleExportPDF = async () => {
  setExportLoading(true);
  try {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 30, "F");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("Students List", 105, 15, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    // Table
    const headers = [["Name", "Roll Number", "Class", "Parent Name", "Email", "Status"]];
    const data = filteredStudents.map((student) => [
      `${student.firstName || ""} ${student.lastName || ""}`,
      student.rollNumber || "",
      student.class || "",
      student.parentName || "",
      student.parentEmail || "",
      student.status || "",
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
      doc.text(`Exported on ${new Date().toLocaleDateString()}`, 105, 290, { align: "center" });
    }

    doc.save("students-list.pdf");
  } catch (err) {
    alert("Failed to export PDF: " + err.message);
  } finally {
    setExportLoading(false);
  }
};

  // Summary stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => (s.status || '').toLowerCase() === 'active').length;
  const inactiveStudents = students.filter(s => (s.status || '').toLowerCase() !== 'active').length;
  const avgAttendance = students.length
    ? Math.round(students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length)
    : 0;

  // Example static data for unread messages (replace with your own logic if needed)
  const staticData = { unreadMessages: 0 };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-12 text-center max-w-md mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Loading Students</h2>
        <p className="text-gray-600">Fetching student records...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-12 text-center max-w-md mx-auto">
        <div className="text-red-500 mb-4 text-lg">⚠️ {error}</div>
        <button
          onClick={fetchStudents}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader
        firstName={profile?.firstName || "Teacher"}
        unreadMessages={staticData.unreadMessages}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className={`mb-8 transform transition-all duration-1000 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Student Overview
          </h2>
          <p className="text-gray-600 text-lg">Track and manage your students efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Students", value: totalStudents, color: "blue", delay: "0ms" },
            { title: "Active Students", value: activeStudents, color: "green", delay: "100ms" },
            { title: "Inactive Students", value: inactiveStudents, color: "red", delay: "200ms" },
            { title: "Avg. Attendance", value: `${avgAttendance}%`, color: "purple", delay: "300ms" }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/30 transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: stat.delay }}
            >
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 极 0 11-14 0 7 7 极 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search students by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white/50"
                />
              </div>
              
              <div className="w-full md:w-48">
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white/50"
                >
                  {classOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Student
              </button>
              <button
                onClick={handleExportPDF}
                disabled={exportLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 极 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transform transition-all duration-700 border border-white/30 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Parent/Guardian</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredStudents.map(student => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onDelete={handleDelete}
                    token={token}
                    onEdit={() => {
                      setEditStudent(student);
                      setShowEditModal(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto border border-white/30">
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-500 hover:text-blue-700 text-2xl transition-all duration-300 hover:scale-110"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Add New Student</h2>
              <form
                onSubmit={handleAddStudent}
                encType="multipart/form-data"
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'firstName', label: 'First Name', type: 'text', required: true },
                    { id: 'lastName', label: 'Last Name', type: 'text', required: true },
                    { id: 'rollNumber', label: 'Roll Number', type: 'text', required: true },
                    { id: 'parentName', label: 'Parent Name', type: 'text', required: true },
                    { id: 'parentContact', label: 'Parent Contact', type: 'tel', required: true },
                    { id: 'parentEmail', label: 'Parent Email', type: 'email', required: true },
                  ].map(field => (
                    <div key={field.id} className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        className={`w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white/70 ${formErrors[field.id] ? 'border-red-400' : ''}`}
                        required={field.required}
                        value={newStudent[field.id]}
                        onChange={e => setNewStudent({ ...newStudent, [field.id]: e.target.value })}
                      />
                      {formErrors[field.id] && <span className="text-xs text-red-500">{formErrors[field.id]}</span>}
                    </div>
                  ))}
                  
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      className={`w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white/70 ${formErrors.schoolClassId ? 'border-red-400' : ''}`}
                      required
                      value={newStudent.schoolClassId}
                      onChange={e => setNewStudent({ ...newStudent, schoolClassId: e.target.value })}
                    >
                      <option value="">Select Class</option>
                      {classOptions.filter(opt => opt.value).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {formErrors.schoolClassId && <span className="text-xs text-red-500">{formErrors.schoolClassId}</span>}
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                    <select
                      className={`w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white/70 ${formErrors.parentPreferredLanguage ? 'border-red-400' : ''}`}
                      value={newStudent.parentPreferredLanguage}
                      onChange={e => setNewStudent({ ...newStudent, parentPreferredLanguage: e.target.value })}
                    >
                      <option value="">Select Language</option>
                      {languageOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {formErrors.parentPreferredLanguage && <span className="text-xs text-red-500">{formErrors.parentPreferredLanguage}</span>}
                  </div>
                  
                  <div className="md:col-span-2 group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo</label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {addLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Student...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Student
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {showEditModal && editStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm transition-all duration-500">
            <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-xl relative max-h-[90vh] overflow-y-auto border border-yellow-200 transition-all duration-500 scale-100 hover:scale-105">
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-yellow-700 text-2xl transition-all duration-300"
                onClick={() => setShowEditModal(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-6 text-yellow-700 text-center">Edit Student</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // Validation (reuse your validateForm logic, but for editStudent)
                  const errors = {};
                  if (!editStudent.firstName?.trim()) errors.firstName = "First name is required";
                  if (!editStudent.lastName?.trim()) errors.lastName = "Last name is required";
                  if (!editStudent.rollNumber) errors.rollNumber = "Roll number is required";
                  if (!editStudent.parentName?.trim()) errors.parentName = "Parent name is required";
                  if (!editStudent.parentContact) errors.parentContact = "Parent contact is required";
                  if (!/^\d{10}$/.test(editStudent.parentContact)) errors.parentContact = "Enter a valid 10-digit contact";
                  if (!editStudent.parentEmail?.trim()) errors.parentEmail = "Parent email is required";
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editStudent.parentEmail)) errors.parentEmail = "Enter a valid email";
                  if (!editStudent.schoolClassId) errors.schoolClassId = "Class is required";
                  if (!editStudent.parentPreferredLanguage) errors.parentPreferredLanguage = "Preferred language is required";
                  setEditFormErrors(errors);
                  if (Object.keys(errors).length > 0) return;

                  setEditLoading(true);
                  try {
                    await apiService.updateStudent(editStudent.id, editStudent, token);
                    setShowEditModal(false);
                    setEditStudent(null);
                    setEditFormErrors({});
                    fetchStudents();
                  } catch (err) {
                    alert("Failed to update student: " + err.message);
                  } finally {
                    setEditLoading(false);
                  }
                }}
                encType="multipart/form-data"
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Repeat the same fields as Add Student, but use editStudent and setEditStudent */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      className={`w-full border border-yellow-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all duration-300 group-hover:shadow-lg group-hover:border-yellow-400 bg-white bg-opacity-70 ${editFormErrors.firstName ? 'border-red-400' : ''}`}
                      required
                      value={editStudent.firstName}
                      onChange={e => setEditStudent({ ...editStudent, firstName: e.target.value })}
                    />
                    {editFormErrors.firstName && <span className="text-xs text-red-500">{editFormErrors.firstName}</span>}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      className={`w-full border border-yellow-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all duration-300 group-hover:shadow-lg group-hover:border-yellow-400 bg-white bg-opacity-70 ${editFormErrors.lastName ? 'border-red-400' : ''}`}
                      required
                      value={editStudent.lastName}
                      onChange={e => setEditStudent({ ...editStudent, lastName: e.target.value })}
                    />
                    {editFormErrors.lastName && <span className="text-xs text-red-500">{editFormErrors.lastName}</span>}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                    <input
                      className={`w-full border border-yellow-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all duration-300 group-hover:shadow-lg group-hover:border-yellow-400 bg-white bg-opacity-70 ${editFormErrors.rollNumber ? 'border-red-400' : ''}`}
                      required
                      value={editStudent.rollNumber}
                      onChange={e => setEditStudent({ ...editStudent, rollNumber: e.target.value })}
                    />
                    {editFormErrors.rollNumber && <span className="text-xs text-red-500">{editFormErrors.rollNumber}</span>}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      className={`w-full border border-yellow-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all duration-300 group-hover:shadow-lg group-hover:border-yellow-400 bg-white bg-opacity-70 ${editFormErrors.schoolClassId ? 'border-red-400' : ''}`}
                      required
                      value={editStudent.schoolClassId}
                      onChange={e => setEditStudent({ ...editStudent, schoolClassId: e.target.value })}
                    >
                      <option value="">Select Class</option>
                      {classOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {editFormErrors.schoolClassId && <span className="text-xs text-red-500">{editFormErrors.schoolClassId}</span>}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                    <input
                      className={`w-full border border-yellow-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all duration-300 group-hover:shadow-lg group-hover:border-yellow-400 bg-white bg-opacity-70 ${editFormErrors.parentName ? 'border-red-400' : ''}`}
                      required
                      value={editStudent.parentName}
                      onChange={e => setEditStudent({ ...editStudent, parentName: e.target.value })}
                    />
                    {editFormErrors.parentName && <span className="text-xs text-red-500">{editFormErrors.parentName}</span>}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Contact</label>
                    <input
                      className={`w-full border border-yellow-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all duration-300 group-hover:shadow-lg group-hover:border-yellow-400 bg-white bg-opacity-70 ${editFormErrors.parentContact ? 'border-red-400' : ''}`}
                      required
                      value={editStudent.parentContact}
                      onChange={e => setEditStudent({ ...editStudent, parentContact: e.target.value })}
                    />
                    {editFormErrors.parentContact && <span className="text-xs text-red-500">{editFormErrors.parentContact}</span>}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                    <input
                      className={`w-full border border-yellow-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all duration-300 group-hover:shadow-lg group-hover:border-yellow-400 bg-white bg-opacity-70 ${editFormErrors.parentEmail ? 'border-red-400' : ''}`}
                      type="email"
                      required
                      value={editStudent.parentEmail}
                      onChange={e => setEditStudent({ ...editStudent, parentEmail: e.target.value })}
                    />
                    {editFormErrors.parentEmail && <span className="text-xs text-red-500">{editFormErrors.parentEmail}</span>}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                    <select
                      className={`w-full border border-yellow-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all duration-300 group-hover:shadow-lg group-hover:border-yellow-400 bg-white bg-opacity-70 ${editFormErrors.parentPreferredLanguage ? 'border-red-400' : ''}`}
                      value={editStudent.parentPreferredLanguage}
                      onChange={e => setEditStudent({ ...editStudent, parentPreferredLanguage: e.target.value })}
                    >
                      <option value="">Select Language</option>
                      {languageOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {editFormErrors.parentPreferredLanguage && <span className="text-xs text-red-500">{editFormErrors.parentPreferredLanguage}</span>}
                  </div>
                  <div className="md:col-span-2 group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo</label>
                    <input
                      className="w-full border border-yellow-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all duration-300 group-hover:shadow-lg group-hover:border-yellow-400 bg-white bg-opacity-70"
                      type="file"
                      accept="image/*"
                      onChange={e => setEditStudent({ ...editStudent, photo: e.target.files[0] })}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl"
                >
                  {editLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Student...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Update Student
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <FloatingChatbot />
      </main>
    </div>
  );
}

const StudentRow = ({ student, onDelete, token, onEdit }) => {
  const [expanded, setExpanded] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const blob = await apiService.getStudentPhoto(student.id, token);
        const url = URL.createObjectURL(blob);
        setPhotoUrl(url);
      } catch (err) {
        setPhotoUrl('https://via.placeholder.com/40');
      }
    };
    fetchPhoto();
  }, [student.id, token]);

  const toggleExpand = () => setExpanded(!expanded);

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
      <tr className="hover:bg-white/50 transition-colors duration-200">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img className="h-10 w-10 rounded-full object-cover border-2 border-white/30" src={photoUrl} alt={`${student.firstName} ${student.lastName}`} />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</div>
              <div className="text-sm text-gray-500">ID: {student.id}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.schoolClassName}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.age || 'N/A'}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <div>{student.parentName}</div>
          <div className="text-gray-500">{student.parentContact}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-16 text-sm font-medium text-gray-900 mr-2">{student.attendance || 0}%</div>
            <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full ${getAttendanceColor(student.attendance || 0)}`}
                style={{ width: `${student.attendance || 0}%` }}
              ></div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${(student.status && student.status.toLowerCase() === 'active') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {student.status || 'Unknown'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            <button
              onClick={toggleExpand}
              className="p-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white shadow transition-all duration-200"
              title="View Details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={onEdit}
              className="p-2 rounded-full border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-500 hover:text-white shadow transition-all duration-200"
              title="Edit Student"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(student.id)}
              className="p-2 rounded-full border border-red-300 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white shadow transition-all duration-200"
              title="Delete Student"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-white/50">
          <td colSpan="8" className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Parent Email</h4>
                <p className="text-sm text-gray-900">{student.parentEmail || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Preferred Language</h4>
                <p className="text-sm text-gray-900">{student.parentPreferredLanguage || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Class Name</h4>
                <p className="text-sm text-gray-900">{student.schoolClassName || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Student ID</h4>
                <p className="text-sm text-gray-900">{student.id}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default StudentsPage;