// src/services/apiService.js
const API_BASE_URL = 'http://localhost:8080';

export const apiService = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  },
  
  register: async (teacherData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacherData),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Registration failed: ${response.status} ${response.statusText} - ${errorData}`);
    }
    
    return response.json();
  },
  
  // Get all teachers (for admin purposes)
  getAllTeachers: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/teachers/getAllTeachers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }
    
    return response.json();
  },
  
  // Get specific teacher by ID
  // In src/services/apiService.js
getTeacherById: async (token, teacherId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/teachers/getTeacherById/${teacherId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch teacher profile: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Network error in getTeacherById:", error);
    throw error;
  }
}
};