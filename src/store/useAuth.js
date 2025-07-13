// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      role: '',
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      userId: '',
      isEmailVerified: false,
      isPhoneVerified: false,
      
      verificationCode: '',
      verificationStep: 'email',
      error: null,
      isLoading: true,
      setIsLoading: (loading) => set({ isLoading: loading }),

      initAuth: () => {
        const storedUserId = localStorage.getItem('auth-storage')
        const parsed = storedUserId ? JSON.parse(storedUserId) : null;
        const userId = parsed?.state?.userId || null;
        set({ userId, isLoading: false });
      },

      setFormData: (data) => set((state) => ({
        ...state,
        ...data
      })),

      setUserId: (userId) => set({ userId }),

      setVerificationStep: (step) => set({ verificationStep: step }),

      setVerificationCode: (code) => set({ verificationCode: code }),

      setEmailVerified: (status) => set({ 
        isEmailVerified: status,
        verificationStep: status ? 'phone' : 'email'
      }),

      setPhoneVerified: (status) => set({ 
        isPhoneVerified: status,
        verificationStep: status ? 'completed' : 'phone'
      }),

      setError: (error) => set({ error }),

      resetError: () => set({ error: null }),

      resetAll: () => set({
        role: '',
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        userId: null,
        isEmailVerified: false,
        isPhoneVerified: false,
        verificationCode: '',
        verificationStep: 'email',
        error: null
      })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        role: state.role,
        name: state.name,
        userId: state.userId,
        email: state.email,
        phoneNumber: state.phoneNumber,
        isEmailVerified: state.isEmailVerified,
        isPhoneVerified: state.isPhoneVerified,
        verificationStep: state.verificationStep
      })
    }
  )
);

export default useAuthStore;