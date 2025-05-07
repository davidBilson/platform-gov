import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface HireState {
  jobId: string | null;
  contractorId: string | null;
  applicationId: string | null;
  contractorName: string | null;
  contractorProfilePicture: string;
  setHireData: (data: {
    jobId: string;
    contractorId: string;
    applicationId: string;
    contractorName: string;
    contractorProfilePicture: string;
  }) => void;
  clearHireData: () => void;
}

export const useHire = create<HireState>()(
  persist(
    (set) => ({
      jobId: null,
      contractorId: null,
      applicationId: null,
      contractorName: null,
      contractorProfilePicture: '',
      setHireData: (data) => set({
        jobId: data.jobId,
        contractorId: data.contractorId,
        applicationId: data.applicationId,
        contractorName: data.contractorName,
        contractorProfilePicture: data.contractorProfilePicture
      }),
      clearHireData: () => set({
        jobId: null,
        contractorId: null,
        applicationId: null,
        contractorName: null,
        contractorProfilePicture: ''
      })
    }),
    {
      name: 'hire-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({ 
        jobId: state.jobId,
        contractorId: state.contractorId,
        applicationId: state.applicationId,
        contractorName: state.contractorName,
        contractorProfilePicture: state.contractorProfilePicture
      }), // persist all relevant fields
    }
  )
);