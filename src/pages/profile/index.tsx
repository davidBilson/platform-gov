import React from 'react'
import { IoMdImages } from "react-icons/io";
import { MdStar, MdStarBorder } from "react-icons/md";

const Index = () => {
  return (
    <main className="p-4 md:p-6">
      <section className="w-full max-w-275 mx-auto pb-32">

        {/* Bio */}
        <div className='flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0'>

          {/* Image and Name+Loc+Profession */}
          <div className='flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto'>
            {/* Image */}
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0">
              <IoMdImages size={32} className="text-white/70" />
            </div>
            {/* Name */}
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <p className='font-medium'>John K.</p>
              <p>Web Developer</p>
              <p>Location</p>
            </div>
          </div>

          {/* Title Rating Skills Certification */}
          <div className='w-full sm:max-w-85 mt-4 sm:mt-0'>
            {/* Title & Rating */}
            <div className='flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6'>
              <h3 className="text-sm text-boldblue font-bold mb-2 sm:mb-0">Title</h3>
              <div className='flex items-center gap-1'> 
                  <MdStar className='text-deepskyblue text-lg' />
                  <MdStar className='text-deepskyblue text-lg' />
                  <MdStarBorder className='text-deepskyblue text-lg' />
                  <MdStarBorder className='text-deepskyblue text-lg' />
                  <MdStarBorder className='text-deepskyblue text-lg' />
              </div>
            </div>
            {/* Skills & Certifications */}
            <div className='flex items-center justify-center sm:justify-start flex-wrap gap-2'>
              <button className='rounded-full px-2 py-1 text-xs text-white font-semibold bg-deepskyblue' disabled>Skills</button>
              <button className='rounded-full px-2 py-1 text-xs text-white font-semibold bg-deepskyblue' disabled>Skills</button>
              <button className='rounded-full px-2 py-1 text-xs text-white font-semibold bg-deepskyblue' disabled>Skills</button>
              <button className='rounded-full px-2 py-1 text-xs text-white font-semibold bg-deepskyblue' disabled>Expertise</button>
              <button className='rounded-full px-2 py-1 text-xs text-white font-semibold bg-aquagreen' disabled>Certification</button>
              <button className='rounded-full px-2 py-1 text-xs text-white font-semibold bg-aquagreen' disabled>Certification</button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className='py-5'>
          <p className="text-sm sm:text-base">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo assumenda rem quam dolores aliquid! A dolorum debitis quaerat numquam nam quis accusantium nesciunt illo repellendus vero, laborum dolores, nostrum natus placeat dolore ab officia eveniet quo eius. Repellat sit doloremque exercitationem veniam perspiciatis culpa, praesentium tempora repudiandae enim atque ad libero nesciunt quo, expedita suscipit, est porro! Cum, quis eum?
          </p>
        </div>

        {/* Rate */}
        <p className='font-semibold mb-6'>Proposed Rate: ${"75"}</p>

        {/* Work History */}
        <div>
          <p className='font-semibold'>Work History</p>
        </div>

        {/* sticky bottom actions */}
        <section className="flex flex-wrap items-center justify-center gap-2 py-4 sm:py-6 px-4 sm:px-6 fixed bottom-0 left-0 bg-skyblue w-full border-t border-t-boldblue">
          <button 
            type="button"
            className="w-full sm:w-auto py-2 sm:py-3 px-3 sm:px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Back
          </button>
          <button 
            type="button"
            className="w-full sm:w-auto py-2 sm:py-3 px-3 sm:px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Short List
          </button>
          <button 
            type="button"
            className="w-full sm:w-auto py-2 sm:py-3 px-3 sm:px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Message
          </button>
          <button 
            type="submit"
            className="w-full sm:w-auto py-2 sm:py-3 px-3 sm:px-5 bg-boldblue text-white text-sm font-semibold rounded-lg border border-boldblue"
          >
            {"Hire"}
          </button>
        </section>
      </section>
    </main>
  )
}

export default Index