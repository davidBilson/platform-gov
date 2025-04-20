import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";

interface LegalAgreementProps {
  setShowLegalAgreement: (showLegalAgreement: boolean) => void;
  setAcceptedLegalAgreement: (acceptedLegalAgreement: boolean) => void;
  acceptedLegalAgreement: boolean;
}

const Legalagreement = ({setShowLegalAgreement, acceptedLegalAgreement, setAcceptedLegalAgreement } : LegalAgreementProps) => {

  const closeModal = () => {
    if (!acceptedLegalAgreement) {
      return;
    }
    setShowLegalAgreement(false);
  }


  return (
    <section className='fixed top-0 left-0 w-full min-h-screen z-50 bg-black/50 flex items-center justify-center p-6'>
      <div className='w-full max-w-158 p-7.5 bg-white rounded-sm'>
        {/* <h1 className='mb-7.5 font-semibold text-xl'>Hire Contractor</h1> */}
        <h2 className='mb-7.5 font-bold'>Legal Agreement</h2>

        <div className='mb-7.5 p-7.5 border border-boldblue rounded-lg'>
          <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, excepturi! Ut facere aperiam voluptates exercitationem repellat quaerat, reprehenderit, similique voluptatem explicabo esse vel libero accusamus blanditiis debitis repellendus qui quasi omnis praesentium mollitia voluptate. Voluptates qui eos ad et sunt provident totam corrupti. Delectus voluptatibus tempore temporibus, nam nulla maxime!
          </p>
        </div>

        <div className='mb-7.5 text-sm flex items-center gap-12.5'>

          {/* I accept terms */}
          <label className='flex items-center gap-1 cursor-pointer'>
            <input
              type='checkbox'
              checked={acceptedLegalAgreement}
              onChange={() => setAcceptedLegalAgreement(!acceptedLegalAgreement)}
              className='hidden'
              />
            <span className='w-4 h-4 flex items-center justify-center'>
              {acceptedLegalAgreement ? (
                <IoIosCheckmarkCircle className='text-boldblue w-4 h-4' />
              ) : (
                <MdOutlineRadioButtonUnchecked className='text-boldblue w-4 h-4' />
              )}
            </span>
            I accept GovLink {"Global's"} commission terms
          </label>
        </div>

        <div className='flex items-center justify-center gap-2.5'>
          {/* <button className='bg-white text-boldblue border border-boldblue py-2.5 px-5 font-semibold rounded-lg'>Back</button> */}
          <button 
            onClick={closeModal}
            className='bg-white text-boldblue border border-boldblue py-2.5 px-5 font-semibold rounded-lg cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out'
          >
            Cancel
          </button>

          <button
            className='bg-boldblue text-white border border-boldblue py-2.5 px-5 font-semibold rounded-lg cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out disabled:cursor-not-allowed'
            disabled={!(acceptedLegalAgreement)}
            onClick={closeModal}
          >
            Continue
            {/* Send Contract  */}
          </button>

        </div>
      </div>
    </section>
  );
};

export default Legalagreement;
