// pages/CommunityPage.js
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { apiService } from '../services/apiService';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Get teacherId and token from localStorage
  const [currentTeacherId] = useState(() => localStorage.getItem('teacherId'));
  const [token] = useState(() => localStorage.getItem('token'));

  // Add token validation
  useEffect(() => {
    const validateAuth = () => {
      if (!token || !currentTeacherId) {
        alert('Please login to view the community page');
        // Redirect to login page if needed
        window.location.href = '/login';
        return false;
      }
      return true;
    };

    if (!validateAuth()) return;
    loadPosts();
  }, [token, currentTeacherId]);

  const loadPosts = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await apiService.getAllPosts(token);
      setPosts(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      if (error.message.includes('JWT validation failed')) {
        // Handle invalid token
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50">
      <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Teacher Community
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Create Post
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No posts yet</h2>
            <p className="text-gray-600 mb-6">Be the first to share something with the community!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg"
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentTeacherId={currentTeacherId}
                token={token}
                onPostDeleted={loadPosts}
              />
            ))}
          </div>
        )}
      </main>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={loadPosts}
        currentTeacherId={currentTeacherId}
        token={token}
      />
    </div>
  );
};

export default CommunityPage;