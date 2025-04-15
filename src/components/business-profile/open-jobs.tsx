import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { FaRegHourglass } from "react-icons/fa6";

const OpenJobs = () => {
  return (
    <main className='p-6'>
        <section className='w-full max-w-[1100px] m-auto'>

            <article className='mb-8 pb-10 border-b border-b-[#ccc]'>
                <h2 className='font-semibold text-xl mb-[15px]'>Open Jobs</h2>

                <div>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2'>
                        {/* date and time job was posted */}
                        <p className="text-[12px] text-[#808080]">Posted {"10/3/2024"} {"12:34 PM"}</p>

                        {/* number of proposals */}
                        <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold w-[114px] h-[30px] rounded-full'>23 Proposals</button>
                    </div>

                    <p className='text-sm mb-[15px] font-semibold'>Job Category</p>
                    <h3 className='font-semibold text-xl mb-[15px]'> Frontend Developer {"(React/Next.js)"} – Remote</h3>

                    <div className='mb-[15px] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 text-sm'>
                        <div className='flex items-center gap-2'>
                            <FaRegHourglass size={18} />
                            <p>
                                {"Washington, DC"} | {"Hybrid"}
                            </p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <FaLocationDot size={18} />
                            <p>
                                {"Washington, DC"} | {"Hybrid"}
                            </p>
                        </div>
                    </div>

                    <p className='text-[16px] mb-[15px]'>{"We're"} looking for a Frontend Developer {"who's"} passionate about crafting pixel-perfect interfaces and working with modern frameworks like React and Next.js. {"You'll"} work closely with our design and backend teams to implement features, improve UX, and help scale our web platform.</p>

                    <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold px-2 h-[30px] rounded-full'>Web Development</button>
                </div>
            </article>

            <article className='mb-8 pb-10 border-b border-b-[#ccc]'>
                <h2 className='font-semibold text-xl mb-[15px]'>Active Jobs</h2>

                <div>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2'>
                        {/* date and time job was posted */}
                        <p className="text-[12px] text-[#808080]">Posted {"10/3/2024"} {"12:34 PM"}</p>

                        {/* number of proposals */}
                        <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold w-[114px] h-[30px] rounded-full'>23 Proposals</button>
                    </div>

                    <p className='text-sm mb-[15px] font-semibold'>Job Category</p>
                    <h3 className='font-semibold text-xl mb-[15px]'> Frontend Developer {"(React/Next.js)"} – Remote</h3>

                    <div className='mb-[15px] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 text-sm'>
                        <div className='flex items-center gap-2'>
                            <FaRegHourglass size={18} />
                            <p>
                                {"Washington, DC"} | {"Hybrid"}
                            </p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <FaLocationDot size={18} />
                            <p>
                                {"Washington, DC"} | {"Hybrid"}
                            </p>
                        </div>
                    </div>

                    <p className='text-[16px] mb-[15px]'>{"We're"} looking for a Frontend Developer {"who's"} passionate about crafting pixel-perfect interfaces and working with modern frameworks like React and Next.js. {"You'll"} work closely with our design and backend teams to implement features, improve UX, and help scale our web platform.</p>

                    <button disabled className='bg-[#009DDE] text-[15px] text-white font-bold px-2 h-[30px] rounded-full'>Web Development</button>
                </div>
            </article>

        </section>
    </main>
  )
}

export default OpenJobs