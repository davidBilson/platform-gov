
interface ReviewPayment {
  id: number;
  projectTitle: string;
  client: string;
  amount: number;
  milestone: string;
  submittedDate: string;
  reviewDays: number;
  status: string;
}

interface ReviewCardProps {
  payment: ReviewPayment;
}

const ReviewCard = ({ payment }: ReviewCardProps) => (
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
        <div className="text-sm text-mediumgray">Submitted: {new Date(payment.submittedDate).toLocaleDateString()}</div>
      </div>
    </div>
    <div className="flex items-center justify-between bg-gradient-to-r from-skyblue/10 to-faintskyblue/10 rounded-lg p-3">
      <div className="flex items-center">
        <div className="w-2 h-2 bg-deepskyblue rounded-full mr-2 animate-pulse"></div>
        <span className="text-sm font-medium text-darkgray">Under Review</span>
      </div>
      <span className="text-sm text-mediumgray">{payment.reviewDays} days in review</span>
    </div>
  </div>
);

export default ReviewCard;