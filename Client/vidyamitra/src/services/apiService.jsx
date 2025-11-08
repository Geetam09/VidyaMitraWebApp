// src/services/apiService.js
const API_BASE_URL = 'http://localhost:8081';

// Add this utility function at the top of the file
const validateToken = (token) => {
  if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
    throw new Error('Invalid authentication token. Please login again.');
  }
};

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

  // ================= TEST GENERATION =================
  generateTestPaper: async (testSpecification, token = null) => {
    // Validate the test specification structure
    if (!testSpecification.subject || !testSpecification.topic || !testSpecification.difficulty) {
      throw new Error('Missing required fields: subject, topic, and difficulty are required');
    }

    if (!testSpecification.breakdown) {
      throw new Error('Breakdown is required');
    }

    // Ensure all breakdown fields are present and are numbers
    const breakdown = {
      multipleChoice: testSpecification.breakdown.multipleChoice || 5,
      fillInBlanks: testSpecification.breakdown.fillInBlanks || 0,
      shortAnswer: testSpecification.breakdown.shortAnswer || 0,
      longAnswer: testSpecification.breakdown.longAnswer || 0
    };

    // Create the final payload matching the Java record structure
    const payload = {
      subject: testSpecification.subject,
      topic: testSpecification.topic,
      difficulty: testSpecification.difficulty,
      totalQuestions: testSpecification.totalQuestions || 10,
      breakdown: breakdown
    };

    console.log('Sending test specification:', payload);

    const response = await fetch(`${API_BASE_URL}/api/v1/generate/test-paper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `Test generation failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },
    // ================= COMMUNITY POSTS =================
  createPost: async (postData, token) => {
  const formData = new FormData();
  formData.append('authorId', postData.authorId); // Append authorId
  formData.append('content', postData.content); // Append content
  if (postData.image) {
    formData.append('image', postData.image); // Append image if it exists
  }

  const response = await fetch(`${API_BASE_URL}/community-posts/createPost`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }), // Include token if available
    },
    body: formData, // Send form data
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `Failed to create post: ${response.status} ${response.statusText} - ${errorData}`
    );
  }
  return response.json();
},

  getAllPosts: async (token) => {
    const response = await fetch(`${API_BASE_URL}/community-posts/getAllPosts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch community posts');
    return response.json();
  },

  getPostById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/community-posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch post by ID');
    return response.json();
  },

  deletePost: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/community-posts/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to delete post');
    return true;
  },

  
  // ================= POST COMMENTS =================
  addComment: async (commentData, token) => {
    const response = await fetch(`${API_BASE_URL}/comments/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Failed to add comment: ${response.status} ${response.statusText} - ${errorData}`
      );
    }
    return response.json();
  },

  getCommentsByPostId: async (postId, token) => {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  },

  deleteComment: async (commentId, token) => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to delete comment');
    return true;
  },
    // ================= POST LIKES =================
  likePost: async (likeData, token) => {
    validateToken(token);
    const response = await fetch(`${API_BASE_URL}/api/postLike/addLikes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        postId: Number(likeData.postId),
        TeacherId: Number(likeData.TeacherId)
      }),
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to like post: ${response.status} ${errorData}`);
    }
    return response.json();
  },

  unlikePost: async (postId, TeacherId, token) => {
    validateToken(token);
    const response = await fetch(
      `${API_BASE_URL}/api/postLike/unlike?postId=${Number(postId)}&TeacherId=${Number(TeacherId)}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }
    );
    if (!response.ok) throw new Error('Failed to unlike post');
    return true;
  },

  getLikeCount: async (postId, token) => {
    validateToken(token);
    const response = await fetch(
      `${API_BASE_URL}/api/postLike/posts/likesCount/${Number(postId)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch like count');
    return response.json();
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




