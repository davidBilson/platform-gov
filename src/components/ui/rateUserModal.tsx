import RatingStars from '@/components/ui/rating';
import React from 'react'

interface ModalProps {
    onClose: () => void;
    userToRate: string;
  }

const RateUserModal: React.FC<ModalProps> = ({ onClose, userToRate }) => {

    const handleRating = () => {
        onClose()
    }

  return (
    <section className='bg-white p-7.5 w-full max-w-125 flex flex-col items-start gap-5'>
        <h2>Rate this {userToRate ?? "User"}</h2>
        {/* first rate the client with <RateUser />, then refetch the rating through an api call to set the number for Rating stars ui */}
        <RatingStars rating={0} />
        <fieldset className="border border-mediumgray px-5 py-3.75 w-full rounded-lg">
            <legend className="text-[10px] text-mediumgray outline-none border-none">Feedback</legend>
            <textarea placeholder="Feedback" className="w-full text-sm  min-h-[111px] outline-none border-none resize-none"></textarea>
        </fieldset>
        <button onClick={handleRating} className='bg-boldblue px-5 py-2.5 text-white font-semibold text-sm transition transform active:scale-95 hover:opacity-70  duration-300 ease-in-out cursor-pointer block mx-auto rounded-lg'>Submit</button>
    </section>
  )
}

export default RateUserModal