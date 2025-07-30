import React, { useState, useEffect } from 'react';
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { getLegalContentByDocumentType } from '@/api/legal-content-api';

interface LegalAgreementProps {
  setShowLegalAgreement: (showLegalAgreement: boolean) => void;
  setAcceptedLegalAgreement: (acceptedLegalAgreement: boolean) => void;
  acceptedLegalAgreement: boolean;
}

const Legalagreement = ({setShowLegalAgreement, acceptedLegalAgreement, setAcceptedLegalAgreement }: LegalAgreementProps) => {
  const [legalContent, setLegalContent] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLegalContent();
  }, []);

  const loadLegalContent = async () => {
    setLoading(true);
    try {
      const response = await getLegalContentByDocumentType('legal-agreement');
      if (response?.success && response?.data) {
        setLegalContent({
          title: response.data.title || 'Legal Agreement',
          description: response.data.description || 'No legal agreement content available.'
        });
      } else {
        // Fallback content if API fails
        setLegalContent({
          title: 'Legal Agreement',
          description: 'Legal agreement content is currently unavailable. Please try again later.'
        });
      }
    } catch (error) {
      console.error('Error loading legal content:', error);
      // Fallback content on error
      setLegalContent({
        title: 'Legal Agreement',
        description: 'Legal agreement content is currently unavailable. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (!acceptedLegalAgreement) {
      return;
    }
    setShowLegalAgreement(false);
  }

  const cancelLegalAgreement = () => {
    setShowLegalAgreement(false);
  }

  return (
    <section className='fixed top-0 left-0 w-full min-h-screen z-50 bg-black/50 flex items-center justify-center p-6'>
      <div className='w-full max-w-158 h-fit overflow-hidden p-6 md:p-7.5 bg-white rounded-sm'>

        <h2 className='h-[5%] pb-7.5 font-bold'>
          {loading ? (
            <div className="h-3 bg-gray-200 rounded animate-pulse w-48"></div>
          ) : (
            legalContent.title
          )}
        </h2>

        <div className='h-[60vh] p-4 md:p-7.5 agreementPrompts-scrollbar overflow-y-auto border border-boldblue rounded-lg'>
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {legalContent.description}
            </div>
          )}
        </div>

        <div className='py-7.5  text-sm flex items-center gap-12.5'>
          {/* I accept terms */}
          <label className='flex items-center gap-1 cursor-pointer'>
            <input
              type='checkbox'
              checked={acceptedLegalAgreement}
              onChange={() => setAcceptedLegalAgreement(!acceptedLegalAgreement)}
              className='hidden'
              disabled={loading}
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
          <button 
            onClick={cancelLegalAgreement}
            disabled={loading}
            className='bg-white text-boldblue border border-boldblue py-2.5 px-5 font-semibold rounded-lg cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Cancel
          </button>

          <button
            className={`bg-boldblue text-white border border-boldblue py-2.5 px-5 font-semibold rounded-lg cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed`}
            disabled={!(acceptedLegalAgreement) || loading}
            onClick={closeModal}
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
};

export default Legalagreement;