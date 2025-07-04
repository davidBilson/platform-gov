import React from 'react'

interface StatusProps {
  status: string;
}

const StatusTag = ({ status }: StatusProps) => {
  
  const getStatusColor = () => {
    // ['active', 'paused', 'completed', 'cancelled', 'disputed']
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-boldblue';
      case 'paused':
        return 'bg-mediumgray';
      case 'cancelled':
        return 'bg-red-700';
      case 'disputed':
        return 'bg-red-700';
      case 'completed':
        return 'bg-aquagreen';
      default:
        return 'bg-boldblue';
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
