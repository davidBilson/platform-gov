import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ContractorList from '../../_home/_contractorFeed/_contractorList';
import ContractorFilter from '../../_home/_contractorFeed/_contractorFilter';
import ContractorCountFilters from '../../_home/_contractorFeed/_contractorCountFilters';
import { ContractorProfile } from '@/types/contractors';
import { IoReload } from 'react-icons/io5';
import { useContractorFilter } from '@/store/useContractorFilter';
import LoadingAnimation from '@/components/ui/loading';
import { fetchContractors } from '@/api/feed-api';

const ContractorFeed: React.FC = () => {
  const [filteredContractors, x] = useState<ContractorProfile[]>([]);

  const { 
    applyFilters,
    searchTerm,
    profession,
    clearance,
    skillsAndExpertise,
    certifications,
    requireGovtExperience,
    governmentType,
    department,
    location,
    domainFocus,
    domainDetail,
  } = useContractorFilter();

  const {
    data: contractors = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['contractors'],
    queryFn: fetchContractors,
    staleTime: 5000, // 2 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const memoizedFilteredContractors = useMemo(() => {
    if (contractors.length > 0) {
      return applyFilters(contractors);
    }
    return [];
  }, [
    contractors,
    applyFilters,
    searchTerm,
    profession,
    clearance,
    skillsAndExpertise,
    certifications,
    requireGovtExperience,
    governmentType,
    department,
    location,
    domainFocus,
    domainDetail
  ]);

  useEffect(() => {
    x(memoizedFilteredContractors);
  }, [memoizedFilteredContractors]);

  const handleRetry = () => {
    refetch();
  };

  return (
    <main className="container mx-auto p-6">
      <ContractorFilter />
      <ContractorCountFilters 
        contractors={contractors} 
        filteredCount={filteredContractors.length}
      />
      {loading ? (
        <div className='flex items-center justify-center h-[60vh]'>
          <LoadingAnimation />
        </div>
      ) : error ? (
        <div className="text-boldblue text-center py-8">
          <p>
            {"Cannot load contractors list at this time. "}
          </p>
          <button 
            onClick={handleRetry} 
            className="bg-aquagreen text-white px-4 py-2 flex items-center gap-2 rounded-lg mx-auto text-sm mt-7.5 cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out"
          >
            Retry <IoReload />
          </button>
        </div>
      ) : (
        <ContractorList contractors={filteredContractors} />
      )}
    </main>
  );
};

export default ContractorFeed;