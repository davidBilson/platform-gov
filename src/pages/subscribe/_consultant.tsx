import AdditionalBenefits from '@/components/subscription/additional-benefits'
import SubscriptionFaq from '@/components/subscription/faq-section'
import SubscriptionHeader from '@/components/subscription/header'
import SubscriptionPricing from '@/components/subscription/pricing'
import useSubscription from '@/hooks/useSubscription'
import { consultantBenefits } from '@/utils/subscription/additionalBenefitsContent'
import { consultantFaqs } from '@/utils/subscription/faqContent'
import { consultantHeaderContent } from '@/utils/subscription/headerContent'
import { consultantPricingContent } from '@/utils/subscription/pricingTierContent'
import SubscriptionDetails from './_subscriptionDetails'


const ConsultantSubscriptionInterface = () => {

  const {
    subscriptionData,
    isSubscribed,
    hasActiveSubscription
  } = useSubscription();

  return (
    <section className="min-h-screen bg-white pt-12 pb-30 px-4">
      {isSubscribed ? (
        <SubscriptionDetails subscriptionData={{
          user: subscriptionData?.user,
          subscription: subscriptionData?.subscription,
          flags: subscriptionData?.flags,
          isSubscribed,
          isPremium: subscriptionData?.isPremium,
          hasActiveSubscription,
          canAccessPremiumFeatures: subscriptionData?.flags?.canAccessPremiumFeatures,
          isSubscriptionActive: subscriptionData?.subscription?.status === 'active',
          isSubscriptionCancelled: subscriptionData?.subscription?.status === 'cancelled',
          planName: subscriptionData?.subscription?.planName,
          daysRemaining: subscriptionData?.subscription?.daysRemaining,
        }} />
      ) :
        (
          <div className="max-w-7xl mx-auto">
            <SubscriptionHeader title={consultantHeaderContent.title} subtitle={consultantHeaderContent.subtitle} />
            <SubscriptionPricing pricingContent={consultantPricingContent} />
            <AdditionalBenefits benefitsData={consultantBenefits} />
            <SubscriptionFaq faqs={consultantFaqs} />
          </div>
        )
      }
    </section>
  )
}

export default ConsultantSubscriptionInterface