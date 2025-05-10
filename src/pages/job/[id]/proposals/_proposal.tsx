import ProfilePicture from '@/components/profile/profilePicture'
import React, { useEffect } from 'react'
import { IoLocationOutline } from 'react-icons/io5';
// import { WorkHistoryItem } from '@/types/profile';
// import RatingStars from '@/components/ui/rating';
import { ProposalData } from '@/types/proposalsList';
import { useHire } from '@/store/useHire';
import { useRouter } from 'next/router';

interface ProposalProps {
  handleClose: () => void;
  proposalData: ProposalData;
}

const Proposal: React.FC<ProposalProps> = ({ handleClose, proposalData }) => {

  const router = useRouter();
  const { setHireData } = useHire()

  useEffect(() => {

    setHireData({
      jobId: proposalData.jobId,
      contractorId: proposalData.contractorId, 
      contractorName: proposalData.contractorName, 
      contractorProfilePicture: proposalData.contractorProfilePicture, 
      applicationId: proposalData.applicationId
    });

  }, [proposalData])

  return (
        <section className='p-6 md:p-12.5 pb-[240px] w-full h-full relative'>
          <div className='flex flex-col gap-5 mb-7.5'>
              
              <div className='flex gap-4 h-26'>
                <div>
                  <ProfilePicture source={proposalData.contractorProfilePicture} alt={proposalData.name} />
                </div>
                <div className='flex flex-col items-start md:justify-center gap-1 md:gap-2.5 md:w-1/2 h-full'>
                  <p className="text-lg md:text-xl font-semibold">
                    {proposalData.name}
                  </p>
                  <p className='text-xs font-bold'>{proposalData.primaryPosition}</p>
                  <p className='text-xs font-bold flex items-center gap-1'><IoLocationOutline size={20} /> {proposalData.location}</p>
                </div>
              </div>

              <div className=''>
                <div className='mb-3 md:mb-6.25 flex items-center justify-between flex-wrap'>
                  <h3 className='font-bold text-sm text-boldblue'>{proposalData.primaryPosition}</h3>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-2.5 mb-3 md:mb-3.75">
                  {proposalData.skills.map((skill, index) => (
                    <span 
                      key={`skill-${index}`} 
                      className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                      {skill}
                    </span>
                  ))}
                  
                  {proposalData.expertise.map((exp, index) => (
                    <span 
                      key={`skill-${index}`} 
                      className="bg-deepskyblue text-white text-xs rounded-full px-2 md:px-3 py-1">
                      {exp}
                    </span>
                  ))}
                  
                  {proposalData.certifications.map((cert, index) => (
                    <span
                      key={`cert-${index}`}
                      className="bg-aquagreen text-white text-xs rounded-full px-2 md:px-3 py-1">
                      {cert}
                    </span>
                  ))}

                </div>
              </div>
          </div>

        <p className="text-sm md:text-base mb-7.5">{proposalData.coverLetter}</p>
        
        <p className='font-semibold mb-7.5'>Proposed Rate: ${proposalData.proposedRate}</p>

        <p className='font-semibold mb-7.5'>Work History</p>
        
        
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
                
              { proposalData.workHistory.length > 0 &&
                <tbody>
                    { proposalData.workHistory.length > 0 ? 
                      ( proposalData.workHistory.map((job, index) => (
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
                        )
                      )) : 
                      (
                        <tr>
                          <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                              No work history available
                          </td>
                          </tr>
                      )
                    }
                </tbody>
              }
            </table>

            </div>

            <div
              className="flex items-center justify-center gap-2.5 md:gap-7.5 py-12.5 px-6 absolute bottom-0 right-0 bg-skyblue w-full border-t border-t-boldblue"
            >
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
                onClick={() => router.push('/hire')}
                className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 bg-boldblue text-white text-xs md:text-sm font-semibold rounded-lg border border-boldblue"
              >
                Hire
              </button>
            </div>
            
        </section>
  )
}

export default Proposal