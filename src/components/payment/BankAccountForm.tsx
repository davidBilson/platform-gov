import React from 'react';
import { AuBankAccountElement } from '@stripe/react-stripe-js';

interface BankAccountFormProps {
  error?: string;
  loading: boolean;
}

export const BankAccountForm = ({ error, loading }: BankAccountFormProps) => (
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Bank Account Information
      </label>
      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <AuBankAccountElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
                backgroundColor: '#ffffff',
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Your bank details are securely processed by Stripe
      </p>
    </div>

    {error && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )}
    
    <button
      type="submit"
      disabled={loading}
      className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-deepskyblue hover:deepskyblue/70 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-boldblue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {loading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving Bank Account...
        </div>
      ) : (
        'Save Bank Account'
      )}
    </button>
  </form>
);