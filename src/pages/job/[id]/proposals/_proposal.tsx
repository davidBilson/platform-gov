import ProfilePicture from '@/components/ui/profilePicture'
import React from 'react'
import { IoLocationOutline } from 'react-icons/io5';
// import { WorkHistoryItem } from '@/types/profile';
// import RatingStars from '@/components/ui/rating';

interface ProposalProps {
  handleClose: () => void;
}

const Proposal: React.FC<ProposalProps> = ({ handleClose }) => {

    // const workHistory: WorkHistoryItem[] = [];
    // const rating = 4;

  return (
        <section className='p-6 md:p-12.5 pb-[240px]'>
          <div className='flex flex-col md:flex-row md:items-center gap-4 md:gap-18.25 mb-7.5'>
              <div className='flex gap-4 h-26'>
                <div>
                  <ProfilePicture source='' alt='' />
                </div>
                <div className='flex flex-col items-start md:justify-center gap-1 md:gap-2.5 md:w-1/2 h-full'>
                  <p className="text-lg md:text-xl font-semibold">
                    {/* {contractor.user.name.split(' ')[0]} {contractor.user.name.split(' ')[1]?.charAt(0)}. */}
                    {"Lamine Yamal"}
                  </p>
                  <p className='text-xs font-bold'>{"Profession"}</p>
                  <p className='text-xs font-bold flex items-center gap-1'><IoLocationOutline size={20} /> {"California"}</p>
                </div>
              </div>

              {/* *********** 1b *********** */}
              <div className=''>
                <div className='mb-3 md:mb-6.25 flex items-center justify-between flex-wrap'>
                  <h3 className='font-bold text-sm text-boldblue'>{"Title"}</h3>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-2.5 mb-3 md:mb-3.75">
                  {/* {contractor.skills.slice(0, 3).map((skill, index) => ( */}
                    <span 
                      // key={`skill-${index}`} 
                      className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                      {"skill"}
                    </span>
                  {/* ))} */}
                  
                  {/* {contractor.expertise.slice(0, 2).map((exp, index) => ( */}
                    <span 
                      // key={`skill-${index}`} 
                      className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                      {"exp"}
                    </span>
                  {/* ))} */}
                  
                  {/* {contractor.certifications.slice(0, 2).map((cert, index) => ( */}
                    <span
                      // key={`cert-${index}`} 
                      className="bg-aquagreen text-white text-xs rounded-full px-2 md:px-3 py-1">
                      {"cert"}
                    </span>
                  {/* ))} */}
                </div>
              </div>
          </div>

        <p className="text-sm md:text-base mb-7.5">{"Proposals description. Proposals description. Proposals description. Proposals description. Proposals description. Proposals description. Proposals description. Proposals description. Proposals description. Proposals description."}</p>
        
        <p className='font-semibold mb-7.5'>Proposed Rate: ${"75"}</p>

        <p className='font-semibold mb-7.5'>Work History</p>

        {/* Work History Table */}
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
                <thead>
                <tr className="border-b border-b-black text-left font-bold">
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Amount</th>
                </tr>
                </thead>
                <tbody>
                {
                // workHistory.length > 0 ? ( workHistory
                    Array(5).fill(null).map((job, index) => (
                    <tr key={index} className={index % 2 === 1 ? "bg-skyblue" : "bg-white"}>
                        <td className="py-3 px-4">
                            {"job.jobTitle"}
                        </td>
                        <td className="py-3 px-4 text-xs">
                            {/* {job.dates} */} {"2023-01-01 to 2023-12-31"}
                        </td>
                        <td className="py-3 px-4">
                            {/* <RatingStars rating={3} /> */}
                            {"3"}
                        </td>
                        <td className="py-3 px-4">
                            {/* {job.amount} */} {"$5,000"}
                        </td>
                    </tr>
                    // ))
                // ) : (
                //     <tr>
                //     <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                //         No work history available
                //     </td>
                //     </tr>
                ))}
                </tbody>
            </table>
            </div>
            {/* action buttons */}
            <div className="flex items-center justify-center gap-2.5 md:gap-7.5 py-12.5 px-6 absolute bottom-0 right-0 bg-skyblue w-full md:max-w-3/6 border-t border-t-boldblue">
              <button
                onClick={handleClose}
                type="button"
                className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg"
              >
                Back
              </button>
              <button 
                type="button"
                className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg"
              >
                Short List
              </button>
              <button 
                type="button"
                className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg"
              >
                Message
              </button>
              <button
                type="submit" 
                form="applicationForm"
                className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 bg-boldblue text-white text-xs md:text-sm font-semibold rounded-lg border border-boldblue"
              >
                Hire
              </button>
            </div>
        </section>
  )
}

export default Proposal