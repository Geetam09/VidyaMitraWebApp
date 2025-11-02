// src/services/apiService.js
const API_BASE_URL = 'http://localhost:8081';

export const apiService = {
  // ================= AUTH =================
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  register: async (teacherData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData),
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Registration failed: ${response.status} ${response.statusText} - ${errorData}`
      );
    }
    return response.json();
  },

  // ================= TEACHERS =================
  getAllTeachers: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/teachers/getAllTeachers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch teachers');
    return response.json();
  },

  getTeacherById: async (teacherId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/teachers/getTeacherById/${teacherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch teacher profile');
    return await response.json();
  },
   // ================= ASSIGNMENTS =================
  createAssignment: async (assignmentData, token) => {
    const response = await fetch(`${API_BASE_URL}/api/assignments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(assignmentData),
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Failed to create assignment: ${response.status} ${response.statusText} - ${errorData}`
      );
    }
    return response.json();
  },

  getAllAssignments: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/assignments/getAllAssignments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch assignments');
    return response.json();
  },

  getAssignmentById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/api/assignments/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch assignment by ID');
    return response.json();
  },

  getAssignmentsByClass: async (classId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/assignments/class/${classId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch assignments by class');
    return response.json();
  },

  deleteAssignment: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/api/assignments/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to delete assignment');
    return true;
  },


  // ================= STUDENTS =================
  createStudent: async (formData, token) => {
    const response = await fetch(`${API_BASE_URL}/api/students/createStudent`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create student');
    return response.json();
  },

  getStudentById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/api/students/getStudentById/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch student');
    return response.json();
  },

  getAllStudents: async (token, classId = null) => {
    const url = classId
      ? `${API_BASE_URL}/api/students/getAllStudents?classId=${classId}`
      : `${API_BASE_URL}/api/students/getAllStudents`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

    // ================= ASSIGNMENT SUBMISSIONS =================
  submitAssignment: async (submissionData, token) => {
    const response = await fetch(`${API_BASE_URL}/api/submissions/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Failed to submit assignment: ${response.status} ${response.statusText} - ${errorData}`
      );
    }

    return response.json();
  },

  getSubmissionsByAssignment: async (assignmentId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/submissions/assignment/${assignmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok)
      throw new Error(`Failed to fetch submissions for assignment ID: ${assignmentId}`);

    return response.json();
  },


  updateStudent: async (id, studentData, token) => {
    const formData = new FormData();
    formData.append("firstName", studentData.firstName.trim());
    formData.append("lastName", studentData.lastName.trim());
    formData.append("rollNumber", studentData.rollNumber.toString().trim());
    formData.append("parentName", studentData.parentName.trim());

    if (studentData.parentContact && !isNaN(studentData.parentContact)) {
      formData.append("parentContact", studentData.parentContact.toString());
    }

    formData.append("parentEmail", studentData.parentEmail.trim());
    formData.append("parentPreferredLanguage", studentData.parentPreferredLanguage);
    formData.append("schoolClassId", studentData.schoolClassId.toString());

    if (studentData.photo) {
      formData.append("photo", studentData.photo);
    }

    const response = await fetch(`${API_BASE_URL}/api/students/updateStudent/${id}`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to update student");
    return response.json();
  },

  deleteStudent: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/api/students/deleteStudent/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to delete student');
    return true;
  },

  uploadStudentPhoto: async (id, file, token) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/students/StudentPhoto/${id}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload photo');
    return response.text();
  },

  getStudentPhoto: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/api/students/StudentPhoto/${id}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch photo');
    return response.blob();
  },

  // ================= ATTENDANCE =================
  markAttendance: async (attendanceData, token) => {
    const response = await fetch(`${API_BASE_URL}/api/attendance/mark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(attendanceData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to mark attendance: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return response.json();
  },

  getAttendanceByStudent: async (studentId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/attendance/student/${studentId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch student attendance: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return response.json();
  },

  getAttendanceByDate: async (date, token) => {
    const response = await fetch(`${API_BASE_URL}/api/attendance/date/${date}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch attendance by date: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return response.json();
  },

  deleteAttendance: async (attendanceId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/attendance/${attendanceId}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete attendance: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return true;
  },

  // ================= CHATBOT =================
  getChatResponse: async (token, message) => {
    try {
      const encodedMessage = encodeURIComponent(message);
      const response = await fetch(
        `${API_BASE_URL}/api/ChatBot?message=${encodedMessage}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Chat API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to get chat response: ${response.status}`);
      }
      return response.text();
    } catch (error) {
      console.error('Network error in getChatResponse:', error);
      throw error;
    }
  },

  // ================= CLASSES =================
  createClass: async (classDto, token) => {
    const response = await fetch(`${API_BASE_URL}/api/classes/createClass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(classDto),
    });
    if (!response.ok) {
      const txt = await response.text().catch(() => "");
      throw new Error(`Failed to create class: ${response.status} ${response.statusText} ${txt}`);
    }
    return response.json();
  },

  getClassById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/api/classes/getClassById/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      const txt = await response.text().catch(() => "");
      throw new Error(`Failed to fetch class: ${response.status} ${response.statusText} ${txt}`);
    }
    return response.json();
  },

  getAllClasses: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/classes/getAllClasses`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      const txt = await response.text().catch(() => "");
      throw new Error(`Failed to fetch classes: ${response.status} ${response.statusText} ${txt}`);
    }
    return response.json();
  },

  updateClass: async (id, classDto, token) => {
    const response = await fetch(`${API_BASE_URL}/api/classes/updateClass/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(classDto),
    });
    if (!response.ok) {
      const txt = await response.text().catch(() => "");
      throw new Error(`Failed to update class: ${response.status} ${response.statusText} ${txt}`);
    }
    return response.json();
  },

  deleteClass: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/api/classes/deleteClass/${id}`, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      const txt = await response.text().catch(() => "");
      throw new Error(`Failed to delete class: ${response.status} ${response.statusText} ${txt}`);
    }
    return true;
  },
};

// Utility function for login (optional - you can keep this if needed)
const handleLogin = async () => {
  try {
    const data = await apiService.login(email, password);
    localStorage.setItem("token", data.token);
    // Redirect or update UI
  } catch (err) {
    alert("Login failed: " + err.message);
  }
};

// Export attendance status enum for consistency
export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  LATE: 'LATE',
  ABSENT: 'ABSENT'
};




