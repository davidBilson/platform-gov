import React, { useState } from 'react'
import { Check, Star, Crown, FileText, Clock, Award, MessageCircle, Briefcase, Headphones, X } from 'lucide-react';
import { PricingContent } from '@/types/subscription';
import { useRouter } from 'next/router';
import useSubscriptionPrices from '@/hooks/useSubscriptionPrices';

const SubscriptionPricing = ({ pricingContent }: { pricingContent: PricingContent }) => {

  const router = useRouter();
  const { subscriptionPrices } = useSubscriptionPrices();
  const [isAnnual, setIsAnnual] = useState(false);

  const handleSubscribe = (tier: string) => {
    if (tier === 'premium') {

      router.push(`/payment/subscription-checkout?plan=${isAnnual ? 'annual' : 'monthly'}`);
    } else {
      router.push('/')
    }
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Check,
      Star,
      Crown,
      FileText,
      Clock,
      Award,
      MessageCircle,
      Briefcase,
      Headphones,
      X
    };
    return icons[iconName] || Check;
  };

  const renderFeature = (feature: { icon: string; additionalIcon: string; included: any; text: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => {
    const IconComponent = getIcon(feature.icon);
    const AdditionalIconComponent = feature.additionalIcon ? getIcon(feature.additionalIcon) : null;

    if (!feature.included) {
      return (
        <li key={index} className="flex items-start opacity-50">
          <div className="w-6 h-6 border-2 border-gray-400 rounded mt-1 mr-4 flex-shrink-0"></div>
          <span className="text-gray-500 line-through text-lg">{feature.text}</span>
        </li>
      );
    }

    return (
      <li key={index} className="flex items-start">
        <IconComponent className="w-6 h-6 text-emerald-500 mt-1 mr-4 flex-shrink-0" />
        <div className="flex items-center">
          <span className="text-gray-900 text-lg">{feature.text}</span>
          {AdditionalIconComponent && (
            <AdditionalIconComponent className="w-5 h-5 text-aquagreen ml-3" />
          )}
        </div>
      </li>
    );
  };

  return (
    <>
      {/* Pricing Toggle */}
      <div className="flex justify-center mb-16">
        <div className="bg-gray-100 rounded-full p-1 border border-gray-200">
          <div className="flex items-center">
            <button
              onClick={() => setIsAnnual(false)}
              className={`cursor-pointer px-10 py-4 rounded-full font-medium transition-all duration-300 ${!isAnnual
                ? 'bg-white text-boldblue shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`cursor-pointer px-10 py-4 rounded-full font-medium transition-all duration-300 relative ${isAnnual
                ? 'bg-white text-boldblue shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Annual
              <span className="absolute -top-4 -right-2 text-red-500 text-xs px-2 py-1 bg-red-50 rounded-full font-bold border border-red-200">
                Save {(
                    ((subscriptionPrices.monthly * 12 - subscriptionPrices.annual) /
                      (subscriptionPrices.monthly * 12) * 100)
                  ).toFixed(0)}%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
        {/* Free Tier */}
        <div className="flex flex-col justify-between bg-white md:min-h-205 rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300">
          <div className="p-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-gray-900">{pricingContent.freeTier.title}</h3>
              <div className="p-4 bg-gray-100 rounded-2xl">
                <Star className="w-8 h-8 text-gray-600" />
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline mb-3">
                <span className="text-5xl font-bold text-boldblue">$0</span>
                <span className="text-gray-500 ml-3 text-lg">/month</span>
              </div>
              <p className="text-gray-600 text-lg">{pricingContent.freeTier.description}</p>
            </div>

            <ul className="space-y-6 mb-12">
              {pricingContent.freeTier.features.map((feature: any, index: any) =>
                renderFeature(feature, index)
              )}
            </ul>
          </div>

          <div className="p-12">
            <button
              onClick={() => handleSubscribe('free')}
              className="cursor-pointer w-full py-5 px-8 border-2 border-boldblue text-boldblue font-semibold rounded-2xl hover:bg-boldblue hover:text-white transition-all duration-300 text-lg"
            >
              {pricingContent.freeTier.buttonText}
            </button>
          </div>
        </div>

        {/* Premium Tier */}
        <div className="flex flex-col justify-between md:min-h-205 bg-gradient-to-br from-blue-50 via-white to-emerald-50 rounded-3xl shadow-lg border border-blue-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-300 relative">
          {/* Popular Badge */}
          {pricingContent.premiumTier.badge && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-boldblue to-aquagreen text-white px-6 py-3 text-sm font-semibold rounded-bl-2xl">
              {pricingContent.premiumTier.badge}
            </div>
          )}

          <div className="p-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-gray-900">{pricingContent.premiumTier.title}</h3>
              <div className="p-4 bg-gradient-to-br from-boldblue to-aquagreen rounded-2xl shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline mb-3">
                <span className="text-5xl font-bold bg-gradient-to-r from-boldblue to-aquagreen bg-clip-text text-transparent">
                  ${isAnnual ? subscriptionPrices.annual : subscriptionPrices.monthly}
                </span>
                <span className="text-gray-500 ml-3 text-lg">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              {isAnnual && (
                <p className="text-emerald-600 font-semibold mt-2 text-lg">
                  Save {(
                    ((subscriptionPrices.monthly * 12 - subscriptionPrices.annual) /
                      (subscriptionPrices.monthly * 12) * 100)
                  ).toFixed(0)}%
                </p>
              )}
              <p className="text-gray-600 text-lg mt-2">{pricingContent.premiumTier.description}</p>
            </div>

            <ul className="space-y-6 mb-12">
              {pricingContent.premiumTier.features.map((feature: any, index: any) =>
                renderFeature(feature, index)
              )}
            </ul>
          </div>

          <div className="p-12">
            <button
              onClick={() => handleSubscribe('premium')}
              className="cursor-pointer w-full py-5 px-8 bg-gradient-to-r from-boldblue to-aquagreen hover:to-boldblue hover:from-aquagreen text-white font-semibold rounded-2xl  transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
            >
              {pricingContent.premiumTier.buttonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPricing;