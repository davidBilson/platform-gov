import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/store/useAuth';
import { createRating, getContractRatings } from '@/api/rating-api';
import RatingModal from './ratingModal';
import RatingDisplay from './ratingdisplay';

interface RateUserBtnProps {
  contract: {
    _id: string;
    jobId?: {
      _id: string;
    };
    contractorId?: {
      _id: string;
      name: string;
    };
    clientId?: {
      _id: string;
      name: string;
    };
  };
  onRatingSubmitted?: () => void;
}

interface ExistingRating {
  _id: string;
  rating: number;
  comments?: string;
  reviewer: {
    _id: string;
    name: string;
  };
  reviewee: {
    _id: string;
    name: string;
  };
}

// Define the Rating type that comes from the API
interface Rating {
  _id?: string;
  rating: number;
  comments?: string;
  reviewer: string | {
    _id: string;
    name: string;
  };
  reviewee: string | {
    _id: string;
    name: string;
  };
}

const RateUserBtn: React.FC<RateUserBtnProps> = ({ 
  contract, 
  onRatingSubmitted 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingRating, setExistingRating] = useState<ExistingRating | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { userId, role } = useAuthStore();

  // Determine who the current user should rate
  const getRevieweeInfo = () => {
    if (role === 'client') {
      return {
        id: contract.contractorId?._id,
        name: contract.contractorId?.name || 'Contractor',
        role: 'contractor' as const
      };
    } else {
      return {
        id: contract.clientId?._id,
        name: contract.clientId?.name || 'Client',
        role: 'client' as const
      };
    }
  };

  const revieweeInfo = getRevieweeInfo();

  // Helper function to convert Rating to ExistingRating
  const convertRatingToExistingRating = (rating: Rating): ExistingRating | null => {
    if (!rating._id) {
      return null;
    }

    // Handle reviewer field (can be string or populated object)
    let reviewer: { _id: string; name: string };
    if (typeof rating.reviewer === 'string') {
      reviewer = { _id: rating.reviewer, name: 'Unknown' };
    } else {
      reviewer = rating.reviewer;
    }

    // Handle reviewee field (can be string or populated object)
    let reviewee: { _id: string; name: string };
    if (typeof rating.reviewee === 'string') {
      reviewee = { _id: rating.reviewee, name: 'Unknown' };
    } else {
      reviewee = rating.reviewee;
    }

    return {
      _id: rating._id,
      rating: rating.rating,
      comments: rating.comments,
      reviewer,
      reviewee
    };
  };

  // Check if user has already rated this contract
  useEffect(() => {
    const checkExistingRating = async () => {
      if (!contract._id || !userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ratings: Rating[] = await getContractRatings(contract._id);
        
        // Find rating by current user - handle both populated and non-populated cases
        const userRating = ratings.find((rating: Rating) => {
          const reviewerId = typeof rating.reviewer === 'string' 
            ? rating.reviewer 
            : rating.reviewer._id;
          return reviewerId === userId;
        });
        
        if (userRating) {
          const convertedRating = convertRatingToExistingRating(userRating);
          if (convertedRating) {
            setExistingRating(convertedRating);
          }
        }
      } catch (err) {
        if (err instanceof Error && err.message && !err.message.includes('404') && !err.message.includes('not found')) {
          toast.error('Failed to load rating information');
        }
        console.error('Error checking existing rating:', err);
      } finally {
        setLoading(false);
      }
    };

    checkExistingRating();
  }, [contract._id, userId]);

  const handleRatingSubmit = async (rating: number, comments: string) => {
    if (!revieweeInfo.id || !contract.jobId?._id || !userId) {
      toast.error('Missing required information to submit rating');
      return;
    }

    try {
      setIsSubmitting(true);

      const newRating = await createRating({
        contractId: contract._id,
        jobId: contract.jobId._id,
        reviewee: revieweeInfo.id,
        reviewer: userId,
        role: revieweeInfo.role,
        rating,
        comments
      });

      // Update local state with the new rating
      setExistingRating({
        _id: newRating._id || 'temp-id',
        rating,
        comments,
        reviewer: { _id: userId, name: 'You' },
        reviewee: { _id: revieweeInfo.id, name: revieweeInfo.name }
      });

      setIsModalOpen(false);
      toast.success('Rating submitted successfully!');
      onRatingSubmitted?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit rating';
      toast.error(errorMessage);
      console.error('Error submitting rating:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300"></div>
        Loading...
      </div>
    );
  }

  if (existingRating) {
    return (
        <RatingDisplay
          rating={existingRating.rating}
          comments={existingRating.comments}
          size="sm"
          showComments={!!existingRating.comments}
        />
    );
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className="bg-boldblue text-xs text-white font-semibold py-2.75 px-5 rounded-lg transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer"
      >
        Rate {revieweeInfo.role}
      </button>

      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRatingSubmit}
        revieweeName={revieweeInfo.name}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default RateUserBtn;