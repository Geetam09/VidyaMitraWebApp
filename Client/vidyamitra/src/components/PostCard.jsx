// components/PostCard.js
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Trash2, ImageOff } from 'lucide-react';
import { apiService } from '../services/apiService';
import CommentSection from './CommentSection';

const PostCard = ({ post, currentTeacherId, token, onPostDeleted }) => {
  // Initialize isLiked based on totalLikes
  const [isLiked, setIsLiked] = useState(post.totalLikes > 0);
  const [likeCount, setLikeCount] = useState(post.totalLikes || 0);
  const [commentCount, setCommentCount] = useState(post.totalComments || 0);
  const [showComments, setShowComments] = useState(false);
  const [teacherName, setTeacherName] = useState(post.authorName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isCountUpdating, setIsCountUpdating] = useState(false);

  // Fetch initial like status and teacher name
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch like status to confirm if this user has liked
        const likeStatus = await apiService.getLikeStatus(post.id, currentTeacherId, token);
        setIsLiked(likeStatus);
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        if (err.message.includes('JWT validation failed')) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };

    fetchInitialData();
  }, [post.id, currentTeacherId, token]);

  // Update counts after like/unlike
  const refreshCounts = async () => {
    setIsCountUpdating(true);
    try {
      const [updatedPost] = await Promise.all([
        apiService.getPostById(post.id, token)
      ]);
      
      // Update counts from fresh post data
      setLikeCount(updatedPost.totalLikes || 0);
      setCommentCount(updatedPost.totalComments || 0);
    } catch (err) {
      console.warn('refreshCounts failed:', err);
    } finally {
      setIsCountUpdating(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!currentTeacherId || !token) {
      alert('Please login to like posts.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedIsLiked = !isLiked;
      if (updatedIsLiked) {
        await apiService.likePost({
          postId: Number(post.id),
          TeacherId: Number(currentTeacherId)
        }, token);
        // Optimistic update
        setLikeCount(prev => prev + 1);
      } else {
        await apiService.unlikePost(Number(post.id), Number(currentTeacherId), token);
        // Optimistic update
        setLikeCount(prev => Math.max(0, prev - 1));
      }
      
      setIsLiked(updatedIsLiked);
      // Refresh actual counts from server
      await refreshCounts();
    } catch (err) {
      console.error('Failed to toggle like:', err);
      if (err.message.includes('JWT validation failed')) {
        alert('Your session has expired. Please login again.');
        window.location.href = '/login';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image loading handler
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Image error handler
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 
                          flex items-center justify-center text-white font-semibold text-lg">
            {post.authorName?.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{post.authorName}</h3>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        {post.authorId === currentTeacherId && (
          <button
            onClick={() => onPostDeleted(post.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Content with improved image handling */}
      <div className="px-6 py-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        
        {post.imageUrl && (
          <div className="relative mt-4">
            {/* Loading skeleton */}
            {imageLoading && (
              <div className="animate-pulse bg-gray-200 rounded-lg w-full h-64"></div>
            )}
            
            {/* Error state */}
            {imageError && (
              <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg w-full h-64 text-gray-400">
                <ImageOff size={32} />
                <p className="mt-2 text-sm">Failed to load image</p>
              </div>
            )}
            
            {/* Actual image */}
            <img 
              src={post.imageUrl}
              alt="Post attachment"
              className={`rounded-lg max-h-96 w-full object-cover transition-opacity duration-300 ${
                imageLoading || imageError ? 'hidden' : 'block'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        )}
      </div>

      {/* Actions with Like Count */}
      <div className="px-6 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLikeToggle}
              className="group flex items-center space-x-2 relative"
              disabled={isSubmitting}
            >
              <div className="relative">
                <Heart
                  size={22}
                  fill={post.totalLikes > 0 ? "currentColor" : "none"}  // Change this line
                  className={`
                    transform transition-all duration-300 ease-out
                    ${post.totalLikes > 0 ? 'scale-110 text-red-500' : 'text-gray-400 group-hover:text-red-500'}
                    ${isSubmitting ? 'opacity-50' : ''}
                  `}
                />
                <span className={`
                  absolute -top-3 -right-3 min-w-[20px] h-5 flex items-center justify-center
                  text-xs font-semibold rounded-full px-1.5
                  transform transition-all duration-300
                  ${post.totalLikes > 0 ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-600'}
                  ${isCountUpdating ? 'scale-110' : 'scale-100'}
                `}>
                  {likeCount || '0'}
                </span>
              </div>
              <span className={`
                text-sm font-medium transition-colors duration-300
                ${isLiked ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}
              `}>
                {isLiked ? 'Liked' : 'Like'}
              </span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="group flex items-center space-x-2 relative"
            >
              <div className="relative">
                <MessageCircle
                  size={22}
                  className={`
                    transform transition-all duration-300
                    ${showComments ? 'text-blue-500 scale-110' : 'text-gray-400 group-hover:text-blue-500'}
                  `}
                />
                <span className={`
                  absolute -top-3 -right-3 min-w-[20px] h-5 flex items-center justify-center
                  text-xs font-semibold rounded-full px-1.5
                  transform transition-all duration-300
                  ${showComments ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-600'}
                  ${isCountUpdating ? 'scale-110' : 'scale-100'}
                `}>
                  {commentCount || '0'}
                </span>
              </div>
              <span className={`
                text-sm font-medium transition-colors duration-300
                ${showComments ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-500'}
              `}>
                Comments
              </span>
            </button>

            <button className="group flex items-center space-x-2">
              <Share2 
                size={22} 
                className="text-gray-400 group-hover:text-green-500 transform transition-all duration-300"
              />
              <span className="text-sm font-medium text-gray-500 group-hover:text-green-500 transition-colors duration-300">
                Share
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="transform transition-opacity duration-300">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100">
          <CommentSection
            postId={post.id}
            currentTeacherId={currentTeacherId}
            token={token}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;

const token = localStorage.getItem("token");
console.log("Current Token:", token); // Check the token format