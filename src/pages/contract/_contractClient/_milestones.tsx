// this is for milestone contracts

import React, { useState } from 'react'
import { LuTrash } from "react-icons/lu";
import AddNewMilestoneModal from './_addMilestoneModal';

const Milestones = () => {

  const [showNewMilestoneModal, setShowNewMilestoneModal] = useState(false);

  const handleClose = () => {
    setShowNewMilestoneModal(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <section>
        <h2 className='font-semibold text-xl mb-7.5'>Milestone timeline</h2>
        
        <section className='flex items-start flex-col gap-5'>
          {
            Array(3).fill(null).map((_, index) => (
              <div key={index} className='flex flex-col items-start gap-2.5 w-full'>
                <div className='flex items-center justify-between w-full border-b border-b-lightblue pb-2.5'>
                    <h3 className='font-semibold'>Milestone 1</h3>
                    <button className='w-fit h-fit'>
                      <LuTrash size={20} />
                    </button>
                </div>
                <p className='text-sm'>Milestone 1 description goes here</p>
                <p>${'100'}</p>
                <p className='font-semibold text-sm'>Due {'12/14/2024'}</p>
              </div>
            ))
          }
        </section>
        <button 
        onClick={() => setShowNewMilestoneModal(true)}
          className='transition transform active:scale-95 hover:opacity-70  duration-300 ease-in-out cursor-pointer
bg-boldblue rounded-lg px-5 py-2.75 text-sm text-white font-semibold mt-5'
        >
            Add Milestone
        </button>

      </section>


      {showNewMilestoneModal && (
      <div 
        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'
        onClick={handleOverlayClick}
      >
          <AddNewMilestoneModal onClose={handleClose} />
      </div>
      )}

    </>
  )
}

export default Milestones