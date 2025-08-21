import { SubscriptionHeaderProps } from '@/types/subscription';
import React from 'react';



const SubscriptionHeader = ({ title, subtitle }: SubscriptionHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-3xl md:text-5xl font-bold text-boldblue mb-4">
        {title}
      </h1>
      <p className="text-lg text-darkgray max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default SubscriptionHeader;
