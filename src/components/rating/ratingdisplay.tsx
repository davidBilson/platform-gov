// RatingDisplay.tsx
import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa6';

interface RatingDisplayProps {
  rating: number;
  comments?: string;
  reviewerName?: string;
  showReviewerName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showComments?: boolean;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  comments,
  size = 'md',
  showComments = true
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          star: 14,
          text: 'text-sm',
          container: 'gap-2'
        };
      case 'lg':
        return {
          star: 20,
          text: 'text-lg',
          container: 'gap-3'
        };
      default:
        return {
          star: 16,
          text: 'text-base',
          container: 'gap-2'
        };
    }
  };

  const classes = getSizeClasses();

  return (
    <>
      {
        showComments && comments ? (
          <div className="flex flex-col gap-2.5 bg-skyblue rounded-lg w-full max-w-75 p-5">
            <h3 className='font-bold text-[15px]'>Your Feedback</h3>
              
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                star <= rating ? (
                  <FaStar
                    key={star}
                    size={classes.star}
                    className="text-deepskyblue"
                  />
                ) : (
                  <FaRegStar
                    key={star}
                    size={classes.star}
                    className="text-deepskyblue"
                  />
                )
              ))}
            </div>
          
            <p className='text-sm'>{comments}</p>
          </div>
        ) : (
          <div className={`${classes.container} ${showComments && comments ? 'space-y-3' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  star <= rating ? (
                    <FaStar
                      key={star}
                      size={classes.star}
                      className="text-deepskyblue"
                    />
                  ) : (
                    <FaRegStar
                      key={star}
                      size={classes.star}
                      className="text-deepskyblue"
                    />
                  )
                ))}
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default RatingDisplay;