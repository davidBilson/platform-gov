// src/components/rating/RateFeedbackCard.tsx
import React from 'react';
import RatingStars from './ratingStars';
import useAuthStore from '@/store/useAuth';

interface RateFeedbackCardProps {
  rating: number;
  comment?: string;
  className?: string;
}

const RateFeedbackCard: React.FC<RateFeedbackCardProps> = ({
  rating,
  comment = 'No feedback provided',
}) => {

  const { role } = useAuthStore();

  return (

    <div className={`flex flex-col gap-2.5 bg-skyblue rounded-lg w-full max-w-86.25 p-5`}>
      <h3 className='font-bold text-[15px]'>Your Feedback To {role === 'contractor' ? 'Client' : 'Contractor'}</h3>
      <RatingStars rating={rating} />
      <p>{comment}</p>
    </div>

  );
};

export default RateFeedbackCard;