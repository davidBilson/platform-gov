
export interface SavePaymentMethodRequest {
    jobId?: string;
    token: string;
    userId: string;
}

export interface PaymentMethodInfo {
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
}

export interface SavePaymentMethodResponse {
    success: boolean;
    message: string;
    data?: {
      transactionId: string;
      customerId: string;
      paymentMethodId: string;
      cardLast4: string;
      cardBrand: string;
      cardExpMonth: number;
      cardExpYear: number;
    };
    error?: string;
}

export interface GetPaymentMethodsResponse {
    success: boolean;
    paymentMethods: PaymentMethodInfo[];
    defaultPaymentMethod: string | null;
    message?: string;
}

export interface TransactionSummary {
    totalReceived: number;
    totalWithdrawn: number;
    totalFees: number;
    totalRefunds: number;
    totalDisputes: number;
  }

export type TransactionType = 'payment_method_added' | 'project_funding' | 'payout' | 'refund' | 'dispute';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
export type PaymentMethod = 'card' | 'bank_account' | 'paypal';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  jobTitle?: string | null;
  jobId?: string | null;
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  stripeCustomerId?: string;
  stripePayoutId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string | Date;
  updatedAt: string | Date;
}
export interface Summary {
  totalReceived: number;
  totalWithdrawn: number;
  totalRefunds: number;
  totalDisputes: number;
}

export interface PaymentHistoryData {
  transactions: Transaction[];
  summary: Summary;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface PaymentHistoryResponse {
    success: boolean;
    data: {
      transactions: Transaction[];
      summary: TransactionSummary;
      pagination: {
        currentPage: number;
        totalPages: number;
        totalTransactions: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        limit: number;
      };
    };
    message: string;
}

export interface PaymentHistoryParams {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}