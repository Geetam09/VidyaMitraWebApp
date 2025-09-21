// src/services/apiService.js
const API_BASE_URL = 'http://localhost:8080';

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

  // ================= STUDENTS =================
  createStudent: async (studentData, token) => {
    const response = await fetch(`${API_BASE_URL}/api/students/createStudent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(studentData),
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

  updateStudent: async (id, studentData, token) => {
  const formData = new FormData();

  // Append all fields to FormData
  formData.append("firstName", studentData.firstName);
  formData.append("lastName", studentData.lastName);
  formData.append("rollNumber", studentData.rollNumber);
  formData.append("parentName", studentData.parentName);
  formData.append("parentContact", studentData.parentContact);
  formData.append("parentEmail", studentData.parentEmail);
  formData.append("parentPreferredLanguage", studentData.parentPreferredLanguage);
  formData.append("schoolClassId", studentData.schoolClassId);

  // Append photo if provided
  if (studentData.photo) {
    formData.append("photo", studentData.photo);
  }

  const response = await fetch(`${API_BASE_URL}/api/students/updateStudent/${id}`, {
    method: "PUT",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Do NOT set Content-Type manually for FormData; browser handles it
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
    return response.blob(); // frontend can convert to object URL
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
};
