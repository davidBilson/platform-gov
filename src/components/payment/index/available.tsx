
interface AvailablePayment {
  id: number;
  projectTitle: string;
  client: string;
  amount: number;
  milestone: string;
  completedDate: string;
  status: string;
}

interface AvailableCardProps {
  payment: AvailablePayment;
}

const AvailableCard = ({ payment }: AvailableCardProps) => (
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
        <div className="text-2xl font-bold text-deepskyblue">${payment.amount.toLocaleString()}</div>
        <div className="text-sm text-mediumgray">Completed: {new Date(payment.completedDate).toLocaleDateString()}</div>
      </div>
    </div>
    <div className="flex items-center bg-faintskyblue rounded-lg p-3">
      <svg className="w-4 h-4 text-deepskyblue mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <span className="text-sm font-medium text-deepskyblue">Ready for Payment</span>
    </div>
  </div>
);

export default AvailableCard;