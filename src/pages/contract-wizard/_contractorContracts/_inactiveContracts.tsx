import Link from 'next/link';
import { FaLocationDot, FaRegHourglass } from 'react-icons/fa6';
import { Contract } from '@/types/contracts';
import ProfilePicture from '@/components/profile/profilePicture';

interface InactiveContractsProps {
  contracts: Contract[];
}

const InactiveContracts = ({ contracts }: InactiveContractsProps) => {
  // Render even if contracts array is empty (don't return null)
  return (
    <section className='border-b border-b-deepskyblue pb-5 mb-12.5'>
      <h2 className='pb-5 mb-7.5 text-darkgray text-xl font-bold'>Inactive Contracts</h2>
      
      <section className='flex flex-col gap-12.5'>
        {contracts.length === 0 ? (
          <p>No inactive contracts found</p>
        ) : 
        contracts.map((contract) => (
          <article key={contract._id} className="mb-7.5">
            
            <section className='flex flex-col md:flex-row md:items-center justify-between gap-5 mb-5'>
              <div>
                <p className='text-xs text-mediumgray font-semibold mb-5'>
                  {new Date(contract.startDate).toLocaleDateString()} - {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'Present'}
                </p>
                <h3 className="text-xl font-semibold mb-3.75">
                  {contract.jobId?.jobTitle || 'Job Title'}
                </h3>
              </div>
            </section>

            <div className="flex items-center gap-5 mb-5">
              <div className="w-8.75 h-8.75 bg-cyan-200 rounded-full overflow-hidden flex items-center justify-center text-white font-bold">
                {contract.jobId?.clientLogo || contract.clientId?.profile?.logo ? (
                  <ProfilePicture 
                    source={contract.jobId.clientLogo || contract.clientId?.profile?.logo} 
                    alt={contract.jobId?.clientName || contract.clientId?.name || 'Client'} 
                    dimension={35}
                  />
                ) : (
                  <span>{contract.jobId?.clientName?.charAt(0) || contract.clientId?.name?.charAt(0) || 'C'}</span>
                )}
              </div>
              <Link href={``} className="font-semibold text-sm hover:underline">
                {contract.jobId?.clientName || contract.clientId?.name || 'Client'}
              </Link>
            </div>

            <section className='flex flex-col md:flex-row items-start md:items-center justify-between gap-5'>
              <div className="flex flex-wrap items-center gap-10 text-sm font-semibold">
                  <div className="flex items-center gap-1.25">
                    <FaRegHourglass size={15} /> 
                    {contract.paymentStructure.charAt(0).toUpperCase()}{contract.paymentStructure.substring(1)}{" | "}
                    ${contract.jobId?.price ?? contract.jobId?.retainerAmount}{" | "}
                    {contract.jobId?.employmentType || ''}
                  </div>
                  <div className="flex items-center gap-1.25">
                    <FaLocationDot size={15} />
                    {contract.jobId?.location || 'Remote'}
                  </div>
              </div>

              <div className='font-bold text-sm'>
                <Link 
                  className='cursor-pointer hover:text-deepskyblue hover:underline' 
                  href={{
                    pathname: `/contract/${contract.hiringId._id}`,
                    query: {
                      jobId: contract?.jobId && contract.jobId._id,
                      proposalId: contract.hiringId?.applicationId
                    }
                  }}

                >Contract Detail</Link>{" | "}
                <Link 
                  className='cursor-pointer hover:text-deepskyblue hover:underline' 
                  href={{
                    pathname: `/contract/${contract.hiringId._id}`,
                    query: {
                      jobId: contract?.jobId && contract.jobId._id,
                      proposalId: contract.hiringId?.applicationId,
                      tab: contract.paymentStructure
                    }
                  }}
                > Manage {contract.paymentStructure.charAt(0).toUpperCase() + contract.paymentStructure.slice(1)}</Link>{" | "}
                <Link className='cursor-pointer hover:text-deepskyblue hover:underline' href={`/contract/${contract._id}`}>Submit For Payment</Link>{" | "}
              </div>
            </section>

          </article>
        ))}
      </section>
    </section>
  );
};

export default InactiveContracts;