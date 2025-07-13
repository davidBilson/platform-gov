import React, { useState, useEffect, useMemo } from 'react';
import { 
  FolderOpen, 
  FolderX,
  Clock,
  CheckCircle,
  Search,
  X
} from 'lucide-react';
import { getAllJobs } from '@/api/admin-api';
import Pagination from '@/components/pagination/pagination';
import { formatDate } from '@/utils/format';
import TableSkeletonLoader from '@/components/skeleton/tableSkeletonLoader';

const AllJobs = () => {
  interface Job {
    _id: string;
    jobTitle: string;
    clientName?: string;
    location?: string;
    createdAt: string;
    employmentType: string;
    paymentType: string;
    price: number;
    status: string;
  }

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchJobs = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getAllJobs({ page, limit: 100 });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search term
  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) {
      return jobs;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return jobs.filter(job => 
      job.jobTitle.toLowerCase().includes(searchLower) ||
      (job.clientName && job.clientName.toLowerCase().includes(searchLower)) ||
      (job.location && job.location.toLowerCase().includes(searchLower)) ||
      job.employmentType.toLowerCase().includes(searchLower) ||
      job.paymentType.toLowerCase().includes(searchLower) ||
      job.status.toLowerCase().includes(searchLower)
    );
  }, [jobs, searchTerm]);

  // Paginate filtered results
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage, itemsPerPage]);

  // Calculate pagination info for filtered results
  const filteredPagination = useMemo(() => {
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    return {
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      totalJobs: filteredJobs.length
    };
  }, [filteredJobs.length, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return {
          text: 'Open',
          icon: FolderOpen,
          class: 'bg-green-100 text-green-700'
        };
      case 'active':
        return {
          text: 'Active',
          icon: Clock,
          class: 'bg-blue-100 text-blue-700'
        };
      case 'closed':
        return {
          text: 'Closed',
          icon: FolderX,
          class: 'bg-red-100 text-red-700'
        };
      case 'completed':
        return {
          text: 'Completed',
          icon: CheckCircle,
          class: 'bg-purple-100 text-purple-700'
        };
      default:
        return {
          text: status,
          icon: FolderOpen,
          class: 'bg-gray-100 text-gray-700'
        };
    }
  };

  const formatPrice = (price: number, paymentType: string) => {
    if (paymentType === 'hourly') {
      return `$${price}/hr`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs by title, client, location, or status..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deepskyblue outline-none transition-colors text-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Search Results Info */}
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            {filteredJobs.length === 0 ? (
              <span>No jobs found for {`"${searchTerm}"`}</span>
            ) : (
              <span>
                Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} 
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-boldblue text-boldblue">
              <th className="px-4 py-3 text-left font-bold text-sm">Title</th>
              <th className="px-4 py-3 text-left font-bold">Client</th>
              <th className="px-4 py-3 text-left font-bold">Location</th>
              <th className="px-4 py-3 text-left font-bold">Posted</th>
              <th className="px-4 py-3 text-left font-bold">Type</th>
              <th className="px-4 py-3 text-left font-bold">Payment</th>
              <th className="px-4 py-3 text-left font-bold">Price</th>
              <th className="px-4 py-3 text-left font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <TableSkeletonLoader rows={5} cols={8} />
                </td>
              </tr>
            ) : paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  {searchTerm ? `No jobs found matching "${searchTerm}"` : 'No jobs found'}
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job, index) => {
                const statusBadge = getStatusBadge(job.status);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <tr 
                    key={job._id} 
                    className={`text-xs border-b border-gray-200 hover:bg-deepskyblue/5 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-faintskyblue'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-boldblue max-w-xs">
                      <div className="truncate max-w-[200px]" title={job.jobTitle}>
                        {job.jobTitle}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {job.clientName || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {job.location || 'Remote'}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.employmentType === 'Full-time' 
                          ? 'bg-deepskyblue/20 text-deepskyblue' 
                          : 'bg-boldblue/20 text-boldblue'
                      }`}>
                        {job.employmentType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.paymentType === 'fixed-price' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {job.paymentType === 'hourly' ? 'Hourly' : 'Fixed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-semibold">
                      {formatPrice(job.price, job.paymentType)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.class}`}>
                        <StatusIcon size={12} />
                        {statusBadge.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredJobs.length > 0 && filteredPagination.totalPages > 1 && (
        <Pagination 
          pagination={{
            currentPage: filteredPagination.currentPage,
            totalPages: filteredPagination.totalPages,
            hasNextPage: filteredPagination.hasNextPage,
            hasPrevPage: filteredPagination.hasPrevPage
          }} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  );
};

export default AllJobs;