import React from 'react';
import { PaymentIcon } from 'react-svg-credit-card-payment-icons';

type PaymentType =
  | "Alipay"
  | "Amex"
  | "Code"
  | "CodeFront"
  | "Diners"
  | "Discover"
  | "Elo"
  | "Generic"
  | "Hiper"
  | "Hipercard"
  | "Jcb"
  | "Maestro"
  | "Mastercard"
  | "Mir"
  | "Paypal"
  | "Unionpay"
  | "Visa";

const CreditCardIcon = ({ brand }: { brand: PaymentType }) => {
  
    return (
    <PaymentIcon type={brand} format="flatRounded" width={50} />
  );
};

export default CreditCardIcon;