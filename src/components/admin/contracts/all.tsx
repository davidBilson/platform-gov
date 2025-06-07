import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Download } from 'lucide-react';
import { getAllContracts } from '@/api/admin-api';
import Pagination from '@/components/pagination/pagination';
import TableSkeletonLoader from '@/components/skeleton/tableSkeletonLoader';
import { Contract } from '@/types/admin';
import GovlinkLogo from '../../../../public/images/govlinklogo-nobg.png';
import jsPDF from 'jspdf';

const AllContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalContracts: 0
  });

  // Helper function to convert image to base64
  const convertImageToBase64 = (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  };

  const fetchContracts = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getAllContracts({ page, limit: 10 });
      setContracts(response.data.contracts);
      setFilteredContracts(response.data.contracts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContracts(contracts);
      return;
    }

    const filtered = contracts.filter(contract => 
      contract._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.clientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.jobId.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredContracts(filtered);
  }, [searchTerm, contracts]);

  const handlePageChange = (page: number) => {
    fetchContracts(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-deepskyblue/20 text-deepskyblue">Active</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-600">Completed</span>;
      case 'disputed':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-600">Disputed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-600">Cancelled</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">{status}</span>;
    }
  };

  const exportToPDF = async (contract: Contract) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let currentY = 30;

    try {
      const logoBase64 = await convertImageToBase64(GovlinkLogo.src);
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', pageWidth / 2 - 25, currentY - 10, 50, 50);
        currentY += 70;
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const contractData = [
      ['Contract ID:', `#${contract._id.slice(-6)}`],
      ['Client:', contract.clientId?.name || 'N/A'],
      ['Contractor:', contract.contractorId?.name || 'N/A'],
      ['Job Title:', contract.jobId.jobTitle || 'N/A'],
      ['Value:', `$${contract.milestones?.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.amount, 0) ?? 'N/A'}`],
      ['Status:', contract.status],
      ['Start Date:', new Date(contract.startDate).toLocaleDateString()],
    ];

    contractData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(value, margin + 60, currentY);
      currentY += 15;
    });

    // Add milestones if available
    if (contract.milestones && contract.milestones.length > 0) {
      currentY += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Milestones:', margin, currentY);
      currentY += 15;

      contract.milestones.forEach((milestone, index) => {
        doc.setFont('helvetica', 'normal');
        doc.text(`${index + 1}. ${milestone.description} - $${milestone.amount} (${milestone.status})`, margin + 10, currentY);
        currentY += 12;
      });
    }

    // Download the PDF
    doc.save(`contract_${contract._id.slice(-6)}.pdf`);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-deepskyblue focus:border-deepskyblue text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-boldblue text-boldblue">
              <th className="px-4 py-3 text-left font-bold text-sm">Contract ID</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Client</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Contractor</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Job Title</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Value</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Status</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Start Date</th>
              <th className="px-4 py-3 text-left font-bold text-sm">Export</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <TableSkeletonLoader rows={5} cols={8} />
                </td>
              </tr>
            ) : filteredContracts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? 'No contracts found matching your search.' : 'No contracts available.'}
                </td>
              </tr>
            ) : (
              filteredContracts.map((contract, index) => (
                <tr 
                  key={contract._id} 
                  className={`text-xs border-b border-gray-200 hover:bg-deepskyblue/5 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-faintskyblue'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-boldblue text-sm" title={contract._id}>
                    #{contract._id.slice(-6)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {contract.clientId?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {contract.contractorId?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {contract.jobId.jobTitle || 'N/A'}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      {contract.retainer?.recurringAmount ?? contract.amount ?? contract.milestones?.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.amount, 0) ?? 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">
                    {new Date(contract.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => exportToPDF(contract)}
                      className="p-2 rounded-full hover:bg-deepskyblue/10 text-deepskyblue transition-colors duration-200 cursor-pointer"
                      title="Export to PDF"
                    >
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredContracts.length > 0 && (
        <Pagination 
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            hasNextPage: pagination.hasNextPage,
            hasPrevPage: pagination.hasPrevPage
          }} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  );
};

export default AllContracts;