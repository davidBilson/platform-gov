import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContractorList from '../../_home/_contractorFeed/_contractorList';
import ContractorFilter from '../../_home/_contractorFeed/_contractorFilter';
import ContractorCountFilters from '../../_home/_contractorFeed/_contractorCountFilters';
import { ContractorProfile, ContractorApiResponse } from '@/types/contractors';
import { IoReload } from 'react-icons/io5';
import { useContractorFilter } from '@/store/useContractorFilter';
import LoadingAnimation from '@/components/ui/loading';

const ContractorFeed: React.FC = () => {
  const [contractors, setContractors] = useState<ContractorProfile[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<ContractorProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    applyFilters,
    searchTerm,
    profession,
    securityClearance,
    skillsAndExpertise,
    certifications,
    requireGovtExperience,
    governmentType,
    department,
    location,
    domainFocus,
    domainDetail,
  } = useContractorFilter();

  const fetchContractors = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ContractorApiResponse>(
        `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FETCH_ALL_CONTRACTORS}`
      );
      
      if (response.data.success) {
        const data = response.data.data;
        setContractors(data);
        setFilteredContractors(applyFilters(data));
      }
    } catch (err) {
      console.log(err)
      setError('Failed to fetch contractors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  // Update filtered contractors whenever filters change
  useEffect(() => {
    if (contractors.length > 0) {
      const filtered = applyFilters(contractors);
      setFilteredContractors(filtered);
    }
  }, [
    contractors,
    applyFilters,
    searchTerm,
    profession,
    securityClearance,
    skillsAndExpertise,
    certifications,
    requireGovtExperience,
    governmentType,
    department,
    location,
    domainFocus,
    domainDetail
  ]);

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
          <button onClick={() => fetchContractors()} className="bg-aquagreen text-white px-4 py-2 flex items-center gap-2 rounded-lg mx-auto text-sm mt-7.5 cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out">
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