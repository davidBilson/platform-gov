import React, { useEffect, useState } from 'react';
import AdminSideBar from './_sidebar';
import Dashboard from './_dashboard';
import Users from './_users';
import BankRecords from './_bankRecords';
import ManageContracts from './_contracts';
import Jobs from './_jobs';
import ContentManagement from './_contentManagement';
import Settings from './_settings';
import HelpAndSupport from './_helpAndSupport';
import useAuthStore from '@/store/useAuth';
import { useRouter } from 'next/router';
import LoadingAnimation from '@/components/ui/loading';
import FeeSettings from './_feeSettings';
import Escrow from './_escrow';
import ManageAdmins from './_manageAdmins';

const AdminHomePage = () => {

  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const { role, userId } = useAuthStore();
  const authorized = userId;
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && role && userId) {
      if (role !== 'admin' && role !== 'superadmin') {
        router.push('/');
      }
    }
  }, [role, userId, authorized, router, isLoading]);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'bank-records':
        return <BankRecords />;
      case 'contracts':
        return <ManageContracts />;
      case 'jobs':
        return <Jobs />;
      case 'contents':
        return <ContentManagement />;
      case 'settings':
        return <Settings />;
      case 'support':
        return <HelpAndSupport />;
      case 'fee-settings':
        return <FeeSettings />;
      case 'escrow':
        return <Escrow />;
      case 'admins':
        return <ManageAdmins />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return <section className='flex items-center justify-center min-h-100'>
      <LoadingAnimation />
    </section>
  }

  if (!role || !userId) {
    return <section className='flex items-center justify-center min-h-100'>
      <LoadingAnimation />
    </section>
  }

  // Fixed: Use AND (&&) instead of OR (||) for authorization check
  if (role !== 'admin' && role !== 'superadmin') {
    return <section className='flex items-center justify-center min-h-100'>
      <LoadingAnimation />
    </section>
  }

  return (
    <div className="w-full flex h-[calc(100vh-112px)]">

      <AdminSideBar setActiveComponent={setActiveComponent} />

      <div className="flex-1 p-6 overflow-y-auto">
        {renderComponent()}
      </div>
    </div>
  );
};

export default AdminHomePage;