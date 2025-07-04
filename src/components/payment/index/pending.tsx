
interface PendingPayment {
  id: number;
  projectTitle: string;
  client: string;
  amount: number;
  milestone: string;
  pendingReason: string;
  waitingDays: number;
  status: string;
}

interface PendingCardProps {
  payment: PendingPayment;
}

const PendingCard = ({ payment }: PendingCardProps) => (
  <div key={payment.id} className="bg-white rounded-xl p-6 border border-lightblue/20 hover:shadow-lg transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="font-bold text-darkgray text-lg mb-2">{payment.projectTitle}</h3>
        <p className="text-mediumgray text-sm mb-3">{payment.client}</p>
        <div className="flex items-center mb-3">
          <span className="text-sm text-mediumgray mr-2">Milestone:</span>
          <span className="text-sm font-medium text-darkgray">{payment.milestone}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-mediumgray">${payment.amount.toLocaleString()}</div>
        <div className="text-sm text-mediumgray">Waiting: {payment.waitingDays} days</div>
      </div>
    </div>
    <div className="bg-gradient-to-r from-lightgray/50 to-lightgray/50 rounded-lg p-3">
      <div className="flex items-center">
        <svg className="w-4 h-4 text-mediumgray mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span className="text-sm text-mediumgray">{payment.pendingReason}</span>
      </div>
    </div>
  </div>
);

export default PendingCard;