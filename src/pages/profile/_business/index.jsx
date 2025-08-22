import React, { useState, useEffect } from 'react';
import { IoMdImages } from "react-icons/io";
import OpenJobs from './_open-jobs';
import useAuthStore from '@/store/useAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { fetchProfile } from '@/api/profile-api';
import ProfilePicture from '@/components/profile/profilePicture';
import BankDetailsPromptModal from '@/components/ui/finance/bank-details-prompt';
// import BankDetailsLink from '@/components/ui/finance/bank-details-link';
import { EditIcon } from 'lucide-react';
import DotLoader from '@/components/ui/dotloader';

const BusinessProfile = () => {

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bankAccountAdded, setBankAccountAdded] = useState(false);
  const [showBankDetailsPrompt, setShowBankDetailsPrompt] = useState(false);
  const { userId } = useAuthStore();

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchProfile(userId, 'client');

        if (data.success && data.data) {
          setClient(data.data);
          if (data.data.user.bankAccounts && data.data.user.bankAccounts.length > 0) {
            setBankAccountAdded(true);
          } else {
            setTimeout(() => {
              setShowBankDetailsPrompt(true);
            }, 3000);
          }
        }
      } catch (err) {
        console.error('Error fetching client profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [userId]);

  useEffect(() => {
    if (!client && !loading) {
      toast.info('You are yet to create a profile!')
    }
  }, [client, loading]);

  if (loading) {
    return (
      <section className='h-screen w-full fixed top-0 left-0 z-50  flex items-center justify-end'>
        <section className='w-full h-screen  p-4 md:p-7.5 overflow-y-auto'>
          <div className='w-full max-w-275 m-auto pb-32 md:pb-64 flex items-center justify-center h-full'>
            <DotLoader />
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className='p-5 pb-20 md:p-6'>
      <section className='w-full max-w-275 m-auto'>
        <div className='mb-6'>

          <div className='flex flex-col md:flex-row gap-5 justify-between md:items-center pb-6'>

            <div className='flex items-center gap-5'>
              <div className=' rounded-full flex items-center justify-center mx-auto sm:mx-0'>
                {client && client.logo ? (
                  <ProfilePicture source={client.logo} alt={`${client.name} logo`} dimension={88} />
                ) : (
                  <IoMdImages size={40} className='text-white/70' />
                )}
              </div>

              {/* Company Name */}
              <div className='w-full sm:max-w-75 mt-4 sm:mt-0'>
                <h1 className='text-boldblue text-xl font-semibold'>
                  {client?.name || "Company Name"}
                </h1>
              </div>
            </div>

            <Link
              href="/profile/edit"
              className="cursor-pointer h-fit w-fit flex items-center  gap-2 transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 px-4 bg-boldblue text-white text-sm font-semibold rounded-lg border border-boldblue"
            >
              {client ? "Edit Profile" : "Create Profile"} <EditIcon size={15} />
            </Link>
          </div>


          {/* Company Overview */}
          <div className='mb-8 py-3.5 px-5 rounded-md border border-boldblue'>
            <p className='text-boldblue'>
              {client?.overview || "No company overview available."}
            </p>
          </div>
        </div>

        {/* Locations Section */}
        <div className='border-t border-t-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
          <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:w-full sm:max-w-[120px]'>Location</h2>

          <div className='w-full'>
            {client && client.locations && client.locations.length > 0 ? (
              client.locations.map((location, index) => (
                <div key={index} className={index > 0 ? 'mt-8 pt-4 border-t border-gray-200' : ''}>
                  {index > 0 && (
                    <h3 className="font-medium mb-2">Location {index + 1}</h3>
                  )}

                  {/* Location Details */}
                  <div className='mb-4'>
                    <p className='text-boldblue font-medium'>
                      {location.country || "Country not specified"}
                    </p>
                  </div>

                  {/* Address */}
                  <div className='mb-4'>
                    <p className='text-boldblue'>
                      {location.address1 && `${location.address1}, `}
                      {location.address2}
                    </p>
                  </div>

                  {/* City, State, ZIP */}
                  <div className='mb-4'>
                    <p className='text-boldblue'>
                      {location.city && `${location.city}, `}
                      {location.state && `${location.state} `}
                      {location.zipCode}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-boldblue italic'>No locations specified.</p>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className='border-y border-y-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
          <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:max-w-[120px]'>Information</h2>

          <div className='w-full'>
            {/* Industry */}
            <div className='mb-4'>
              <h3 className='font-medium mb-1'>Industry</h3>
              <p className='text-boldblue'>
                {client?.industry || "Not specified"}
              </p>
            </div>

            <div className='mb-4'>
              <h3 className='font-medium mb-1'>Security Clearance</h3>
              <p className='text-boldblue'>
                {client?.clearance || "Not specified"}
              </p>
            </div>
            <div className='mb-4'>
              <h3 className='font-medium mb-1'>Department / Agency</h3>
              <p className='text-boldblue'>
                {client?.department || "Not specified"}
              </p>
            </div>

            {/* Company Size */}
            <div className='mb-4'>
              <h3 className='font-medium mb-1'>Size</h3>
              <p className='text-boldblue'>
                {client?.size || "Not specified"}
              </p>
            </div>

            {/* Specializations */}
            <div className='mb-4'>
              <h3 className='font-medium mb-1'>Specializations</h3>
              <div className='flex flex-wrap gap-2'>
                {client?.specializations && client.specializations.length > 0 ? (
                  client.specializations.map((spec, index) => (
                    <div key={index} className='bg-deepskyblue text-white font-bold py-1 px-4 rounded-full'>
                      {spec}
                    </div>
                  ))
                ) : (
                  <p className='text-boldblue italic'>No specializations listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <div className='py-6'>
          <BankDetailsLink />
        </div> */}


      </section>

      <OpenJobs />
    </section>
  );
};

export default BusinessProfile;