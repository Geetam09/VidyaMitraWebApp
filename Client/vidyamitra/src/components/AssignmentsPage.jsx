import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AssignmentsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    classId: '',
    subject: '',
    grade: ''
  });
  const [classStudents, setClassStudents] = useState([]);
  const [studentSubmissions, setStudentSubmissions] = useState({});
  const [fileUploads, setFileUploads] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewDetailsLoading, setViewDetailsLoading] = useState(false);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      
      const [assignmentsData, studentsData, classesData] = await Promise.all([
        apiService.getAllAssignments(token),
        apiService.getAllStudents(token),
        apiService.getAllClasses(token)
      ]);

      const transformedAssignments = await transformAssignments(assignmentsData, token);
      setAssignments(transformedAssignments);
      setStudents(studentsData);
      setClasses(classesData);
      
      // Fetch recent submissions
      await fetchRecentSubmissions(token, assignmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  // CREATE ASSIGNMENT FUNCTION
  const createAssignment = async (assignmentData) => {
    try {
      const token = getToken();
      
      // Validate required fields
      if (!assignmentData.title || !assignmentData.description || !assignmentData.dueDate || !assignmentData.classId) {
        throw new Error('Please fill in all required fields: Title, Description, Due Date, and Class');
      }

      // Format the data for API
      const formattedData = {
        title: assignmentData.title.trim(),
        description: assignmentData.description.trim(),
        dueDate: assignmentData.dueDate,
        classId: parseInt(assignmentData.classId),
        subject: assignmentData.subject || 'General',
        grade: assignmentData.grade || `Grade ${assignmentData.classId}`,
        status: 'active', // Default status for new assignments
        createdAt: new Date().toISOString()
      };

      console.log('Creating assignment with data:', formattedData);

      // Call API service to create assignment
      const response = await apiService.createAssignment(formattedData, token);
      
      if (response && response.id) {
        console.log('Assignment created successfully:', response);
        
        // Refresh the assignments list
        await fetchData();
        
        return {
          success: true,
          message: 'Assignment created successfully!',
          assignment: response
        };
      } else {
        throw new Error('Failed to create assignment: No response from server');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      return {
        success: false,
        message: error.message || 'Failed to create assignment. Please try again.'
      };
    }
  };

  // VIEW ASSIGNMENT DETAILS FUNCTION
  const viewAssignmentDetails = async (assignmentId) => {
    try {
      setViewDetailsLoading(true);
      const token = getToken();

      console.log('Fetching details for assignment:', assignmentId);

      // Get assignment details
      const assignmentDetails = await apiService.getAssignmentById(assignmentId, token);
      
      if (!assignmentDetails) {
        throw new Error('Assignment not found');
      }

      // Get submissions for this assignment
      const submissions = await apiService.getSubmissionsByAssignment(assignmentId, token);
      
      // Get students in the class
      const classStudentsData = assignmentDetails.classId ? 
        await apiService.getAllStudents(token, assignmentDetails.classId) : [];

      // Calculate progress metrics
      const completedCount = submissions.filter(sub => 
        sub.status === 'completed' || sub.status === 'graded' || sub.grade !== null
      ).length;
      
      const totalStudents = classStudentsData.length;
      const progress = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;
      const gradedCount = submissions.filter(sub => sub.grade !== null).length;

      // Transform assignment data for display
      const transformedAssignment = {
        id: assignmentDetails.id,
        title: assignmentDetails.title,
        status: getStatusFromDueDate(assignmentDetails.dueDate),
        description: assignmentDetails.description,
        subject: assignmentDetails.subject || 'General',
        grade: assignmentDetails.grade || `Grade ${assignmentDetails.classId}`,
        dueDate: formatDate(assignmentDetails.dueDate),
        completed: completedCount,
        total: totalStudents,
        progress: progress,
        graded: gradedCount,
        classId: assignmentDetails.classId,
        submissions: submissions,
        originalDueDate: assignmentDetails.dueDate,
        createdAt: assignmentDetails.createdAt
      };

      console.log('Assignment details loaded:', transformedAssignment);

      // Set up student submissions data for grading
      const initialSubmissions = {};
      const initialFileUploads = {};
      
      classStudentsData.forEach(student => {
        const existingSubmission = submissions.find(sub => sub.studentId === student.id);
        
        initialSubmissions[student.id] = {
          grade: existingSubmission?.grade || '',
          comment: existingSubmission?.comment || '',
          fileUrl: existingSubmission?.fileUrl || null,
          submittedAt: existingSubmission?.submittedAt || null,
          status: existingSubmission?.status || 'not_started'
        };
        
        initialFileUploads[student.id] = null;
      });

      setClassStudents(classStudentsData);
      setStudentSubmissions(initialSubmissions);
      setFileUploads(initialFileUploads);
      setSelectedAssignment(transformedAssignment);
      setActiveTab('details');

      return {
        success: true,
        assignment: transformedAssignment
      };

    } catch (error) {
      console.error('Error viewing assignment details:', error);
      return {
        success: false,
        message: error.message || 'Failed to load assignment details. Please try again.'
      };
    } finally {
      setViewDetailsLoading(false);
    }
  };

  const fetchRecentSubmissions = async (token, assignmentsData) => {
    try {
      const allSubmissions = [];
      
      for (const assignment of assignmentsData.slice(0, 5)) { // Limit to recent 5 assignments
        try {
          const submissions = await apiService.getSubmissionsByAssignment(assignment.id, token);
          const submissionsWithAssignmentInfo = submissions.map(sub => ({
            ...sub,
            assignmentTitle: assignment.title,
            assignmentId: assignment.id,
            subject: assignment.subject
          }));
          allSubmissions.push(...submissionsWithAssignmentInfo);
        } catch (error) {
          console.error(`Error fetching submissions for assignment ${assignment.id}:`, error);
        }
      }

      const submittedSubmissions = allSubmissions
        .filter(sub => sub.submittedAt || sub.fileUrl || sub.grade)
        .sort((a, b) => new Date(b.submittedAt || b.updatedAt) - new Date(a.submittedAt || a.updatedAt))
        .slice(0, 6);

      const enrichedSubmissions = await Promise.all(
        submittedSubmissions.map(async (submission) => {
          try {
            const student = students.find(s => s.id === submission.studentId) || 
                           await apiService.getStudentById(submission.studentId, token);
            return {
              id: submission.id,
              studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
              assignment: submission.assignmentTitle,
              assignmentId: submission.assignmentId,
              time: getTimeAgo(submission.submittedAt || submission.updatedAt),
              submittedAt: submission.submittedAt,
              grade: submission.grade,
              subject: submission.subject,
              studentId: submission.studentId
            };
          } catch (error) {
            return {
              id: submission.id,
              studentName: 'Unknown Student',
              assignment: submission.assignmentTitle,
              assignmentId: submission.assignmentId,
              time: getTimeAgo(submission.submittedAt || submission.updatedAt),
              submittedAt: submission.submittedAt,
              grade: submission.grade,
              subject: submission.subject,
              studentId: submission.studentId
            };
          }
        })
      );

      setRecentSubmissions(enrichedSubmissions);
    } catch (error) {
      console.error('Error fetching recent submissions:', error);
      setRecentSubmissions(getMockRecentSubmissions());
    }
  };

  const getMockRecentSubmissions = () => {
    const mockStudents = ['Alice Johnson', 'Michael Chen', 'Emma Davis', 'James Wilson', 'Sophia Garcia', 'Ryan Patel'];
    const mockAssignments = ['Algebra Practice Set 1', 'Essay: My Village', 'Science Lab Report', 'History Timeline Project'];
    
    return mockStudents.map((student, index) => ({
      id: `mock-${index}`,
      studentName: student,
      assignment: mockAssignments[index % mockAssignments.length],
      assignmentId: `mock-assignment-${index}`,
      time: index === 0 ? '2 hours ago' : 
            index === 1 ? '4 hours ago' : 
            index === 2 ? '1 day ago' : 
            index === 3 ? '1 day ago' : 
            index === 4 ? '2 days ago' : '3 days ago',
      submittedAt: new Date(Date.now() - (index * 6 * 60 * 60 * 1000)).toISOString(),
      grade: ['A', 'B+', 'A-', 'B', 'A+', 'C+'][index],
      subject: ['Mathematics', 'English', 'Science', 'Mathematics', 'History', 'Science'][index],
      studentId: `mock-student-${index}`
    }));
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else {
      return `${diffInDays} days ago`;
    }
  };

  const transformAssignments = async (apiAssignments, token) => {
    const transformed = await Promise.all(apiAssignments.map(async (assignment) => {
      try {
        const submissions = await apiService.getSubmissionsByAssignment(assignment.id, token);
        
        const completedCount = submissions.filter(sub => 
          sub.status === 'completed' || sub.status === 'graded' || sub.grade !== null
        ).length;
        
        const classStudentsData = assignment.classId ? 
          await apiService.getAllStudents(token, assignment.classId) : [];
        
        const totalStudents = classStudentsData.length;
        const progress = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;
        const gradedCount = submissions.filter(sub => sub.grade !== null).length;

        return {
          id: assignment.id,
          title: assignment.title,
          status: getStatusFromDueDate(assignment.dueDate),
          description: assignment.description,
          subject: assignment.subject || 'General',
          grade: assignment.grade || `Grade ${assignment.classId}`,
          dueDate: formatDate(assignment.dueDate),
          completed: completedCount,
          total: totalStudents,
          progress: progress,
          graded: gradedCount,
          classId: assignment.classId,
          submissions: submissions
        };
      } catch (error) {
        console.error(`Error transforming assignment ${assignment.id}:`, error);
        return {
          id: assignment.id,
          title: assignment.title,
          status: getStatusFromDueDate(assignment.dueDate),
          description: assignment.description,
          subject: assignment.subject || 'General',
          grade: assignment.grade || `Grade ${assignment.classId}`,
          dueDate: formatDate(assignment.dueDate),
          completed: 0,
          total: 0,
          progress: 0,
          graded: 0,
          classId: assignment.classId,
          submissions: []
        };
      }
    }));

    return transformed;
  };

  const handleFileUpload = async (file, studentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fileUrl = `https://example.com/uploads/assignment_${studentId}_${Date.now()}_${file.name}`;
        resolve(fileUrl);
      }, 500);
    });
  };

  const handleSubmitAssignment = async (assignmentId) => {
    try {
      setIsSubmitting(true);
      const token = getToken();
      
      const fileUploadPromises = Object.keys(fileUploads).map(async (studentId) => {
        const file = fileUploads[studentId];
        if (file) {
          const fileUrl = await handleFileUpload(file, studentId);
          return { studentId, fileUrl };
        }
        return { studentId, fileUrl: null };
      });

      const fileUploadResults = await Promise.all(fileUploadPromises);
      const fileUrlMap = fileUploadResults.reduce((acc, { studentId, fileUrl }) => {
        acc[studentId] = fileUrl;
        return acc;
      }, {});

      const submissionPromises = Object.keys(studentSubmissions).map(async (studentId) => {
        const submission = studentSubmissions[studentId];
        
        const submissionData = {
          assignmentId: parseInt(assignmentId),
          studentId: parseInt(studentId),
          grade: submission.grade || null,
          comment: submission.comment || null,
          fileUrl: fileUrlMap[studentId] || submission.fileUrl || null,
          status: submission.grade ? 'graded' : 'submitted'
        };

        return await apiService.submitAssignment(submissionData, token);
      });

      await Promise.all(submissionPromises);

      alert('Assignment submissions updated successfully!');
      await fetchData();
      setSelectedAssignment(null);
      
    } catch (error) {
      console.error('Error submitting assignments:', error);
      alert('Failed to submit assignments. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmissionChange = (studentId, field, value) => {
    setStudentSubmissions(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleFileChange = (studentId, file) => {
    setFileUploads(prev => ({
      ...prev,
      [studentId]: file
    }));
  };

  const getStatusFromDueDate = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    
    if (due < today) return 'completed';
    if (due.toDateString() === today.toDateString()) return 'grading';
    return 'active';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'grading': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject?.toLowerCase()) {
      case 'mathematics': return 'bg-blue-100 text-blue-600';
      case 'science': return 'bg-green-100 text-green-600';
      case 'english': return 'bg-purple-100 text-purple-600';
      case 'history': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // UPDATED HANDLER FUNCTIONS
  const handleCreateAssignment = () => {
    setShowCreateModal(true);
  };

  const handleCreateAssignmentSubmit = async () => {
    try {
      const result = await createAssignment(newAssignment);
      
      if (result.success) {
        setShowCreateModal(false);
        setNewAssignment({
          title: '',
          description: '',
          dueDate: '',
          classId: '',
          subject: '',
          grade: ''
        });
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error in create assignment handler:', error);
      alert('Failed to create assignment. Please try again.');
    }
  };

  const handleViewDetails = async (assignment) => {
    try {
      const result = await viewAssignmentDetails(assignment.id);
      
      if (!result.success) {
        alert(result.message);
      }
      // If successful, the state is already updated in viewAssignmentDetails
    } catch (error) {
      console.error('Error in view details handler:', error);
      alert('Failed to load assignment details.');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const token = getToken();
        await apiService.deleteAssignment(assignmentId, token);
        
        await fetchData();
        alert('Assignment deleted successfully!');
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Failed to delete assignment. Please try again.');
      }
    }
  };

  // Calculate stats dynamically
  const activeAssignmentsCount = assignments.filter(a => a.status === 'active').length;
  const submissionsTodayCount = recentSubmissions.filter(sub => {
    const submissionDate = new Date(sub.submittedAt);
    const today = new Date();
    return submissionDate.toDateString() === today.toDateString();
  }).length;
  const pendingGradingCount = assignments.reduce((acc, curr) => acc + (curr.completed - curr.graded), 0);
  const completionRate = assignments.length > 0 ? 
    Math.round(assignments.reduce((acc, curr) => acc + curr.progress, 0) / assignments.length) : 0;

  const stats = [
    { label: 'Active Assignments', value: activeAssignmentsCount.toString(), color: 'bg-blue-500' },
    { label: 'Submissions Today', value: submissionsTodayCount.toString(), color: 'bg-green-500' },
    { label: 'Pending Grading', value: pendingGradingCount.toString(), color: 'bg-yellow-500' },
    { label: 'Expert Reports', value: `${completionRate}%`, color: 'bg-purple-500' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Assignment Management
              </h1>
              <p className="text-gray-600 mt-1">
                Create, distribute, and track student assignments
              </p>
            </div>
            <button
              onClick={handleCreateAssignment}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 font-medium"
            >
              <span>+</span>
              <span>Create Assignment</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {stat.value.includes('%') ? '📊' : 
                     stat.label.includes('Active') ? '📝' :
                     stat.label.includes('Submissions') ? '📨' : '⏰'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Assignments */}
          <div className="lg:col-span-2">
            {/* All Assignments Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Assignments
                </h2>
                <span className="text-sm text-gray-600">
                  Manage and track assignment progress
                </span>
              </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-6">
              {assignments.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-lg">No assignments found. Create your first assignment!</p>
                </div>
              ) : (
                assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {assignment.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 text-sm">
                          {assignment.description}
                        </p>
                        <div className="text-sm text-gray-500">
                          <span>{assignment.subject} - {assignment.grade}</span>
                          <span className="mx-2">•</span>
                          <span>Due: {assignment.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Completion Progress</span>
                        <span>{assignment.completed}/{assignment.total} completed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${assignment.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {assignment.graded} graded
                      </span>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleViewDetails(assignment)}
                          disabled={viewDetailsLoading}
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {viewDetailsLoading ? 'Loading...' : 'View Details →'}
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-700 transition-colors duration-300 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Recent Submissions & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Submissions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Submissions
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Latest student submissions
              </p>
              <div className="space-y-4">
                {recentSubmissions.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No recent submissions
                  </div>
                ) : (
                  recentSubmissions.map((submission, index) => (
                    <div 
                      key={submission.id || index} 
                      className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        const assignment = assignments.find(a => a.id === submission.assignmentId);
                        if (assignment) {
                          handleViewDetails(assignment);
                        }
                      }}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                        {submission.studentName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {submission.studentName}
                          </p>
                          {submission.grade && (
                            <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
                              {submission.grade}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {submission.assignment}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${getSubjectColor(submission.subject)}`}>
                            {submission.subject}
                          </span>
                          <p className="text-xs text-gray-500">
                            {submission.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center space-x-3">
                  <span className="text-gray-600">📥</span>
                  <span className="text-gray-700 font-medium">Bulk Download</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center space-x-3">
                  <span className="text-gray-600">⚡</span>
                  <span className="text-gray-700 font-medium">Auto Grade</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center space-x-3">
                  <span className="text-gray-600">🔔</span>
                  <span className="text-gray-700 font-medium">Send Reminders</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center space-x-3">
                  <span className="text-gray-600">📅</span>
                  <span className="text-gray-700 font-medium">Schedule Assignment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Assignment</h2>
              <p className="text-gray-600">Set up a new assignment for your students</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter assignment title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select 
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class *
                  </label>
                  <select
                    value={newAssignment.classId}
                    onChange={(e) => setNewAssignment({...newAssignment, classId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.className || `Class ${cls.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Assignment instructions and requirements"
                  rows="4"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Grade 8A"
                    value={newAssignment.grade}
                    onChange={(e) => setNewAssignment({...newAssignment, grade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignmentSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Assignment Details View */}
      {selectedAssignment && activeTab === 'details' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedAssignment.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedAssignment.subject} • {selectedAssignment.grade}</p>
                  <p className="text-sm text-gray-500 mt-1">Assignment ID: {selectedAssignment.id}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedAssignment(null);
                    setActiveTab('overview');
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-300 p-2 hover:bg-white rounded-lg"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left Column - Assignment Info and Student Submissions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>
                  <div className="space-y-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-600">{selectedAssignment.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Due Date</span>
                          <span className="font-semibold text-blue-600">{selectedAssignment.dueDate}</span>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Status</span>
                          <span className={`font-semibold ${getStatusColor(selectedAssignment.status)} px-2 py-1 rounded`}>
                            {selectedAssignment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Submissions ({classStudents.length})</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {classStudents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No students found for this class
                      </div>
                    ) : (
                      classStudents.map((student) => {
                        const submission = studentSubmissions[student.id] || {};
                        return (
                          <div 
                            key={student.id} 
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-300 bg-white"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                  {student.firstName?.charAt(0) || 'S'}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {student.firstName} {student.lastName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Roll: {student.rollNumber}
                                  </p>
                                </div>
                              </div>
                              {submission.submittedAt && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                  Submitted
                                </span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Grade
                                </label>
                                <select
                                  value={submission.grade || ''}
                                  onChange={(e) => handleSubmissionChange(student.id, 'grade', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select Grade</option>
                                  <option value="A++">A++</option>
                                  <option value="A+">A+</option>
                                  <option value="A">A</option>
                                  <option value="B+">B+</option>
                                  <option value="B">B</option>
                                  <option value="C+">C+</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="F">F</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Upload File
                                </label>
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(student.id, e.target.files[0])}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                {fileUploads[student.id] && (
                                  <p className="text-xs text-green-600 mt-1">
                                    📎 {fileUploads[student.id].name}
                                  </p>
                                )}
                                {submission.fileUrl && !fileUploads[student.id] && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    📎 File uploaded
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comments
                              </label>
                              <textarea
                                value={submission.comment || ''}
                                onChange={(e) => handleSubmissionChange(student.id, 'comment', e.target.value)}
                                placeholder="Add feedback (e.g., 'completed', 'pending', 'needs improvement')..."
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Submit All Button */}
                  {classStudents.length > 0 && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleSubmitAssignment(selectedAssignment.id)}
                        disabled={isSubmitting}
                        className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 font-medium shadow-lg hover:shadow-xl`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg">✓</span>
                            <span>Submit All Student Assessments</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column - Progress Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 mb-6 border border-blue-200">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{selectedAssignment.progress}%</div>
                      <div className="text-gray-600 font-medium">Overall Completion Rate</div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-700">Students Completed</span>
                        <span className="text-blue-600">{selectedAssignment.completed}/{selectedAssignment.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${selectedAssignment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-3 font-medium shadow-lg hover:shadow-xl">
                      <span className="text-lg">📥</span>
                      <span>Bulk Download Submissions</span>
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-3 font-medium hover:border-blue-300">
                      <span className="text-lg">🔔</span>
                      <span>Send Reminders</span>
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-3 font-medium hover:border-green-300">
                      <span className="text-lg">📊</span>
                      <span>Generate Report</span>
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition-all duration-300">
                      <div className="text-2xl font-bold text-blue-600">{selectedAssignment.graded}</div>
                      <div className="text-sm text-gray-600">Graded</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-yellow-300 transition-all duration-300">
                      <div className="text-2xl font-bold text-yellow-600">{selectedAssignment.total - selectedAssignment.completed}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                  </div>

                  {/* Recent Submissions for this assignment */}
                  {selectedAssignment.submissions && selectedAssignment.submissions.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {selectedAssignment.submissions
                          .filter(sub => sub.submittedAt)
                          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                          .slice(0, 5)
                          .map((sub, index) => {
                            const student = classStudents.find(s => s.id === sub.studentId);
                            return (
                              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                                      {student?.firstName?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {student?.firstName} {student?.lastName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(sub.submittedAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  {sub.grade && (
                                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                      {sub.grade}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;