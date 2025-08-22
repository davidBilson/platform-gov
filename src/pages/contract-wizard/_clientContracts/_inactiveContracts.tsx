import StatusTag from '@/components/tags/statusTag';
import { Contract } from '@/types/contracts';
import { useRouter } from 'next/router';
import { MouseEvent } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';

interface ContractsProps {
  contracts?: Contract[];
}

const InactiveContracts = ({ contracts = [] }: ContractsProps) => {

  const router = useRouter();

  const formatDate = (date: string | Date): string => {
    try {
      return format(typeof date === 'string' ? new Date(date) : date, 'MM/dd/yyyy');
    } catch (error) {
      console.log('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const getStatusDisplay = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const viewContract = (contractId: string, jobId?: string, applicationId?: string) => {
    const query: { jobId?: string; proposalId?: string } = {};

    if (jobId) query.jobId = jobId;
    if (applicationId) query.proposalId = applicationId;

    router.push({
      pathname: `/contract-wizard/${contractId}`,
      query: Object.keys(query).length > 0 ? query : undefined
    });
  };

  return (
    <>
      <section className='pb-5 mb-12.5'>
        <h2 className='pb-5 mb-7.5 text-boldblue text-xl font-bold'>Inactive Contracts</h2>

        <section className='flex flex-col gap-12.5'>
          {contracts.length === 0 ? (
            <p className="text-gray-500 italic">No inactive contracts found</p>
          ) : (
            contracts.map((contract) => (
              <article
                key={contract._id}
                onClick={() => {
                  viewContract(
                    contract._id,
                    contract.jobId?._id,
                    contract.hiringId?.applicationId
                  );
                  router.push(`/contract-wizard/${contract._id}`);
                }}
                className='flex flex-wrap md:justify-between gap-5 items-start pb-10 border-b border-b-lightblue cursor-pointer'
              >
                <section className='flex flex-col items-start gap-3.75'>
                  <p className='text-xs text-boldblue font-semibold'>
                    {formatDate(contract.createdAt)} - Present
                  </p>
                  <h3 className="text-xl font-semibold">
                    {contract.jobId?.jobTitle || "Job Title Not Available"}
                  </h3>

                  <Link
                    href={`/profile/${contract.contractorId?._id}`}
                    className=" text-darkgray hover:underline"
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                  >
                    {
                      `${contract.contractorId?.name || "Contractor Name Not Available"}`.replace(/\b\w/g, c => c.toUpperCase())
                    }
                  </Link>
                  <StatusTag status={getStatusDisplay(contract.status)} />
                </section>
              </article>
            ))
          )}
        </section>
      </section>
    </>
  );
};

export default InactiveContracts;