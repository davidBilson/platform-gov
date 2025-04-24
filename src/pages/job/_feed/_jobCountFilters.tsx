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
  jobCount = 245, 
  activeFilters = [
    { id: 'jobType', name: 'Job Type' },
    { id: 'securityClearance', name: 'Security Clearance' }
  ],
  onRemoveFilter = () => {} 
}) => {
  return (
    <section className="flex items-center mb-4">
      <h2 className="font-bold text-lg">{jobCount} Jobs</h2>
      <div className="ml-4 flex items-center">
        <span className="text-gray-600 mr-2">Filters:</span>
        
        {/* Filter pills */}
        <div className="flex gap-2">
          {activeFilters.map((filter) => (
            <div key={filter.id} className="bg-deepskyblue text-white text-xs rounded-full px-3 py-1 flex items-center">
              {filter.name}
              <button 
                className="ml-1 focus:outline-none"
                onClick={() => onRemoveFilter(filter.id)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobCountFilters;