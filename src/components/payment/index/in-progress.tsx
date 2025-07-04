
interface ProgressPayment {
  id: number;
  projectTitle: string;
  client: string;
  amount: number;
  milestone: string;
  progress: number;
  dueDate: string;
  status: string;
}

interface ProgressCardProps {
  payment: ProgressPayment;
}

const ProgressCard = ({ payment }: ProgressCardProps) => (
  <div key={payment.id} className="bg-white rounded-xl p-6 border border-lightblue/20 hover:shadow-lg transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="font-bold text-darkgray text-lg mb-2">{payment.projectTitle}</h3>
        <p className="text-mediumgray text-sm mb-3">{payment.client}</p>
        <div className="flex items-center mb-3">
          <span className="text-sm text-mediumgray mr-2">Current Milestone:</span>
          <span className="text-sm font-medium text-darkgray">{payment.milestone}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-deepskyblue">${payment.amount.toLocaleString()}</div>
        <div className="text-sm text-mediumgray">Due: {new Date(payment.dueDate).toLocaleDateString()}</div>
      </div>
    </div>
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-mediumgray">Progress</span>
        <span className="font-medium text-darkgray">{payment.progress}%</span>
      </div>
      <div className="w-full bg-lightgray rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-deepskyblue to-deepskyblue h-2 rounded-full transition-all duration-300"
          style={{ width: `${payment.progress}%` }}
        />
      </div>
    </div>
  </div>
);

export default ProgressCard;