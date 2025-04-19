import React from 'react'
import { IoMdImages } from "react-icons/io";
import { MdStar, MdStarBorder } from "react-icons/md";

const Index = () => {
  return (
    <main className="p-6">
      <section className="w-full max-w-275 m-auto pb-32">

        {/* Bio */}
        <div className='flex items-start justify-between'>

          {/* Image and Name+Loc+Profession */}
          <div className='flex items-center gap-4'>
            {/* Image */}
            <div className="relative w-22 h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0">
              {/* {formData.profileImageUrl ? (
                <Image 
                src={formData.profileImageUrl} 
                  alt="Profile"
                  width={88}
                  height={88}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
              )} */}
              <IoMdImages size={40} className="text-white/70" />
            </div>
            {/* Name */}
            <div>
              <p className=''>John K.</p>
              <p>Web Developer</p>
              <p>Location</p>
            </div>
          </div>

          {/* Title Rating Skills Certification */}
          <div className='w-full max-w-85'>
            {/* Title & Rating */}
            <div className='flex items-center justify-between mb-6.25'>
              <h3 className="text-sm text-boldblue font-bold">Title</h3>
              <div className='flex items-center gap-1.25 '> 
                  <MdStar className='text-deepskyblue text-lg' />
                  <MdStar className='text-deepskyblue text-lg' />
                  <MdStarBorder className='text-deepskyblue text-lg' />
                  <MdStarBorder className='text-deepskyblue text-lg' />
                  <MdStarBorder className='text-deepskyblue text-lg' />
              </div>
            </div>
            {/* Skills & Certifications */}
            <div className='flex items-center flex-wrap gap-2'>
              <button className='rounded-4xl px-2.5 py-1.25 text-xs text-white font-semibold bg-deepskyblue' disabled>Skills</button>
              <button className='rounded-4xl px-2.5 py-1.25 text-xs text-white font-semibold bg-deepskyblue' disabled>Skills</button>
              <button className='rounded-4xl px-2.5 py-1.25 text-xs text-white font-semibold bg-deepskyblue' disabled>Skills</button>
              <button className='rounded-4xl px-2.5 py-1.25 text-xs text-white font-semibold bg-deepskyblue' disabled>Expertise</button>
              <button className='rounded-4xl px-2.5 py-1.25 text-xs text-white font-semibold bg-aquagreen' disabled>Certification</button>
              <button className='rounded-4xl px-2.5 py-1.25 text-xs text-white font-semibold bg-aquagreen' disabled>Certification</button>
            </div>
          </div>
        </div>

        {/* Description*/}
        <div className='py-5'>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo assumenda rem quam dolores aliquid! A dolorum debitis quaerat numquam nam quis accusantium nesciunt illo repellendus vero, laborum dolores, nostrum natus placeat dolore ab officia eveniet quo eius. Repellat sit doloremque exercitationem veniam perspiciatis culpa, praesentium tempora repudiandae enim atque ad libero nesciunt quo, expedita suscipit, est porro! Cum, quis eum?
          </p>
        </div>

        {/* Rate */}
        <p className='font-semibold mb-7.5'>Proposed Rate: ${"75"}</p>

        {/* Work History */}
        <div>
          <p className='font-semibold'>Work History</p>
        </div>


              {/* sticky bottom actions */}
        <section className="flex items-center justify-center gap-2.5 py-12.5 px-6 fixed bottom-0 left-0 bg-skyblue w-full border-t border-t-boldblue">
          <button 
            type="button"
            // onClick={handleCancel}
            className="py-3 px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Back
          </button>
          <button 
            type="button"
            // onClick={handleCancel}
            className="py-3 px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Short List
          </button>
          <button 
            type="button"
            // onClick={handlePreview}
            className="py-3 px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Message
          </button>
          <button 
            type="submit"
            // disabled={isLoading}
            className="py-3 px-5 bg-boldblue text-white text-sm font-semibold rounded-lg border border-boldblue"
          >
            {"Hire"}
          </button>
        </section>
      </section>
    </main>
  )
}

export default Index