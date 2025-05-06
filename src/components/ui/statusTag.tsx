import React from 'react'

interface StatusProps {
  status: string;
}

const StatusTag: React.FC<StatusProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-boldblue';
      case 'pending':
        return 'bg-aquagreen';
      case 'inactive':
        return 'bg-mediumgray';
      default:
        return 'bg-boldblue'; // fallback
    }
  };

  return (
    <button
      disabled
      className={`${getStatusColor()} w-fit h-git px-2.5 py-1.25 font-semibold text-xs text-white rounded-full`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </button>
  );
};

export default StatusTag;
