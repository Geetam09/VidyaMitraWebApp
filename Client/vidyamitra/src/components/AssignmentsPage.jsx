import { useState, useEffect } from 'react';

const AssignmentManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    
    // Initialize assignments data
    const initialAssignments = [
      {
        id: 1,
        title: 'Algebra Practice Set 1',
        status: 'active',
        description: 'Practice problems on linear equations and basic algebraic equations',
        subject: 'Mathematics',
        grade: 'Grade 8A',
        dueDate: '1/25/2025',
        completed: 6,
        total: 8,
        progress: 75,
        graded: 9,
        students: [
          { name: 'Alice Johnson', roll: 'OBA-001', completed: true },
          { name: 'Michael Chen', roll: 'OBA-002', completed: true },
          { name: 'Sarah Wilson', roll: 'OBA-003', completed: false },
          { name: 'James Brown', roll: 'OBA-004', completed: true },
          { name: 'Emma Davis', roll: 'OBA-005', completed: false },
          { name: 'David Lee', roll: 'OBA-006', completed: true },
          { name: 'Sophia Garcia', roll: 'OBA-007', completed: true },
          { name: 'Robert Wilson', roll: 'OBA-008', completed: true },
        ]
      },
      {
        id: 2,
        title: 'Science Lab Report - pH Testing',
        status: 'grading',
        description: 'Document your observations from the pH testing experiment',
        subject: 'Science',
        grade: 'Grade 7B',
        dueDate: '1/24/2025',
        completed: 6,
        total: 6,
        progress: 100,
        graded: 9,
        students: [
          { name: 'Alice Johnson', roll: 'OBA-001', completed: true },
          { name: 'Michael Chen', roll: 'OBA-002', completed: true },
          { name: 'Sarah Wilson', roll: 'OBA-003', completed: true },
          { name: 'James Brown', roll: 'OBA-004', completed: true },
          { name: 'Emma Davis', roll: 'OBA-005', completed: true },
          { name: 'David Lee', roll: 'OBA-006', completed: true },
        ]
      },
      {
        id: 3,
        title: 'Essay: My Village',
        status: 'active',
        description: 'Write a descriptive essay about your village and community',
        subject: 'English',
        grade: 'Grade 9A',
        dueDate: '1/26/2025',
        completed: 4,
        total: 7,
        progress: 57,
        graded: 4,
        students: [
          { name: 'Alice Johnson', roll: 'OBA-001', completed: true },
          { name: 'Michael Chen', roll: 'OBA-002', completed: true },
          { name: 'Sarah Wilson', roll: 'OBA-003', completed: false },
          { name: 'James Brown', roll: 'OBA-004', completed: false },
          { name: 'Emma Davis', roll: 'OBA-005', completed: true },
          { name: 'David Lee', roll: 'OBA-006', completed: false },
          { name: 'Sophia Garcia', roll: 'OBA-007', completed: true },
        ]
      },
      {
        id: 4,
        title: 'History Timeline Project',
        status: 'completed',
        description: 'Create a timeline of important events in Indian independence movement',
        subject: 'Social Studies',
        grade: 'Grade BA',
        dueDate: '1/22/2025',
        completed: 8,
        total: 8,
        progress: 100,
        graded: 8,
        students: [
          { name: 'Alice Johnson', roll: 'OBA-001', completed: true },
          { name: 'Michael Chen', roll: 'OBA-002', completed: true },
          { name: 'Sarah Wilson', roll: 'OBA-003', completed: true },
          { name: 'James Brown', roll: 'OBA-004', completed: true },
          { name: 'Emma Davis', roll: 'OBA-005', completed: true },
          { name: 'David Lee', roll: 'OBA-006', completed: true },
          { name: 'Sophia Garcia', roll: 'OBA-007', completed: true },
          { name: 'Robert Wilson', roll: 'OBA-008', completed: true },
        ]
      }
    ];

    setAssignments(initialAssignments);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Active Assignments', value: '8', color: 'bg-blue-500' },
    { label: 'Submissions Today', value: '24', color: 'bg-blue-600' },
    { label: 'Pending Grading', value: '12', color: 'bg-blue-700' },
    { label: 'Expert Reports', value: '85%', color: 'bg-blue-800' },
  ];

  const recentSubmissions = [
    { student: 'Alice Johnson', assignment: 'Algebra Practice Set 1', time: '2 hours ago' },
    { student: 'Michael Chen', assignment: 'Essay: My Village', time: '4 hours ago' },
    { student: 'Emma Davis', assignment: 'Science Lab Report', time: '1 day ago' },
    { student: 'James Wilson', assignment: 'Algebra Practice Set 1', time: '1 day ago' }
  ];

  const quickActions = [
    { label: 'Bulk Download', icon: '📥' },
    { label: 'Auto Grade', icon: '⚡' },
    { label: 'Send Reminders', icon: '🔔' },
    { label: 'Schedule Assignment', icon: '📅' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'grading': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setActiveTab('details');
  };

  const handleCreateAssignment = () => {
    setShowCreateModal(true);
  };

  const toggleStudentCompletion = (assignmentId, studentRoll) => {
    setAssignments(prevAssignments => 
      prevAssignments.map(assignment => {
        if (assignment.id === assignmentId) {
          const updatedStudents = assignment.students.map(student => 
            student.roll === studentRoll 
              ? { ...student, completed: !student.completed }
              : student
          );
          
          const completedCount = updatedStudents.filter(s => s.completed).length;
          const totalCount = updatedStudents.length;
          const progress = Math.round((completedCount / totalCount) * 100);
          
          return {
            ...assignment,
            students: updatedStudents,
            completed: completedCount,
            progress: progress
          };
        }
        return assignment;
      })
    );

    // Update selected assignment if it's the one being modified
    if (selectedAssignment && selectedAssignment.id === assignmentId) {
      setSelectedAssignment(prev => {
        const updatedStudents = prev.students.map(student => 
          student.roll === studentRoll 
            ? { ...student, completed: !student.completed }
            : student
        );
        
        const completedCount = updatedStudents.filter(s => s.completed).length;
        const totalCount = updatedStudents.length;
        const progress = Math.round((completedCount / totalCount) * 100);
        
        return {
          ...prev,
          students: updatedStudents,
          completed: completedCount,
          progress: progress
        };
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 transition-colors duration-300">
                Assignment Management
              </h1>
              <p className="text-gray-600 transition-colors duration-300">
                Create, distribute, and track student assignments
              </p>
            </div>
            <button
              onClick={handleCreateAssignment}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Create Assignment</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-all duration-300">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center">
                <div className={`${stat.color} w-4 h-4 rounded-full mr-3 transition-all duration-300`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-600 transition-colors duration-300">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 transition-colors duration-300">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-300">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* All Assignments Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 transition-colors duration-300">
                  All Assignments
                </h2>
                <p className="text-sm text-gray-600 transition-colors duration-300">
                  Manage and track assignment progress
                </p>
              </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-4 transition-all duration-300">
              {assignments.map((assignment, index) => (
                <div
                  key={assignment.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300">
                          {assignment.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)} transition-colors duration-300`}>
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2 transition-colors duration-300">
                        {assignment.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 transition-colors duration-300">
                        <span>{assignment.subject} • {assignment.grade}</span>
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-blue-600 transition-colors duration-300">
                        {assignment.progress}%
                      </div>
                      <div className="text-sm text-gray-500 transition-colors duration-300">
                        completed
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1 transition-colors duration-300">
                      <span>Completion Progress</span>
                      <span>{assignment.completed}/{assignment.total} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 transition-all duration-300">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${assignment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 transition-colors duration-300">
                      {assignment.graded} graded
                    </span>
                    <button
                      onClick={() => handleViewDetails(assignment)}
                      className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-300 flex items-center space-x-1"
                    >
                      <span>View Details</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 transition-all duration-300">
            {/* Recent Submissions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300">
                Recent Submissions
              </h2>
              <div className="space-y-4">
                {recentSubmissions.map((submission, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold transition-colors duration-300">
                      {submission.student.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 transition-colors duration-300">
                        {submission.student}
                      </p>
                      <p className="text-sm text-gray-600 transition-colors duration-300">
                        {submission.assignment}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 transition-colors duration-300">
                      {submission.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <span className="text-2xl mb-2 transition-transform duration-300 group-hover:scale-110">
                      {action.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700 transition-colors duration-300 group-hover:text-blue-600">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300">
                Export Reports
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 transition-all duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 transition-colors duration-300">
                    85%
                  </div>
                  <div className="text-sm text-gray-600 transition-colors duration-300">
                    Average Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 transition-all duration-300 transform scale-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Assignment</h2>
              <p className="text-gray-600">Set up a new assignment for your students</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title
                </label>
                <input
                  type="text"
                  placeholder="Enter assignment title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
                    <option>Select subject</option>
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>Social Studies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
                    <option>Select class</option>
                    <option>Grade 8A</option>
                    <option>Grade 7B</option>
                    <option>Grade 9A</option>
                    <option>Grade BA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Assignment instructions and requirements"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Marks
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50">
                  <p className="text-gray-600">Drop files here or click to upload</p>
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
                onClick={() => setShowCreateModal(false)}
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
        <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 transition-all duration-300 transform scale-100">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedAssignment.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedAssignment.subject} • {selectedAssignment.grade}</p>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-300 p-2 hover:bg-white rounded-lg"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left Column - Assignment Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-600">{selectedAssignment.description}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Due Date</span>
                        <span className="font-semibold text-blue-600">{selectedAssignment.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Progress */}
                  <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Student Progress</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {selectedAssignment.students?.map((student, index) => (
                      <div 
                        key={student.roll} 
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-600">Roll: {student.roll}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleStudentCompletion(selectedAssignment.id, student.roll)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                              student.completed 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200' 
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-200'
                            }`}
                          >
                            {student.completed ? 'Completed' : 'Incomplete'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
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
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-green-300 transition-all duration-300">
                      <div className="text-2xl font-bold text-green-600">{selectedAssignment.total - selectedAssignment.completed}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;