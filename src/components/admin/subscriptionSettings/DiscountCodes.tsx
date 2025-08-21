import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Eye, EyeOff, Calendar, Percent, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { fetchAllDiscountCodes } from '@/api/admin-subscription-api';

// Type definitions
interface DiscountCode {
  readonly _id: string;
  readonly token: string;
  readonly discountPercentage: number;
  readonly isActive: boolean;
  readonly createdAt: string;
}

interface ApiResponse {
  readonly success: boolean;
  readonly discountCodes: readonly DiscountCode[];
  readonly message?: string;
}

interface StatCardProps {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly label: string;
  readonly value: number;
  readonly bgColor: string;
  readonly textColor: string;
  readonly iconColor: string;
  readonly borderColor: string;
}

interface TableRowProps {
  readonly code: DiscountCode;
  readonly isTokenVisible: boolean;
  readonly isCopied: boolean;
  readonly onToggleVisibility: (id: string) => void;
  readonly onCopyToken: (token: string, id: string) => Promise<void>;
}

// Utility functions
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  } as const);
};

const maskToken = (token: string): string => {
  return token.substring(0, 8) + '...' + token.substring(token.length - 8);
};

const calculateAverageDiscount = (codes: readonly DiscountCode[]): number => {
  if (codes.length === 0) return 0;
  return Math.round(
    codes.reduce((sum: number, code: DiscountCode) => sum + code.discountPercentage, 0) / codes.length
  );
};

// Sub-components
const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  bgColor, 
  textColor, 
  iconColor, 
  borderColor 
}) => (
  <div className={`${bgColor} p-4 rounded-lg border ${borderColor}`}>
    <div className="flex items-center">
      <Icon className={`w-8 h-8 ${iconColor} mr-3`} />
      <div>
        <p className={`text-sm ${textColor} font-medium`}>{label}</p>
        <p className={`text-2xl font-bold ${textColor.replace('text-', 'text-').replace('-600', '-800')}`}>
          {value}{label.includes('Discount') ? '%' : ''}
        </p>
      </div>
    </div>
  </div>
);

const TableRow: React.FC<TableRowProps> = ({ 
  code, 
  isTokenVisible, 
  isCopied, 
  onToggleVisibility, 
  onCopyToken 
}) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center space-x-2">
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
          {isTokenVisible ? code.token : maskToken(code.token)}
        </code>
        <button
          onClick={() => onToggleVisibility(code._id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
          aria-label={isTokenVisible ? "Hide token" : "Show token"}
        >
          {isTokenVisible ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <span className="text-lg font-semibold text-boldblue">
          {code.discountPercentage}%
        </span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        code.isActive 
          ? 'bg-green-100 text-aquagreen border border-green-200' 
          : 'bg-red-100 text-crimson border border-crimson/20'
      }`}>
        {code.isActive ? (
          <CheckCircle className="w-3 h-3 mr-1" />
        ) : (
          <XCircle className="w-3 h-3 mr-1" />
        )}
        {code.isActive ? 'Active' : 'Inactive'}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
        {formatDate(code.createdAt)}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <button
        onClick={() => onCopyToken(code.token, code._id)}
        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          isCopied
            ? 'bg-green-100 text-aquagreen border border-green-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
        }`}
        type="button"
        aria-label="Copy discount code token"
      >
        <Copy className="w-4 h-4 mr-1" />
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </td>
  </tr>
);

const LoadingSkeletons: React.FC = () => (
  <div className="min-h-screen bg-white p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ error: string; onRetry: () => void; isLoading: boolean }> = ({ 
  error, 
  onRetry, 
  isLoading 
}) => (
  <div className="min-h-screen bg-white p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <div className="flex items-center justify-center text-center">
          <div>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Discount Codes</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onRetry}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-boldblue text-white rounded-lg hover:bg-boldblue/70 transition-colors disabled:opacity-50"
              type="button"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <Percent className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-800 mb-2">No discount codes found</h3>
    <p className="text-gray-600">Get started by creating your first discount code.</p>
  </div>
);

// Main component
const DiscountCodes: React.FC = () => {
  const [discountCodes, setDiscountCodes] = useState<readonly DiscountCode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const loadDiscountCodes = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse = await fetchAllDiscountCodes();
      
      if (response.success) {
        setDiscountCodes(response.discountCodes);
      } else {
        throw new Error(response.message || 'Failed to fetch discount codes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching discount codes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDiscountCodes();
  }, [loadDiscountCodes]);

  const toggleTokenVisibility = useCallback((id: string): void => {
    setVisibleTokens(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const copyToClipboard = useCallback(async (token: string, id: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(id);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  }, []);

  // Computed values
  const activeCodes = discountCodes.filter((code: DiscountCode) => code.isActive);
  const inactiveCodes = discountCodes.filter((code: DiscountCode) => !code.isActive);
  const averageDiscount = calculateAverageDiscount(discountCodes);

  if (loading) {
    return <LoadingSkeletons />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={loadDiscountCodes} isLoading={loading} />;
  }

  return (
    <div className="min-h-screen bg-white py-6">
      <div className=" mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-gray-600 mt-1">Manage and monitor discount codes</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                Total: {discountCodes.length} codes
              </span>
              <button
                onClick={() => void loadDiscountCodes()}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 bg-blue-50 text-boldblue rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                type="button"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={CheckCircle}
                label="Active Codes"
                value={activeCodes.length}
                bgColor="bg-green-50"
                textColor="text-green-600"
                iconColor="text-green-600"
                borderColor="border-green-200"
              />
              
              <StatCard
                icon={XCircle}
                label="Inactive Codes"
                value={inactiveCodes.length}
                bgColor="bg-red-50"
                textColor="text-red-600"
                iconColor="text-red-600"
                borderColor="border-red-200"
              />

              <StatCard
                icon={Percent}
                label="Avg. Discount"
                value={averageDiscount}
                bgColor="bg-blue-50"
                textColor="text-boldblue"
                iconColor="text-boldblue"
                borderColor="border-blue-200"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {discountCodes.map((code: DiscountCode) => (
                  <TableRow
                    key={code._id}
                    code={code}
                    isTokenVisible={visibleTokens.has(code._id)}
                    isCopied={copiedToken === code._id}
                    onToggleVisibility={toggleTokenVisibility}
                    onCopyToken={copyToClipboard}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {discountCodes.length === 0 && <EmptyState />}
        </div>
      </div>
    </div>
  );
};

export default DiscountCodes;