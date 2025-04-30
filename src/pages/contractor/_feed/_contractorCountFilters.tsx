import React from 'react';
import { ContractorProfile } from '@/types/contractors';

interface ContractorCountFiltersProps {
  contractors: ContractorProfile[];
  filteredCount: number;
  activeFilters: {id: string, name: string, value: string}[];
  onRemoveFilter: (filterId: string) => void;
  showTotalCount?: boolean;
}

const ContractorCountFilters: React.FC<ContractorCountFiltersProps> = ({ 
  contractors, 
  filteredCount, 
  activeFilters,
  // onRemoveFilter,
  showTotalCount = false
}) => {
  const displayCount = filteredCount !== undefined ? filteredCount : contractors.length;
  const totalCount = showTotalCount ? contractors.length : null;
  
  let countDisplay = `${displayCount} ${displayCount === 1 ? 'Contractor' : 'Contractors'}`;
  if (totalCount !== null && totalCount !== displayCount) {
    countDisplay += ` (out of ${totalCount})`;
  }
  
  return (
    <section className="flex gap-4 flex-wrap mb-4">
      <h2 className="font-bold text-lg">
        {displayCount === 0 ? 
          "0 Contractors" : 
          countDisplay
        }
      </h2>
      
      {activeFilters.length > 0 && (
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Filters:</span>
          
          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
          {/* {activeFilters.map((filter) => (
            <button 
              key={filter.id}
              className="bg-deepskyblue hover:bg-boldblue text-white text-xs rounded-full px-3 py-1 flex items-center transition-colors focus:outline-none"
              onClick={() => onRemoveFilter(filter.id)}
            >
              {filter.value ? `${filter.name}: ${filter.value}` : filter.name}
              <span className="ml-1 hover:text-red-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </button>
          ))} */}
          </div>
        </div>
      )}
    </section>
  );
};

export default ContractorCountFilters;