// src/components/rating/RatingStars.tsx
import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: number;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  interactive = false,
  size = 20,
  className = ''
}) => {
  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className={`flex ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          className={interactive ? 'cursor-pointer' : ''}
        >
          {star <= rating ? (
            <FaStar size={size} color="#FFD700" />
          ) : (
            <FaRegStar size={size} color="#FFD700" />
          )}
        </span>
      ))}
    </div>
  );
};

export default RatingStars;