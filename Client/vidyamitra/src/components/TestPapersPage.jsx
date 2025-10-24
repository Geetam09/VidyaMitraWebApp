import React, { useState, useCallback, useRef } from 'react';

const TestPapersPage = () => {
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [questionTypes, setQuestionTypes] = useState({
    multipleChoice: false,
    shortAnswer: false,
    longAnswer: false,
    fillInBlanks: false,
  });
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // New state for test paper details
  const [testDetails, setTestDetails] = useState({
    schoolName: '',
    examType: '',
    totalMarks: '',
    duration: '',
    date: '',
    instructions: ''
  });

  const testPaperRef = useRef();

  const subjects = ['Mathematics', 'Science', 'History', 'English', 'Computer Science'];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Advanced'];
  const examTypes = ['Unit Test', 'Mid-Term', 'Final Exam', 'Quiz', 'Practice Test'];

  const handleQuestionTypeChange = useCallback((type) => {
    setQuestionTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  }, []);

  const handleTestDetailsChange = (field, value) => {
    setTestDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateQuestions = useCallback(async () => {
    if (!subject || !difficulty || Object.values(questionTypes).every(v => !v)) {
      alert('Please fill in all required fields and select at least one question type.');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock questions with more variety
    const typeKeys = Object.keys(questionTypes).filter(key => questionTypes[key]);
    const mockQuestions = Array.from({ length: numQuestions }, (_, i) => {
      const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
      return {
        id: i + 1,
        type: randomType,
        question: `Sample ${randomType.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} question ${i + 1} for ${subject}`,
        marks: Math.floor(Math.random() * 5) + 1
      };
    });
    
    setQuestions(mockQuestions);
    setIsGenerating(false);
  }, [subject, difficulty, questionTypes, numQuestions]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setTimeout(() => {
        alert('Syllabus uploaded successfully!');
      }, 1000);
    }
  };

  const exportToPDF = () => {
    if (questions.length === 0) {
      alert('Please generate questions first before exporting.');
      return;
    }

    // In a real application, you would use a library like jsPDF or html2pdf
    // This is a simplified version that creates a print-friendly view
    const printWindow = window.open('', '_blank');
    const testPaperHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Paper - ${subject}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .school-name { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .exam-details { 
            display: flex; 
            justify-content: space-between; 
            margin: 20px 0;
            flex-wrap: wrap;
          }
          .detail-item { 
            margin: 5px 0; 
          }
          .instructions {
            background: #f5f5f5;
            padding: 15px;
            border-left: 4px solid #007acc;
            margin: 20px 0;
          }
          .question { 
            margin: 20px 0; 
            page-break-inside: avoid;
          }
          .question-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .question-type {
            background: #007acc;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
          }
          .marks {
            font-weight: bold;
          }
          @media print {
            body { margin: 20px; }
            .question { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">${testDetails.schoolName || 'School Name'}</div>
          <h1>${examTypes.find(et => et === testDetails.examType) || 'Exam'} - ${subject}</h1>
        </div>
        
        <div class="exam-details">
          <div>
            <div class="detail-item"><strong>Subject:</strong> ${subject}</div>
            <div class="detail-item"><strong>Difficulty:</strong> ${difficulty}</div>
            <div class="detail-item"><strong>Exam Type:</strong> ${testDetails.examType}</div>
          </div>
          <div>
            <div class="detail-item"><strong>Total Marks:</strong> ${testDetails.totalMarks || questions.reduce((sum, q) => sum + q.marks, 0)}</div>
            <div class="detail-item"><strong>Duration:</strong> ${testDetails.duration}</div>
            <div class="detail-item"><strong>Date:</strong> ${testDetails.date}</div>
          </div>
        </div>

        ${testDetails.instructions ? `
          <div class="instructions">
            <strong>Instructions:</strong><br>
            ${testDetails.instructions}
          </div>
        ` : ''}

        <div class="questions">
          ${questions.map((q, index) => `
            <div class="question">
              <div class="question-header">
                <span class="question-type">${q.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span class="marks">${q.marks} Mark${q.marks > 1 ? 's' : ''}</span>
              </div>
              <div><strong>Q${index + 1}:</strong> ${q.question}</div>
              ${q.type === 'multipleChoice' ? `
                <div style="margin-left: 20px; margin-top: 10px;">
                  <div>A) ________________</div>
                  <div>B) ________________</div>
                  <div>C) ________________</div>
                  <div>D) ________________</div>
                </div>
              ` : q.type === 'fillInBlanks' ? `
                <div style="margin-left: 20px; margin-top: 10px;">
                  <div>Answer: ________________</div>
                </div>
              ` : `
                <div style="margin-left: 20px; margin-top: 10px; height: 100px; border-bottom: 1px solid #ccc;"></div>
              `}
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(testPaperHTML);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      // printWindow.close(); // Uncomment if you want to auto-close after printing
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Test Generator</h1>
          <p className="text-xl text-gray-600">Create customized test papers from your syllabus</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-8 lg:col-span-1">
            {/* Test Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Test Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                  <input
                    type="text"
                    value={testDetails.schoolName}
                    onChange={(e) => handleTestDetailsChange('schoolName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter school name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                  <select
                    value={testDetails.examType}
                    onChange={(e) => handleTestDetailsChange('examType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select exam type</option>
                    {examTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
                    <input
                      type="number"
                      value={testDetails.totalMarks}
                      onChange={(e) => handleTestDetailsChange('totalMarks', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Marks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={testDetails.duration}
                      onChange={(e) => handleTestDetailsChange('duration', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 2 hours"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={testDetails.date}
                    onChange={(e) => handleTestDetailsChange('date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                  <textarea
                    value={testDetails.instructions}
                    onChange={(e) => handleTestDetailsChange('instructions', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter exam instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Test Configuration Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Test Configuration</h2>

              {/* Subject Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select subject</option>
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        difficulty === diff
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg font-semibold text-gray-700 min-w-12">{numQuestions}</span>
                </div>
              </div>

              {/* Question Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Question Types</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'multipleChoice', label: 'Multiple Choice' },
                    { key: 'shortAnswer', label: 'Short Answer' },
                    { key: 'longAnswer', label: 'Long Answer' },
                    { key: 'fillInBlanks', label: 'Fill in Blanks' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => handleQuestionTypeChange(key)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        questionTypes[key]
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Syllabus Upload Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Syllabus Upload</h3>
              <p className="text-gray-600 mb-4">Upload curriculum documents</p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-200 hover:border-blue-400">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="syllabus-upload"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <label htmlFor="syllabus-upload" className="cursor-pointer block">
                  <div className="text-blue-500 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-1">Click to upload syllabus</p>
                  <p className="text-sm text-gray-500">PDF, DOC, DOCX, TXT (Max 10MB)</p>
                </label>
              </div>
              
              {uploadedFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">✓ {uploadedFile.name} uploaded successfully</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Generated Test Paper */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Generated Test Paper</h2>
                {questions.length > 0 && (
                  <button
                    onClick={exportToPDF}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export as PDF</span>
                  </button>
                )}
              </div>

              <p className="text-gray-600 mb-6">
                {questions.length > 0 
                  ? `Generated ${questions.length} questions based on your configuration`
                  : 'Configure settings and click "Generate Questions"'
                }
              </p>

              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg mb-6">No questions generated yet</p>
                  <p className="text-gray-400">Select your preferences and click "Generate Questions"</p>
                </div>
              ) : (
                <div ref={testPaperRef} className="space-y-6">
                  {/* Test Paper Header Preview */}
                  <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                    <div className="text-center mb-4">
                      <div className="text-xl font-bold text-gray-800">{testDetails.schoolName || 'School Name'}</div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        {testDetails.examType || 'Exam'} - {subject}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div><strong>Subject:</strong> {subject}</div>
                        <div><strong>Difficulty:</strong> {difficulty}</div>
                        <div><strong>Exam Type:</strong> {testDetails.examType}</div>
                      </div>
                      <div>
                        <div><strong>Total Marks:</strong> {testDetails.totalMarks || questions.reduce((sum, q) => sum + q.marks, 0)}</div>
                        <div><strong>Duration:</strong> {testDetails.duration}</div>
                        <div><strong>Date:</strong> {testDetails.date}</div>
                      </div>
                    </div>
                    {testDetails.instructions && (
                      <div className="mt-4 p-3 bg-white rounded border">
                        <strong>Instructions:</strong> {testDetails.instructions}
                      </div>
                    )}
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4">
                    {questions.map((q, index) => (
                      <div key={q.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {q.type.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-sm text-gray-500">{q.marks} marks</span>
                        </div>
                        <p className="text-gray-800"><strong>Q{index + 1}:</strong> {q.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="mt-8">
                <button
                  onClick={generateQuestions}
                  disabled={isGenerating}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                    isGenerating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Questions...
                    </div>
                  ) : (
                    'Generate Questions'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Manage cookies or opt out</p>
        </div>
      </div>
    </div>
  );
};

export default TestPapersPage;