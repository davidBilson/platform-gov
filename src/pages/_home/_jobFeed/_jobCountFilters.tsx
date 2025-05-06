import React from 'react';

interface JobCountFiltersProps {
  jobCount?: number;
  activeFilters?: Array<{
    id: string;
    name: string;
  }>;
  onRemoveFilter?: (filterId: string) => void;
}

const JobCountFilters: React.FC<JobCountFiltersProps> = ({ 
  jobCount = 0, 
  activeFilters = [],
  onRemoveFilter = () => {}
}) => {

  return (
    <section className="flex gap-4 flex-wrap mb-4">
      <h2 className="font-bold text-lg">{jobCount} Jobs</h2>
      
      <div className="flex items-center flex-wrap">
        <span className="text-gray-600 mr-2">Filters:</span>
        {activeFilters.length > 0 && (
          
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <div key={filter.id} className="bg-deepskyblue hover:bg-boldblue text-white text-xs rounded-full px-3 py-1 flex items-center">
                  {filter.name}
                  <button 
                    className="ml-1 focus:outline-none cursor-pointer hover:text-red-500"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={`Remove ${filter.name} filter`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
        )}
        
        </div>
    </section>
  );
};

export default JobCountFilters;