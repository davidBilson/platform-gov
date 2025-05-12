// ClientContracts.tsx
import { useEffect, useState } from 'react';
import ActiveContracts from './_activeContracts';
import CompletedContracts from './_completedContracts';
import InactiveContracts from './_inactiveContracts';
import { getClientHiringOffers } from '@/api/hiring';
import useAuthStore from '@/store/useAuth';
import LoadingAnimation from '@/components/ui/loading';

const ClientContracts = () => {
  const { userId } = useAuthStore();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const clientOffers = await getClientHiringOffers(userId);
        if (clientOffers) {
          setOffers(clientOffers);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [userId]);

  const activeOffers = offers.filter(offer => 
    ['offered', 'accepted'].includes(offer.status)
  );

  const inactiveOffers = offers.filter(offer => 
    ['declined', 'withdrawn'].includes(offer.status)
  );

  if (loading) {
    return <div className='flex items-center justify-center h-[60vh]'><LoadingAnimation /></div>
  }

  return (
    <>
      <ActiveContracts offers={activeOffers} />
      <InactiveContracts offers={inactiveOffers} />
      <CompletedContracts />
    </>
  );
};

export default ClientContracts;