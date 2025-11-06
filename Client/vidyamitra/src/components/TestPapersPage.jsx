import React, { useState, useCallback, useRef } from 'react';
import FloatingChatbot from "./FloatingChatbot";
import { apiService } from "../services/apiService";

const TestPapersPage = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [questionTypes, setQuestionTypes] = useState({
    multipleChoice: false,
    shortAnswer: false,
    longAnswer: false,
    fillInBlanks: false,
  });
  const [questions, setQuestions] = useState([]);
  const [answerKey, setAnswerKey] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  
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
  const answerKeyRef = useRef();

  const subjects = ['Mathematics', 'Science', 'History', 'English', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];
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
    if (!subject || !difficulty || !topic || Object.values(questionTypes).every(v => !v)) {
      setError('Please fill in all required fields and select at least one question type.');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      // Calculate breakdown based on selected question types
      const selectedTypes = Object.keys(questionTypes).filter(key => questionTypes[key]);
      const questionsPerType = Math.floor(numQuestions / selectedTypes.length);
      const remainder = numQuestions % selectedTypes.length;
      
      const breakdown = {
        multipleChoice: 0,
        fillInBlanks: 0,
        shortAnswer: 0,
        longAnswer: 0
      };

      selectedTypes.forEach((type, index) => {
        let count = questionsPerType;
        if (index < remainder) count += 1;
        
        switch(type) {
          case 'multipleChoice':
            breakdown.multipleChoice = count;
            break;
          case 'fillInBlanks':
            breakdown.fillInBlanks = count;
            break;
          case 'shortAnswer':
            breakdown.shortAnswer = count;
            break;
          case 'longAnswer':
            breakdown.longAnswer = count;
            break;
          default:
            break;
        }
      });

      // Ensure total matches exactly
      const totalFromBreakdown = breakdown.multipleChoice + breakdown.fillInBlanks + breakdown.shortAnswer + breakdown.longAnswer;
      if (totalFromBreakdown !== numQuestions) {
        const largestType = Object.keys(breakdown).reduce((a, b) => breakdown[a] > breakdown[b] ? a : b);
        breakdown[largestType] += (numQuestions - totalFromBreakdown);
      }

      const testSpecification = {
        subject,
        topic,
        difficulty,
        totalQuestions: numQuestions,
        breakdown
      };

      console.log('Sending test specification:', testSpecification);

      // Use the actual API service
      const response = await apiService.generateTestPaper(testSpecification);
      
      console.log('API Response received:', response);
      
      if (response && response.testPaper) {
        // Parse the response and extract questions and answers
        const { questions: generatedQuestions, answers } = parseGeneratedTest(response.testPaper);
        
        setQuestions(generatedQuestions);
        setAnswerKey(answers);
        
        if (generatedQuestions.length === 0) {
          setError('No questions were generated. Please try again with different parameters.');
        } else {
          setError(''); // Clear any previous errors
        }
      } else {
        throw new Error('Invalid response format from server - missing testPaper field');
      }
      
    } catch (error) {
      console.error('Failed to generate test:', error);
      setError(`Failed to generate test paper: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [subject, topic, difficulty, questionTypes, numQuestions]);

  // Enhanced parser that separates questions and answers properly
  const parseGeneratedTest = (testPaperText) => {
    if (!testPaperText || typeof testPaperText !== 'string') {
      console.warn('Invalid test paper text received:', testPaperText);
      return { questions: [], answers: [] };
    }

    console.log('Parsing test paper text:', testPaperText);

    const questions = [];
    const answers = [];
    
    // Split into questions and answer key sections
    const sections = testPaperText.split('---');
    const questionsSection = sections[1] || testPaperText;
    const answerKeySection = sections[2] || '';

    // Parse questions
    const lines = questionsSection.split('\n').filter(line => line.trim());
    let currentQuestion = null;
    let inQuestionsSection = false;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('**Questions**') || trimmedLine.includes('Questions')) {
        inQuestionsSection = true;
        return;
      }
      
      if (inQuestionsSection && trimmedLine.match(/^\d+\./)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        const questionNumber = parseInt(trimmedLine.match(/^(\d+)/)[1]);
        currentQuestion = {
          id: questionNumber,
          type: 'multipleChoice',
          question: trimmedLine.replace(/^\d+\.\s*/, ''),
          marks: 1,
          options: []
        };
      } 
      else if (inQuestionsSection && trimmedLine.match(/^[A-D]\)/)) {
        if (currentQuestion) {
          currentQuestion.options.push(trimmedLine);
        }
      }
      else if (inQuestionsSection && currentQuestion && trimmedLine && 
               !trimmedLine.includes('**') && 
               !trimmedLine.includes('---') &&
               !trimmedLine.match(/^[A-D]\)/)) {
        currentQuestion.question += ' ' + trimmedLine;
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    // Parse answer key
    if (answerKeySection) {
      const answerLines = answerKeySection.split('\n').filter(line => line.trim());
      let inAnswerKey = false;

      answerLines.forEach(line => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.includes('**Answer Key**') || trimmedLine.includes('Answer Key')) {
          inAnswerKey = true;
          return;
        }
        
        if (inAnswerKey && trimmedLine.match(/^\d+\.?\s*[A-D]/)) {
          const match = trimmedLine.match(/^(\d+)\.?\s*([A-D])/);
          if (match) {
            const questionNumber = parseInt(match[1]);
            const answer = match[2];
            
            const question = questions.find(q => q.id === questionNumber);
            if (question) {
              answers.push({
                id: questionNumber,
                question: question.question,
                answer: answer,
                type: question.type
              });
            }
          }
        }
      });
    }

    console.log('Parsed questions:', questions);
    console.log('Parsed answers:', answers);

    return { questions, answers };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setTimeout(() => {
        alert('Syllabus uploaded successfully!');
      }, 1000);
    }
  };

  const exportToPDF = (type = 'test') => {
    if ((type === 'test' && questions.length === 0) || (type === 'answer' && answerKey.length === 0)) {
      alert(`Please generate ${type === 'test' ? 'questions' : 'answers'} first before exporting.`);
      return;
    }

    const printWindow = window.open('', '_blank');
    const htmlContent = type === 'test' ? generateTestPaperHTML() : generateAnswerKeyHTML();
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const generateTestPaperHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Paper - ${subject}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          body { 
            font-family: 'Inter', sans-serif; 
            margin: 0;
            padding: 40px;
            line-height: 1.6;
            background: white;
            color: #1f2937;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #1e40af;
            padding-bottom: 25px;
            margin-bottom: 30px;
          }
          .school-name { 
            font-size: 28px; 
            font-weight: 700; 
            color: #1e40af;
            margin-bottom: 8px;
          }
          .exam-title {
            font-size: 22px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
          }
          .topic {
            font-size: 18px;
            color: #6b7280;
            margin-bottom: 20px;
          }
          .exam-details { 
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 25px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
          }
          .detail-item { 
            margin: 4px 0;
            font-size: 14px;
          }
          .detail-label {
            font-weight: 600;
            color: #374151;
          }
          .instructions {
            background: #fff7ed;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            margin: 25px 0;
            font-size: 14px;
          }
          .questions-section {
            margin-top: 30px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 20px;
          }
          .question { 
            margin: 25px 0;
            padding: 20px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            page-break-inside: avoid;
          }
          .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #f3f4f6;
          }
          .question-number {
            font-weight: 600;
            color: #1e40af;
            font-size: 16px;
          }
          .marks {
            background: #ef4444;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
          }
          .question-text {
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 15px;
            color: #374151;
          }
          .options {
            margin-left: 0;
          }
          .option {
            margin: 10px 0;
            padding: 8px 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
          }
          .option:hover {
            background: #e2e8f0;
          }
          .answer-space {
            margin-top: 15px;
            padding: 15px;
            border: 1px dashed #cbd5e1;
            border-radius: 6px;
            background: #f8fafc;
            min-height: 80px;
          }
          @media print {
            body { 
              margin: 20px; 
              padding: 0;
            }
            .container {
              max-width: 100%;
            }
            .question { 
              page-break-inside: avoid;
              margin: 20px 0;
            }
            .header {
              margin-bottom: 20px;
            }
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="school-name">${testDetails.schoolName || 'ATSS Chinchwad'}</div>
            <div class="exam-title">${testDetails.examType || 'Quiz'} - ${subject}</div>
            <div class="topic">Topic: ${topic}</div>
          </div>
          
          <div class="exam-details">
            <div>
              <div class="detail-item"><span class="detail-label">Subject:</span> ${subject}</div>
              <div class="detail-item"><span class="detail-label">Topic:</span> ${topic}</div>
              <div class="detail-item"><span class="detail-label">Difficulty:</span> ${difficulty}</div>
              <div class="detail-item"><span class="detail-label">Exam Type:</span> ${testDetails.examType}</div>
            </div>
            <div>
              <div class="detail-item"><span class="detail-label">Total Marks:</span> ${testDetails.totalMarks || questions.reduce((sum, q) => sum + q.marks, 0)}</div>
              <div class="detail-item"><span class="detail-label">Duration:</span> ${testDetails.duration} hour${testDetails.duration !== '1' ? 's' : ''}</div>
              <div class="detail-item"><span class="detail-label">Date:</span> ${testDetails.date}</div>
              <div class="detail-item"><span class="detail-label">Total Questions:</span> ${questions.length}</div>
            </div>
          </div>

          <div class="instructions">
            <strong>Instructions:</strong><br>
            ${testDetails.instructions && testDetails.instructions !== 'na' ? testDetails.instructions : `
            • Read all questions carefully before answering<br>
            • Choose the single best answer for multiple choice questions<br>
            • Write your answers in the space provided<br>
            • All questions carry equal marks<br>
            • No negative marking
            `}
          </div>

          <div class="questions-section">
            <div class="section-title">Multiple Choice Questions</div>
            ${questions.map((q, index) => `
              <div class="question">
                <div class="question-header">
                  <div class="question-number">Q${index + 1}</div>
                  <div class="marks">${q.marks} Mark${q.marks > 1 ? 's' : ''}</div>
                </div>
                <div class="question-text">${q.question}</div>
                ${q.options && q.options.length > 0 ? `
                  <div class="options">
                    ${q.options.map(option => `<div class="option">${option}</div>`).join('')}
                  </div>
                ` : `
                  <div class="answer-space">Write your answer here...</div>
                `}
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>Generated by Test Generator Pro | Page 1 of 1</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const generateAnswerKeyHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Answer Key - ${subject}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          body { 
            font-family: 'Inter', sans-serif; 
            margin: 0;
            padding: 40px;
            line-height: 1.6;
            background: white;
            color: #1f2937;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #059669;
            padding-bottom: 25px;
            margin-bottom: 30px;
          }
          .school-name { 
            font-size: 28px; 
            font-weight: 700; 
            color: #059669;
            margin-bottom: 8px;
          }
          .exam-title {
            font-size: 22px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
          }
          .topic {
            font-size: 18px;
            color: #6b7280;
            margin-bottom: 20px;
          }
          .exam-details { 
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 25px 0;
            padding: 20px;
            background: #f0fdf4;
            border-radius: 8px;
            border-left: 4px solid #10b981;
          }
          .detail-item { 
            margin: 4px 0;
            font-size: 14px;
          }
          .detail-label {
            font-weight: 600;
            color: #374151;
          }
          .answers-section {
            margin-top: 30px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #059669;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 20px;
          }
          .answer { 
            margin: 20px 0;
            padding: 20px;
            background: #f0fdf4;
            border: 1px solid #d1fae5;
            border-radius: 8px;
            page-break-inside: avoid;
          }
          .question-number {
            font-weight: 600;
            color: #059669;
            font-size: 16px;
            margin-bottom: 8px;
          }
          .question-text {
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 12px;
            color: #374151;
            padding: 12px;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #10b981;
          }
          .correct-answer {
            color: #065f46;
            font-weight: 600;
            font-size: 15px;
            padding: 10px 15px;
            background: #d1fae5;
            border-radius: 6px;
            border-left: 4px solid #10b981;
          }
          @media print {
            body { 
              margin: 20px; 
              padding: 0;
            }
            .container {
              max-width: 100%;
            }
            .answer { 
              page-break-inside: avoid;
              margin: 15px 0;
            }
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="school-name">${testDetails.schoolName || 'ATSS Chinchwad'}</div>
            <div class="exam-title">Answer Key - ${subject}</div>
            <div class="topic">${testDetails.examType || 'Quiz'} - ${topic}</div>
          </div>
          
          <div class="exam-details">
            <div>
              <div class="detail-item"><span class="detail-label">Subject:</span> ${subject}</div>
              <div class="detail-item"><span class="detail-label">Topic:</span> ${topic}</div>
              <div class="detail-item"><span class="detail-label">Difficulty:</span> ${difficulty}</div>
            </div>
            <div>
              <div class="detail-item"><span class="detail-label">Exam Type:</span> ${testDetails.examType}</div>
              <div class="detail-item"><span class="detail-label">Date:</span> ${testDetails.date}</div>
              <div class="detail-item"><span class="detail-label">Total Questions:</span> ${answerKey.length}</div>
            </div>
          </div>

          <div class="answers-section">
            <div class="section-title">Correct Answers</div>
            ${answerKey.map((answer, index) => `
              <div class="answer">
                <div class="question-number">Question ${index + 1}</div>
                <div class="question-text">${answer.question}</div>
                <div class="correct-answer">Correct Answer: ${answer.answer}</div>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>Generated by Test Generator Pro | Answer Key</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Test Generator</h1>
          <p className="text-xl text-gray-600">Create customized test papers from your syllabus</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg ${
            error.includes('Demo data') 
              ? 'bg-yellow-50 border border-yellow-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              <svg className={`w-5 h-5 mr-2 ${
                error.includes('Demo data') ? 'text-yellow-600' : 'text-red-600'
              }`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className={error.includes('Demo data') ? 'text-yellow-700' : 'text-red-700'}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Configuration and Generated Paper Sections */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                    <input
                      type="number"
                      value={testDetails.duration}
                      onChange={(e) => handleTestDetailsChange('duration', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 2"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
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

              {/* Topic Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter topic (e.g., Algebra, World War II)"
                />
              </div>

              {/* Difficulty Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">Question Types *</label>
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

            {/* Generate Button */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
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

          {/* Right Column - Generated Test Paper */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Generated Test Paper</h2>
                <div className="flex space-x-3">
                  {answerKey.length > 0 && (
                    <button
                      onClick={() => exportToPDF('answer')}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Export Answer Key</span>
                    </button>
                  )}
                  {questions.length > 0 && (
                    <button
                      onClick={() => exportToPDF('test')}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center space-x-2 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Export Test Paper</span>
                    </button>
                  )}
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg mb-6">No questions generated yet</p>
                  <p className="text-gray-400">Configure settings and click "Generate Questions"</p>
                </div>
              ) : (
                <div ref={testPaperRef} className="space-y-6">
                  {/* Preview of the test paper */}
                  <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                    <div className="text-center mb-4">
                      <div className="text-xl font-bold text-gray-800">{testDetails.schoolName || 'ATSS Chinchwad'}</div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        {testDetails.examType || 'Quiz'} - {subject}
                      </h3>
                      <p className="text-gray-600">Topic: {topic}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div><strong>Subject:</strong> {subject}</div>
                        <div><strong>Topic:</strong> {topic}</div>
                        <div><strong>Difficulty:</strong> {difficulty}</div>
                        <div><strong>Exam Type:</strong> {testDetails.examType}</div>
                      </div>
                      <div>
                        <div><strong>Total Marks:</strong> {testDetails.totalMarks || questions.reduce((sum, q) => sum + q.marks, 0)}</div>
                        <div><strong>Duration:</strong> {testDetails.duration} hour{testDetails.duration !== '1' ? 's' : ''}</div>
                        <div><strong>Date:</strong> {testDetails.date}</div>
                      </div>
                    </div>
                  </div>

                  {/* Questions Preview */}
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
                        {q.options && (
                          <div className="mt-2 ml-4 space-y-1">
                            {q.options.map((option, optIndex) => (
                              <div key={optIndex} className="text-gray-600">{option}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Manage cookies or opt out</p>
        </div>
      </div>
      <FloatingChatbot />
    </div>
  );
};

export default TestPapersPage;