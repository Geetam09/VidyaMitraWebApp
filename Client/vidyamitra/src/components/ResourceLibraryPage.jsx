import { useState, useEffect } from 'react';

const ResourceLibraryPage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [resources, setResources] = useState([]);
  const [featuredResources, setFeaturedResources] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedType, setSelectedType] = useState('All Types');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade: '',
    type: '',
    subject: '',
    file: null
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const featured = [
      {
        id: 1,
        title: 'Fractions Made Easy',
        grade: 'Grade 4',
        subject: 'Mathematics',
        downloads: 245,
        color: 'from-blue-500 to-violet-500',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Example YouTube embed URL
      },
      {
        id: 2,
        title: 'Plant Life Cycle',
        grade: 'Grade 3',
        subject: 'Science',
        downloads: 189,
        color: 'from-violet-500 to-blue-500',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: 3,
        title: 'English Grammar Worksheets',
        grade: 'Grade 5',
        subject: 'English',
        downloads: 312,
        color: 'from-blue-600 to-violet-600',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: 4,
        title: 'Indian History Timeline',
        grade: 'Grade 6',
        subject: 'Social Studies',
        downloads: 156,
        color: 'from-violet-600 to-blue-600',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ];

    const allResources = [
      {
        id: 1,
        title: 'Addition and Subtraction Practice',
        type: 'Worksheet',
        description: 'Comprehensive worksheets covering basic arithmetic operations with step-by-step examples.',
        grade: 'Grade 2',
        subject: 'Mathematics',
        uploadedBy: 'Priya Sharma',
        date: '1/28/2023',
        downloads: 150
      },
      {
        id: 2,
        title: 'Water Cycle Experiment Guide',
        type: 'Lesson Plan',
        description: 'Hands-on experiments to teach students about evaporation, condensation, and precipitation.',
        grade: 'Grade 4',
        subject: 'Science',
        uploadedBy: 'Rajesh Kumar',
        date: '1/27/2023',
        downloads: 203
      },
      {
        id: 3,
        title: 'Storytelling Activities',
        type: 'Activity',
        description: 'Creative writing prompts and storytelling exercises to improve language skills.',
        grade: 'Grade 3',
        subject: 'English',
        uploadedBy: 'Meera Patel',
        date: '1/28/2023',
        downloads: 169
      }
    ];

    setFeaturedResources(featured);
    setResources(allResources);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (featuredResources.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredResources.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [featuredResources.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setShowUploadModal(false);
    setFormData({
      title: '',
      description: '',
      grade: '',
      type: '',
      subject: '',
      file: null
    });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredResources.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredResources.length) % featuredResources.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const filters = [
    { label: 'All Grades', value: 'All Grades' },
    { label: 'Grade 1', value: 'Grade 1' },
    { label: 'Grade 2', value: 'Grade 2' },
    { label: 'Grade 3', value: 'Grade 3' },
    { label: 'Grade 4', value: 'Grade 4' },
    { label: 'Grade 5', value: 'Grade 5' },
    { label: 'Grade 6', value: 'Grade 6' }
  ];

  const subjects = [
    { label: 'All Subjects', value: 'All Subjects' },
    { label: 'Mathematics', value: 'Mathematics' },
    { label: 'Science', value: 'Science' },
    { label: 'English', value: 'English' },
    { label: 'Social Studies', value: 'Social Studies' }
  ];

  const types = [
    { label: 'All Types', value: 'All Types' },
    { label: 'Worksheet', value: 'Worksheet' },
    { label: 'Lesson Plan', value: 'Lesson Plan' },
    { label: 'Activity', value: 'Activity' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 p-6">
      {/* Floating Create Resource Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-violet-700 transform hover:scale-110 transition-all duration-300 flex items-center space-x-2 font-semibold"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Create Resource</span>
      </button>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Upload New Resource
                </h2>
                <p className="text-gray-600 mt-2">
                  Share educational materials with the community
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Resource Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter resource title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the resource"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    required
                  />
                </div>

                {/* Grade and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Grade
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                      required
                    >
                      <option value="">Select grade</option>
                      {filters.slice(1).map((filter) => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Resource Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    >
                      <option value="">Select type</option>
                      {types.slice(1).map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Select subject</option>
                    {subjects.slice(1).map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-all duration-300">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-lg font-medium text-gray-600 mb-2">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PDF, DOC, PPT, MP4, MP3 files up to 50MB
                      </p>
                    </label>
                  </div>
                  {formData.file && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected file: {formData.file.name}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:from-blue-700 hover:to-violet-700 transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    Upload Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Resource Library
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find, share, and manage lesson plans, worksheets, and educational materials
          </p>
        </div>

        {/* Featured Resources Carousel */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full mr-3"></span>
            Featured Resources
          </h2>
          
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Carousel Container */}
            <div className="relative h-96">
              {featuredResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                    index === currentSlide ? 'translate-x-0' : 
                    index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                  }`}
                >
                  <div className="flex h-full">
                    {/* Video/Content Section */}
                    <div className="flex-1 p-8">
                      <div className="h-full flex flex-col justify-center">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">
                          {resource.title}
                        </h3>
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                            {resource.grade}
                          </span>
                          <span className="bg-violet-100 text-violet-600 px-3 py-1 rounded-full font-medium">
                            {resource.subject}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-6">
                          Engaging educational content with interactive elements and comprehensive coverage.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-700">
                            {resource.downloads} Downloads
                          </span>
                          <button className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-violet-600 transform hover:scale-105 transition-all duration-300">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Video Embed Section */}
                    <div className="flex-1 bg-gray-100">
                      <div className="h-full flex items-center justify-center p-4">
                        <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                          <iframe
                            src={resource.videoUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={resource.title}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredResources.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Rest of the existing code for search and all resources */}
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Search for resources by title or topic..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <select
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                {filters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              
              <select
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
              
              <select
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* All Resources */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full mr-3"></span>
              All Resources
            </h2>
            <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {resources.length} resources found
            </span>
          </div>

          <div className="space-y-6">
            {resources.map((resource, index) => (
              <div
                key={resource.id}
                className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 hover:scale-102 hover:shadow-xl border-l-4 border-blue-500"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          {resource.title}
                        </h3>
                        <span className="inline-block bg-gradient-to-r from-blue-500 to-violet-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {resource.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {resource.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                          {resource.grade}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-violet-100 text-violet-600 px-3 py-1 rounded-full">
                          {resource.subject}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span>Uploaded by {resource.uploadedBy}</span>
                      </div>
                      <div className="flex items-center">
                        <span>{resource.date}</span>
                      </div>
                      <div className="flex items-center">
                        <span>{resource.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 lg:mt-0 lg:ml-6">
                    <button className="px-6 py-3 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 font-medium">
                      View Details
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 transform hover:scale-105 transition-all duration-300 font-medium">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResourceLibraryPage;