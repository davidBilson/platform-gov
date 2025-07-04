// useAdmin.ts
import { create } from 'zustand';

interface AdminState {
  activeComponent: string;
  activeTitle: string;
  setActiveComponent: (component: string) => void;
  setActiveTitle: (title: string) => void;
}

const useAdminStore = create<AdminState>((set) => ({
  activeComponent: 'dashboard',
  activeTitle: 'Dashboard',
  setActiveComponent: (component: string) => {
    const titleMap: Record<string, string> = {
      dashboard: 'Dashboard',
      users: 'Users Management',
      contracts: 'Contracts Management',
      jobs: 'Jobs Management',
      contents: 'Contents Management',
      'fee-settings': 'Fee Settings'
    };
    
    set({ 
      activeComponent: component,
      activeTitle: titleMap[component] || 'GovLink Global'
    });
  },
  setActiveTitle: (title: string) => set({ activeTitle: title })
}));

export default useAdminStore;