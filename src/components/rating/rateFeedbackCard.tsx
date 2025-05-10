import React from 'react'
import RatingStars from './rating'

const RateFeedbackCard = () => {
  return (
    <div className='flex flex-col gap-2.5 bg-skyblue rounded-lg w-full max-w-86.25 p-5'>
        <h3 className='font-bold text-[15px]'>Your Feedback To Contractor</h3>
        <RatingStars rating={4} />
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque repellat sequi dolor nesciunt omnis ad.</p>
    </div>
  )
}

export default RateFeedbackCard