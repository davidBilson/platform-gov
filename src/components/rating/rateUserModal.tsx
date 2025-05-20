// src/components/rating/RateUserModal.tsx
import React, { useState } from 'react';
import RatingStars from './ratingStars';
import { createRating, updateRating } from '@/api/rating-api';

interface ModalProps {
  onClose: () => void;
  userToRate: string;
  contractId: string;
  jobId: string;
  reviewerId: string;
  revieweeId: string;
  role: 'client' | 'contractor';
  existingRating?: {
    id?: string;
    rating?: number;
    comments?: string;
  };
}

const RateUserModal: React.FC<ModalProps> = ({
  onClose,
  userToRate,
  contractId,
  jobId,
  reviewerId,
  revieweeId,
  role,
  existingRating
}) => {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [comments, setComments] = useState(existingRating?.comments || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (existingRating?.id) {
        // Update existing rating
        await updateRating({
          id: existingRating.id,
          rating,
          comments,
          userId: reviewerId
        });
      } else {
        // Create new rating
        await createRating({
          contractId,
          jobId,
          reviewer: reviewerId,
          reviewee: revieweeId,
          role,
          rating,
          comments
        });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='bg-white p-7.5 w-full max-w-125 flex flex-col items-start gap-5'>
      <h2>Rate this {userToRate}</h2>
      <RatingStars 
        rating={rating} 
        onRatingChange={handleRatingChange}
        interactive={true}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <fieldset className="border border-mediumgray px-5 py-3.75 w-full rounded-lg">
        <legend className="text-[10px] text-mediumgray outline-none border-none">Feedback</legend>
        <textarea
          placeholder="Feedback"
          className="w-full text-sm min-h-[111px] outline-none border-none resize-none"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </fieldset>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className='bg-boldblue px-5 py-2.5 text-white font-semibold text-sm transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer block mx-auto rounded-lg disabled:opacity-50'
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </section>
  );
};

export default RateUserModal;