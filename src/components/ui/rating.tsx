import React from 'react'
import { MdStar, MdStarBorder } from 'react-icons/md'

interface Rating {
  rating: number;
  maxRating?: number;
}

const RatingStars : React.FC<Rating> = ({ rating, maxRating }) => {
  return (
    <div className="flex items-center">
        {Array.from({ length: maxRating ?? 5 }).map((_, i) => (
          i < rating ? 
            <MdStar key={i} className="text-deepskyblue text-lg" /> : 
            <MdStarBorder key={i} className="text-deepskyblue text-lg" />
        ))}
      </div>
  )
}

export default RatingStars