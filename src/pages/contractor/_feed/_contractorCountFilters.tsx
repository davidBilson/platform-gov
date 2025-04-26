import React from 'react'
import { ContractorListProps } from '@/types/contractors';


const ContractorCountFilters: React.FC<ContractorListProps> = ({ contractors }) => {

  const activeFilters = [
    { id: 'jobType', name: 'Job Type' },
    { id: 'securityClearance', name: 'Security Clearance' }
  ]

  return (
    <section className="flex gap-4 flex-wrap mb-4">
      <h2 className="font-bold text-lg">{contractors.length > 0 ? contractors.length : "0"} Contractors</h2>
      <div className=" flex items-center">
        <span className="text-gray-600 mr-2">Filters:</span>
        
        {/* Filter pills */}
        <div className="flex gap-2">
          {activeFilters.map((filter) => (
            <div key={filter.id} className="bg-deepskyblue text-white text-xs rounded-full px-3 py-1 flex items-center">
              {filter.name}
              <button 
                className="ml-1 focus:outline-none"
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
  )
}

export default ContractorCountFilters