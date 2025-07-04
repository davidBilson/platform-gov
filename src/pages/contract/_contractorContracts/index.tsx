import { IoMdArrowDropdown } from 'react-icons/io';
import ActiveContracts from './_activeContracts';
import CompletedContracts from './_completedContracts';
import InactiveContracts from './_inactiveContracts';
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import useAuthStore from '@/store/useAuth';
import { useEffect, useState } from 'react';
import { Contract } from '@/types/contracts';
import LoadingAnimation from '@/components/ui/loading';
import { getContracts } from '@/api/contract/contract-api';

const ContractorContracts = () => {
  const { userId } = useAuthStore();
  const [contracts, setContracts] = useState<{
    active: Contract[];
    inactive: Contract[];
    completed: Contract[];
  }>({
    active: [],
    inactive: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      if (userId) {
        try {
          const data = await getContracts(userId);
          setContracts(data || { active: [], inactive: [], completed: [] });
        } catch (error) {
          console.error('Error in component when fetching contracts:', error);
          // Even on error, set default empty arrays
          setContracts({ active: [], inactive: [], completed: [] });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchContracts();
  }, [userId]);

  if (loading) {
    return <div className='flex items-center justify-center h-[60vh]'><LoadingAnimation /></div>
  }

  return (
    <>
      <div className='flex items-center gap-7.5 mb-9.25'>
        <div className="flex flex-wrap items-center justify-between border border-boldblue rounded-lg w-full max-w-75 px-5 py-4 text-sm text-boldblue">
          <input 
            type="text"
            className="text-boldblue placeholder:text-boldblue font-semibold outline-none w-[80%]" 
            placeholder="Filter By" 
          />
          <button
            type="button" 
            className="focus:outline-none"
          >
            <IoMdArrowDropdown />
          </button>
        </div>
        <button
          type="button" 
          className="focus:outline-none bg-boldblue text-white rounded-lg w-fit px-4 py-3"
        >
          <TbAdjustmentsHorizontal size={25} />
        </button>
      </div>

      <ActiveContracts contracts={contracts.active} />
      <InactiveContracts contracts={contracts.inactive} />
      <CompletedContracts contracts={contracts.completed} />
    </>
  );
};

export default ContractorContracts;