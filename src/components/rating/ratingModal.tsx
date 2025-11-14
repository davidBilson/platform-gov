import React, { useState } from 'react';
import { BiLike, BiSolidLike } from 'react-icons/bi';
import {  FaTimes } from 'react-icons/fa';
// import { FaStar, FaRegStar } from 'react-icons/fa6';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comments: string) => void;
  revieweeName: string;
  isSubmitting?: boolean;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  revieweeName,
  isSubmitting = false
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comments, setComments] = useState<string>('');

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (rating === 0) return;
    
    onSubmit(rating, comments);
    
    // Reset form
    setRating(0);
    setHoverRating(0);
    setComments('');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRating(0);
    setHoverRating(0);
    setComments('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg relative p-7.5 w-full max-w-125"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400  cursor-pointer hover:opacity-70 transition duration-300 ease-in-out"
          disabled={isSubmitting}
        >
          <FaTimes size={20} />
        </button>

        <div className="mb-6">
          <h2>
            Recommendations {revieweeName.replace(/\b\w/g,c=>c.toUpperCase())}
          </h2>
          <p className="text-sm text-gray-600">
            How likely are you to recommend {revieweeName}?
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 transition-colors cursor-pointer"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={(e) => {
                  e.stopPropagation();
                  setRating(star);
                }}
                disabled={isSubmitting}
              >
                {star <= (hoverRating || rating) ? (
                  <BiSolidLike
                    size={20}
                    className="text-deepskyblue"
                  />
                ) : (
                  <BiLike
                    size={20}
                    className="text-deepskyblue"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-mediumgray mb-2">
            Comments
          </label>
          <fieldset className="border border-boldblue px-5 py-3.75 w-full rounded-lg">
            <legend className="text-[10px] text-mediumgray outline-none border-none">Feedback</legend>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Share your experience working with this person..."
              className="w-full text-sm min-h-[111px] outline-none border-none resize-none"
              rows={4}
              maxLength={500}
              disabled={isSubmitting}
            />
          </fieldset>
          <p className="text-xs text-gray-500 mt-1">
            {comments.length}/500 characters
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors hover:opacity-70 duration-300 ease-in-out cursor-pointer text-sm"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1 px-4 py-2 bg-boldblue text-white rounded-lg disabled:bg-lightgray disabled:cursor-not-allowed transition-colors hover:opacity-70 duration-300 ease-in-out cursor-pointer text-sm"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Recommendations'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;