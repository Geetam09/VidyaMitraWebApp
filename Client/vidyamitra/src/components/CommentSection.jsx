// components/CommentSection.js
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { apiService } from '../services/apiService';

const CommentSection = ({ postId, currentTeacherId, token, onCommentsUpdated }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const comments = await apiService.getCommentsByPostId(postId, token);
      setComments(comments);
      // Notify parent component about comment count change
      if (typeof onCommentsUpdated === 'function') {
        onCommentsUpdated(comments.length);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load comments when component mounts
  useEffect(() => {
    loadComments();
  }, [postId, token]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token || token.split('.').length !== 3) {
      alert('Your session has expired. Please login again.');
      window.location.href = '/login';
      return;
    }

    if (!postId || !currentTeacherId) {
      alert('Missing required information. Please refresh the page.');
      return;
    }

    const payload = {
      postId: Number(postId),
      authorId: Number(currentTeacherId),
      content: newComment.trim()
    };

    setIsSubmitting(true);
    try {
      await apiService.addComment(payload, token);
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
      if (error.message.includes('JWT validation failed')) {
        alert('Your session has expired. Please login again.');
        window.location.href = '/login';
      } else {
        alert('Failed to add comment: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await apiService.deleteComment(commentId, token);
      await loadComments(); // Wait for reload to complete
    } catch (error) {
      alert('Failed to delete comment: ' + error.message);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Enhanced Comment Input Area */}
      <div className="flex flex-col gap-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows="2"
          className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-xl 
                     focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none 
                     resize-none transition-all duration-200"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddComment}
            disabled={isSubmitting || !newComment.trim()}
            className={`
              px-6 py-2 rounded-xl font-medium text-sm
              transition-all duration-200 transform
              ${isSubmitting || !newComment.trim() 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-md active:scale-95'
              }
            `}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>

      {/* Comments List with Enhanced Styling */}
      <div className="space-y-3 mt-4">
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 
                              flex items-center justify-center text-white font-semibold text-sm">
                  {comment.teacherName?.charAt(0) || 'T'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {comment.teacherName || 'Teacher'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
              
              {Number(comment.authorId) === Number(currentTeacherId) && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 
                           hover:text-red-500 transition-all duration-200"
                  disabled={isSubmitting}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {comments.length === 0 && !isLoading && (
          <div className="text-center py-6 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
        
        {isLoading && (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
