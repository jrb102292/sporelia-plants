import React, { useState } from 'react';
import { Comment } from '../../types';

interface CommentBoxProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  className?: string;
}

const CommentBox: React.FC<CommentBoxProps> = ({ comments, onAddComment, className = '' }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Comments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-text-muted text-sm italic">No care notes yet. Add your first observation!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-cream-pulp p-3 rounded-md border border-lichen-veil">
              <p className="text-sm text-canopy-green mb-1">{comment.text}</p>
              <div className="text-xs text-text-muted">
                {comment.authorName} • {formatDate(comment.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a care note (watering, fertilizing, observations, etc.)"
          className="w-full px-3 py-2 border border-lichen-veil bg-cream-pulp text-canopy-green rounded-md text-sm focus:outline-none focus:border-sage-mist focus:ring-1 focus:ring-sage-mist resize-none"
          rows={2}
          maxLength={500}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-text-muted">
            {newComment.length}/500 characters
          </span>
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="bg-canopy-green text-cream-pulp px-4 py-1.5 rounded-md text-sm font-medium hover:bg-opacity-90 disabled:bg-lichen-veil disabled:text-text-muted transition-colors"
          >
            Add Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentBox;
