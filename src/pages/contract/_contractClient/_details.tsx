import Link from 'next/link';
import React, { useState } from 'react';
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
import RateUserModal from '@/components/ui/rateUserModal';
import RatingStars from '@/components/ui/rating';

const Details = () => {

  const [showRateUserModal, setShowRateUserModal] = useState(false);

  const handleClose = () => {
    setShowRateUserModal(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
    <section className='w-full m-auto pb-10'>
      
      <div className="pt-7.5">

        <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 mb-3.75">
          <p className='text-xs font-semibold text-boldblue'><strong>Contract Start:</strong> 12/12/2025 {" | "}</p>
          <p className='text-xs font-semibold text-boldblue'><strong>Contract Renewed:</strong> 12/12/2025 {" | "}</p>
          <p className='text-xs font-semibold text-boldblue'><strong>Contract End:</strong> 12/12/2025 {" | "}</p>
        </div>
        
        <h1 className="text-xl font-bold mb-3.75">Job Title</h1>
        
        <div className="flex flex-wrap items-center gap-10 mb-4 text-sm font-semibold">
          <div className="flex items-center gap-1.25">
            <FaRegHourglass size={15} />
            [paymentInfo] | [employmentType]
          </div>
          
          <div className="flex items-center gap-1.25">
            <FaLocationDot size={15} />
            [location]
          </div>
        </div>

      </div>
      
      {/* Description section */}
      <div className="pb-7.5 border-b border-b-deepskyblue pb-">
        <p className="text-black whitespace-pre-line">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet unde consequatur eum officia ullam iure maxime maiores quae explicabo ducimus voluptates minima error, doloremque, alias saepe consectetur dolorum aspernatur, totam ad illo corporis! Iste sed iusto, illum sunt, ullam provident nulla eaque dolorum atque ratione consequuntur eveniet reprehenderit? Numquam, similique.</p>
        <div className='flex items-center gap-2.5 mt-3.25'>
          <span className='px-2.5 py-1.25 text-xs text-boldblue font-semibold border border-boldblue rounded-full'>Category</span>
          <span className='px-2.5 py-1.25 text-xs text-boldblue font-semibold border border-boldblue rounded-full'>Category</span>
        </div>
      </div>
      
      {/* Skills and Certifications section */}
      <div className="py-7.5 border-b border-b-deepskyblue">
        
        
        <div className="mb-3.75">
          <h3 className="font-semibold mb-3.75">Required Certifications</h3>
          <div className="flex flex-wrap gap-3">
            <span className="bg-aquagreen text-white text-xs rounded-full px-3 py-1">
              [certification]
            </span>
          </div>
        </div>

        <div className="mb-3.75">
          <h3 className="font-semibold mb-3.75">Required Skills</h3>
          <div className="flex flex-wrap gap-3">
            <span className="bg-deepskyblue text-white text-xs rounded-full px-3 py-1">
              [skill]
            </span>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3.75">Security Clearance</h3>
          <div className="flex flex-wrap gap-3">
            <span className="text-boldblue border border-boldblue font-semibold text-xs rounded-full px-3 py-1">
              Top Secret
            </span>
          </div>
        </div>
      </div>
      
      {/* Client Information */}
      <div className="py-7.5 border-b border-b-deepskyblue">
        <h2 className="font-semibold mb-3.75">Client Information</h2>
        
        <article className='flex flex-wrap justify-between items-start gap-5'>
          <section>
            <div className="flex items-center gap-5 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                [clientLogo]
              </div>
              <Link href="" className="cursor-pointer hover:underline font-medium">[clientName]</Link>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-gray-500 text-sm">Industry</p>
                <p className="font-medium">[clientIndustry]</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Specializations</p>
                <p className="font-medium">[clientSpecializations]</p>
              </div>
            </div>

          </section>

          {/* <button 
            onClick={() => setShowRateUserModal(true)} 
            className="bg-deepskyblue  text-sm text-white font-semibold py-3 px-10 rounded-full transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer">
            Rate this client
          </button> */}
          {/* if rating exists - show this otherwise show the button above */}
          <div className='flex flex-col gap-2.5 bg-skyblue rounded-lg w-full max-w-86.25 p-5'>
            <h3 className='font-bold text-[15px]'>Your Feedback To Contractor</h3>
            <RatingStars rating={4} />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque repellat sequi dolor nesciunt omnis ad.</p>
          </div>
        </article>
      </div>

    </section>
    {showRateUserModal && (
      <div 
        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out'
        onClick={handleOverlayClick}
      >
          <RateUserModal userToRate='Contractor' onClose={handleClose} />
      </div>
    )}
    </>
  )
}

export default Details;