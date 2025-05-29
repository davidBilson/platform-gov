import React from 'react';

interface Contract {
  id?: string;
  jobId?: {
    jobTitle?: string;
    price?: number;
    retainerAmount?: number;
  };
  startDate?: string;
  endDate?: string;
  ratingData?: {
    rating: number;
  };
}

interface WorkHistoryProps {
  completedContracts: Contract[];
  renderRating?: (rating: number) => React.ReactNode;
}

const WorkHistory: React.FC<WorkHistoryProps> = ({ completedContracts, renderRating }) => {

  // Function to format dates consistently
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      // Format as MM/DD/YYYY or DD/MM/YYYY based on your preference
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  // Function to format date range
  const formatDateRange = (startDate: string | undefined, endDate: string | undefined) => {
    const formattedStart = formatDate(startDate || '');
    const formattedEnd = formatDate(endDate || '');
    
    // Handle ongoing contracts
    if (!endDate || endDate === startDate) {
      return `${formattedStart} - Present`;
    }
    
    return `${formattedStart} - ${formattedEnd}`;
  };

  const calculateAverageRating = () => {
    const ratedContracts = completedContracts.filter((c): c is typeof c & { ratingData: NonNullable<typeof c.ratingData> } => 
      c.ratingData != null
    );
    
    if (ratedContracts.length === 0) return 'N/A';
    
    const average = ratedContracts.reduce((sum, c) => sum + c.ratingData.rating, 0) / ratedContracts.length;
    return average.toFixed(1);
  };

  return (
    <div>
      <p className='font-semibold mb-4'>Work History</p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="border-b border-b-black text-left font-bold">
              <th className="py-3 px-4">Job Title</th>
              <th className="py-3 px-4">Dates</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {completedContracts && completedContracts.length > 0 ? (
              completedContracts.map((contract, index) => (
                <tr key={contract.id || index} className={index % 2 === 1 ? "bg-lightgray" : "bg-white"}>
                  <td className="py-3 px-4">
                    <div className="font-medium">
                      {contract.jobId?.jobTitle || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {formatDateRange(contract.startDate, contract.endDate)}
                  </td>
                  <td className="py-3 px-4">
                    {contract.ratingData ? (
                      <div className="flex flex-col gap-1">
                        {renderRating ? renderRating(contract.ratingData.rating) : (
                          <span className="text-sm">{contract.ratingData.rating}/5</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No Rating</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    ${contract.jobId?.price ?? contract.jobId?.retainerAmount ?? 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <span>No work history available</span>
                    <span className="text-xs text-gray-400">Complete some contracts to see your work history here</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      {completedContracts && completedContracts.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-deepskyblue">{completedContracts.length}</p>
              <p className="text-sm text-gray-600">Total Jobs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-deepskyblue">
                {completedContracts.filter(c => c.ratingData).length}
              </p>
              <p className="text-sm text-gray-600">Rated Jobs</p>
            </div>
            <div>
              {/* <p className="text-2xl font-bold text-deepskyblue">
                {completedContracts.filter(c => c.ratingData).length > 0 
                  ? (completedContracts
                      .filter(c => c.ratingData)
                      .reduce((sum, c) => sum + c.ratingData.rating, 0) / 
                     completedContracts.filter(c => c.ratingData).length
                    ).toFixed(1)
                  : 'N/A'
                }
              </p> */}
              <p className="text-2xl font-bold text-deepskyblue">
                {calculateAverageRating()}
              </p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkHistory;