
import AdditionalBenefits from '@/components/subscription/additional-benefits'
import SubscriptionFaq from '@/components/subscription/faq-section'
import SubscriptionHeader from '@/components/subscription/header'
import SubscriptionPricing from '@/components/subscription/pricing'
import { clientPricingContent } from '@/utils/subscription/pricingTierContent'
import { clientHeaderContent } from '@/utils/subscription/headerContent';
import { clientBenefits } from '@/utils/subscription/additionalBenefitsContent';
import { clientFaqs } from '@/utils/subscription/faqContent';
import useSubscription from '@/hooks/useSubscription'
import SubscriptionDetails from './_subscriptionDetails'

const ClientSubscriptionInterface = () => {

  const {
    subscriptionData,
    isSubscribed,
    hasActiveSubscription
  } = useSubscription();

  return (
    <section className="min-h-screen bg-white pt-12 pb-30 px-4">
      {/* If user is subscribed, show their subscription details */}
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
      ) : (
        /* If user is not subscribed, show subscription offers */
        <div className="max-w-7xl mx-auto">
          <SubscriptionHeader title={clientHeaderContent.title} subtitle={clientHeaderContent.subtitle} />
          <SubscriptionPricing pricingContent={clientPricingContent}/>
          <AdditionalBenefits benefitsData={clientBenefits} />
          <SubscriptionFaq faqs={clientFaqs} />
        </div>
      )}
    </section>
  )
}

export default ClientSubscriptionInterface;