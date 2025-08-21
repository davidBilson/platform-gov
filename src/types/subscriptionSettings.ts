export interface SubscriptionPricing {
    consultant: {
      monthly: number;
      annual: number;
    };
    client: {
      monthly: number;
      annual: number;
    };
  }
  
  export interface GccDiscount {
    token: string;
    percentOff: number;
  }
  
  export interface Settings {
    subscriptionPricing: SubscriptionPricing;
    gccDiscount: GccDiscount;
    adminFeePercent: number;
    tips: string;
    earlyAccessDurationHours: number;
  }
  
  export type EditSection = 'consultantPricing' | 'clientPricing' | 'gccDiscount' | 'adminFee' | 'tips' | 'earlyAccess';
  
  export interface EditValues {
    consultantMonthly?: string;
    consultantAnnual?: string;
    clientMonthly?: string;
    clientAnnual?: string;
    gccToken?: string;
    gccPercent?: string;
    adminFee?: string;
    tips?: string;
    earlyAccess?: string;
  }
  
  export interface EditStates {
    [key: string]: boolean;
  }
  
  export interface ValidationErrors {
    [key: string]: string;
  }
  