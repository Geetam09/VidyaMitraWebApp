import React, { useState } from 'react';

const CommunityPage = () => {
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'All Posts', count: 48 },
    { name: 'Teaching Tips', count: 15 },
    { name: 'Resources', count: 12 },
    { name: 'Classroom Management', count: 8 },
    { name: 'Technology', count: 7 },
    { name: 'Rural Education', count: 6 }
  ];

  const activeMembers = [
    { initials: 'P5', name: 'Main Teacher' },
    { initials: 'RK', name: 'Science Teacher' },
    { initials: 'SD', name: 'Primary Teacher' },
    { initials: 'AG', name: 'Tech Coordinator' },
    { initials: 'M', name: 'Media Teacher' }
  ];

  const discussions = [
    {
      id: 1,
      author: 'Priya Sharma',
      role: 'Mathematics Teacher',
      time: '2 hours ago',
      title: 'Effective Math Teaching Strategies for Rural Students',
      content: "I've been experimenting with visual learning methods for teaching fractions to Grade 7 students. Using local examples like dividing farmland has made concepts much clearer...",
      tags: ['mathematics', 'visual-learning', 'grade-7'],
      likes: 12,
      stars: 8
    },
    {
      id: 2,
      author: 'Raj Kumar',
      role: 'Science Teacher',
      time: '4 hours ago',
      title: 'Free Science Experiment Resources for Limited Budgets',
      content: "Sharing a collection of science experiments that can be done with household items. Perfect for schools with limited lab equipment...",
      tags: ['science', 'experiments', 'low-cost'],
      likes: 18,
      stars: 15
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Teacher Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect, share resources, and learn from fellow educators
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-blue-600">147</h3>
            <p className="text-gray-600 text-sm">Total Members</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-violet-600">23</h3>
            <p className="text-gray-600 text-sm">Active Discussions</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-blue-600">89</h3>
            <p className="text-gray-600 text-sm">Shared Resources</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-violet-600">12</h3>
            <p className="text-gray-600 text-sm">Online Now</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-50 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`w-full flex justify-between items-center p-3 rounded-xl transition-all duration-300 transform hover:scale-102 ${
                      activeCategory === category.name
                        ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      activeCategory === category.name
                        ? 'bg-white text-blue-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-50 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Office</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Q. Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Active Members */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-50 transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Active Members</h2>
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">Online</span>
              </div>
              <div className="space-y-4">
                {activeMembers.map((member, index) => (
                  <div
                    key={member.initials}
                    className="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-blue-50 transform hover:scale-102"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.initials}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl transform hover:scale-102"
              >
                {/* Author Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {discussion.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{discussion.author}</h3>
                    <p className="text-sm text-gray-500">{discussion.role} • {discussion.time}</p>
                  </div>
                </div>

                {/* Discussion Content */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">{discussion.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{discussion.content}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {discussion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-200 hover:scale-105"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 group">
                      <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      </div>
                      <span>{discussion.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-violet-600 transition-colors duration-300 group">
                      <div className="p-2 rounded-full group-hover:bg-violet-50 transition-colors duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <span>{discussion.stars}</span>
                    </button>
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    Share
                  </button>
                </div>
              </div>
            ))}

            {/* View Discussion Button */}
            <div className="text-center">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold border border-blue-200 transition-all duration-300 transform hover:scale-105 hover:bg-blue-50 hover:shadow-lg">
                View Discussion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;