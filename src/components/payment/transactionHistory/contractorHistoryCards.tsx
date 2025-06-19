import React from 'react';

interface ContractorHistoryData {
  summary: {
    totalReceived: number;
    totalWithdrawn: number;
    totalDisputes: number;
  };
}

const ContractorHistoryCards: React.FC<{ data: ContractorHistoryData }> = ({ data }) => {
  const summary = data.summary;

  const cards = [
    {
      label: 'Total Earnings',
      value: summary.totalReceived,
      color: 'text-aquagreen',
    },
    {
      label: 'Withdrawn to Bank',
      value: summary.totalWithdrawn,
      color: 'text-deepskyblue',
    },
    {
      label: 'In Dispute',
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

export default ContractorHistoryCards;
