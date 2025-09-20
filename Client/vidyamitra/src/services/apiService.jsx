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
  getTeacherById: async (teacherId, token) => {
    const response = await fetch(
      `http://localhost:8080/api/teachers/getTeacherById/${teacherId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch teacher profile");
    return await response.json();
  },
   getChatResponse: async (token, message) => {
    try {
      // URL encode the message to handle special characters
      const encodedMessage = encodeURIComponent(message);
      const response = await fetch(`${API_BASE_URL}/api/ChatBot?message=${encodedMessage}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Chat API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to get chat response: ${response.status}`);
      }
      
      return response.text(); // Using text() instead of json() since the endpoint returns a string
    } catch (error) {
      console.error("Network error in getChatResponse:", error);
      throw error;
    }
  }
};