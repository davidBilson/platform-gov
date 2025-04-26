import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ContractorList from './_contractorList'
import ContractorFilter from './_contractorFilter'
import ContractorCountFilters from './_contractorCountFilters'
import { ContractorProfile, ContractorApiResponse } from '@/types/contractors'

const ContractorFeed: React.FC = () => {
  const [contractors, setContractors] = useState<ContractorProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await axios.get<ContractorApiResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FETCH_ALL_CONTRACTORS}`
        );
        
        if (response.data.success) {
          setContractors(response.data.data);
        } else {
          setError('Failed to fetch contractors');
        }
      } catch (err) {
        setError('Error fetching contractors');
        console.error('Error fetching contractors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  return (
    <main className="container mx-auto p-6">
      <ContractorFilter />
      <ContractorCountFilters contractors={contractors} />
      {loading ? (
        <div>Loading contractors...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <ContractorList contractors={contractors} />
      )}
    </main>
  );
};

export default ContractorFeed;