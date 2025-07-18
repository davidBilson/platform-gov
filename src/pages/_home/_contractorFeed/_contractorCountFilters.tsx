import React from 'react';
import { ContractorProfile } from '@/types/contractors';
import { useContractorFilter } from '@/store/useContractorFilter';

interface ContractorCountFiltersProps {
  contractors?: ContractorProfile[];
  filteredCount: number;
  showTotalCount?: boolean;
}

const ContractorCountFilters: React.FC<ContractorCountFiltersProps> = ({ 
  filteredCount,
}) =>  {
  const { activeFilters, removeFilter } = useContractorFilter();
  

  return (
    <section className="flex gap-4 flex-wrap mb-4">
      <h2 className="font-bold text-lg">
        {filteredCount === 0 ? "0 Consultants" : `${filteredCount} Consultants`}
      </h2>
      
      {activeFilters.length > 0 && (
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Filters:</span>
          <div className="flex gap-2 flex-wrap">
            {activeFilters.map((filter) => (
              <button 
                key={filter.id}
                className="bg-deepskyblue hover:bg-boldblue text-white text-xs rounded-full px-3 py-1 flex items-center transition-colors focus:outline-none cursor-pointer"
                onClick={() => removeFilter(filter.id)}
              >
                {filter.name}: {filter.value}
                <span className="ml-1 hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ContractorCountFilters;