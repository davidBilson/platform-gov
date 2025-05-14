import { toast } from 'react-toastify';
import Logo from '@/components/ui/logo';
import { contractorSignHiringOffer } from '@/api/hiring';
import useAuthStore from '@/store/useAuth';
import { useEffect } from 'react';

interface HiringDocument {
  _id?: string;
  jobId: { description: string };
  offerDetails: {
    rate: number;
    paymentType: string;
    employmentType: string;
    startDate: string;
  };
  clientNotes: string;
  applicationId: { coverLetter: string };
  documents?: Array<{
    format: string;
    originalName: string;
    publicId: string;
    resourceType: string;
    size: number;
    uploadedAt: string;
    url: string;
    _id: string;
  }>;
}

interface ProposalModalProps {
  hiringOffer: HiringDocument;
  contractSigned: boolean;
  onClose: () => void;
  updateContractSigned: (value: boolean) => void;
}

const SignContractModal = ({ hiringOffer, contractSigned, onClose, updateContractSigned }: ProposalModalProps) => {
  
  const { userId } = useAuthStore();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const signContract = async () => {
    if (!hiringOffer._id) {
      toast.error('Hiring offer ID is missing.');
      return;
    }
    const contractorId = userId;
    const success = await contractorSignHiringOffer(hiringOffer._id, contractorId);
    if (success) {
      updateContractSigned(true);
    }
  };

  const openDocumentInNewTab = (docUrl: string) => {
    window.open(docUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    console.log(hiringOffer);
  }, [hiringOffer]);

  return (
    <section 
      className='fixed top-0 left-0 w-full h-screen p-6 flex items-center justify-center bg-black/50 bg-opacity-50 z-50'
      onClick={handleBackdropClick}
    >
      <div className='p-6 rounded-lg bg-white w-full max-w-2xl h-[80vh] overflow-y-auto shadow-xl relative flex flex-col justify-between'>
        {hiringOffer && (
          <>
            <div className='flex items-center justify-center mb-7.5'>
              <Logo />
            </div>
            
            <section className='w-full h-6/10 overflow-y-auto'>
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Job Details</h3>
                  <p className="mt-2 text-sm">{hiringOffer?.jobId?.description ?? ""}</p>
                </div>
                
                <div className="p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Offer Terms</h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="text-sm">Rate:</span> ${hiringOffer?.offerDetails?.rate ?? ""}/{hiringOffer?.offerDetails?.paymentType ?? ""}</p>
                    <p><span className="text-sm">Employment Type:</span> {hiringOffer?.offerDetails?.employmentType ?? ""}</p>
                    <p><span className="text-sm">Start Date:</span> {formatDate(hiringOffer?.offerDetails?.startDate) ?? ""}</p>
                  </div>
                </div>
              </div>

              {hiringOffer?.clientNotes && (
                <div className="p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Client Notes</h3>
                  <p className="mt-2 text-sm">{hiringOffer?.clientNotes ?? ""}</p>
                </div>
              )}

              <div className="p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Your Application</h3>
                <p className="mt-2 text-sm">{hiringOffer?.applicationId?.coverLetter ?? ""}</p>
              </div>

              {hiringOffer.documents && hiringOffer.documents.length > 0 && (
                <div className="p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Attached Documents</h3>
                  {hiringOffer.documents.map((doc, index) => (
                    <button 
                      key={doc._id || index}
                      onClick={() => openDocumentInNewTab(doc.url)}
                      className="flex items-center justify-center gap-2 rounded-lg border transition transform duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 text-xs md:text-sm font-semibold border-boldblue bg-white active:scale-95 hover:shadow-lg cursor-pointer mb-2"
                    > 
                      <img 
                        src="/assets/documents_logo.svg" 
                        alt="document_logo" 
                        className="opacity-60"
                      />
                      <span className="h-fit w-fit">
                        {doc.originalName || "Attached Document"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <div className="flex justify-end space-x-4 pt-4">
              <button 
                className="px-5 py-2.75 border border-boldblue rounded-md hover:bg-gray-50 transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer text-sm text-boldblue font-semibold"
                onClick={onClose}
              >
                Close
              </button>
              {!contractSigned ? (
                <button 
                  className="px-5 py-2.75 bg-boldblue rounded-md transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer text-sm text-white font-semibold"
                  onClick={() => {
                    toast.success('Signed successfully!');
                    signContract();
                  }}
                >
                  Sign Contract
                </button>
              ) : (
                <button 
                  disabled
                  className="px-5 py-2.75 bg-aquagreen opacity-70 rounded-md transition transform active:scale-95 duration-300 ease-in-out cursor-not-allowed text-sm text-white font-semibold"
                >
                  Signed
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SignContractModal;