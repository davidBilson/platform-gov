import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ApplicationDraft {
  jobId: string;
  coverLetter: string;
  proposedRate: string;
  acknowledgment: boolean;
}

interface DraftsStore {
  drafts: Record<string, ApplicationDraft>;
  saveDraft: (draft: ApplicationDraft) => void;
  deleteDraft: (jobId: string) => void;
  getDraftByJobId: (jobId: string) => ApplicationDraft | null;
}

const useApplicationDraftsStore = create<DraftsStore>()(
  persist(
    (set, get) => ({
      drafts: {},
      
      saveDraft: (draft: ApplicationDraft) => {
        set((state) => ({
          drafts: {
            ...state.drafts,
            [draft.jobId]: draft,
          },
        }));
      },
      
      deleteDraft: (jobId: string) => {
        set((state) => {
          const newDrafts = { ...state.drafts };
          delete newDrafts[jobId];
          return { drafts: newDrafts };
        });
      },
      
      getDraftByJobId: (jobId: string) => {
        const { drafts } = get();
        return drafts[jobId] || null;
      },
    }),
    {
      name: 'job-application-drafts',
    }
  )
);

export default useApplicationDraftsStore;