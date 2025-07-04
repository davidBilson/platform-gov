import React from 'react';

interface ClientHistoryData {
  summary: {
    totalReceived: number;
    totalWithdrawn: number;
    totalRefunds: number;
    totalDisputes: number;
  };
}

const ClientHistoryCards: React.FC<{ data: ClientHistoryData }> = ({ data }) => {
  const summary = data.summary;

  const cards = [
    {
      label: 'Total Services Delivered',
      value: summary.totalReceived,
      color: 'text-aquagreen',
    },
    {
      label: 'Funds Released to Contractor',
      value: summary.totalWithdrawn,
      color: 'text-deepskyblue',
    },
    {
      label: 'Refunds Received',
      value: summary.totalRefunds,
      color: 'text-boldblue',
    },
    {
      label: 'Payments in Dispute',
      value: summary.totalDisputes,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl p-4 border border-deepskyblue/20">
          <p className="text-sm font-medium text-gray-600 mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color}`}>
            ${card.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ClientHistoryCards;
