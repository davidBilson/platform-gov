// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      // User info
      userType: 'contractor',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      userId: null,
      
      // Verification status
      isEmailVerified: false,
      isPhoneVerified: false,
      
      // Current verification code input
      verificationCode: '',
      
      // Verification step: 'email', 'phone', 'completed'
      verificationStep: 'email',
      
      // Error handling
      error: null,
      
      // Set form data
      setFormData: (data) => set((state) => ({
        ...state,
        ...data
      })),
      
      // Set user ID after initial registration
      setUserId: (userId) => set({ userId }),
      
      // Set verification step
      setVerificationStep: (step) => set({ verificationStep: step }),
      
      // Set verification code input
      setVerificationCode: (code) => set({ verificationCode: code }),
      
      // Set email verification status
      setEmailVerified: (status) => set({ 
        isEmailVerified: status,
        verificationStep: status ? 'phone' : 'email'
      }),
      
      // Set phone verification status
      setPhoneVerified: (status) => set({ 
        isPhoneVerified: status,
        verificationStep: status ? 'completed' : 'phone'
      }),
      
      // Set error
      setError: (error) => set({ error }),
      
      // Reset error
      resetError: () => set({ error: null }),
      
      // Reset all data
      resetAll: () => set({
        userType: 'contractor',
        firstName: '',
        lastName: '',
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
        // Only persist these fields
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