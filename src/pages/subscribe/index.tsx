'use client';

import AdditionalBenefits from '@/components/subscription/additional-benefits'
import SubscriptionFaq from '@/components/subscription/faq-section'
import SubscriptionHeader from '@/components/subscription/header'
import SubscriptionPricing from '@/components/subscription/pricing'
import useSubscription from '@/hooks/useSubscription'
import useAuthStore from '@/store/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SubscriptionDetails from './_subscriptionDetails'

// Import content based on role
import { clientPricingContent, consultantPricingContent } from '@/utils/subscription/pricingTierContent'
import { clientHeaderContent, consultantHeaderContent } from '@/utils/subscription/headerContent';
import { clientBenefits, consultantBenefits } from '@/utils/subscription/additionalBenefitsContent';
import { clientFaqs, consultantFaqs } from '@/utils/subscription/faqContent';

const SubscribeInterface = () => {
    const { role, userId } = useAuthStore()
    const router = useRouter();
    
    const {
        subscriptionData,
        isSubscribed,
        hasActiveSubscription,
        refetch
    } = useSubscription();

    useEffect(() => {
        if (!userId) {
            router.replace('/login')
        }
    }, [userId, role, router])

    if (!userId) return null

    // Get content based on role
    const getContentByRole = () => {
        if (role === 'contractor') {
            return {
                headerContent: consultantHeaderContent,
                pricingContent: consultantPricingContent,
                benefits: consultantBenefits,
                faqs: consultantFaqs
            }
        } else if (role === 'client') {
            return {
                headerContent: clientHeaderContent,
                pricingContent: clientPricingContent,
                benefits: clientBenefits,
                faqs: clientFaqs
            }
        }
        return null;
    }

    const content = getContentByRole();
    
    // If role is not recognized, return null
    if (!content) return null;

    // Prepare subscription details data
    const subscriptionDetailsData = {
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
    };

    return (
        <section className="min-h-screen bg-white pt-12 pb-30 px-4">
            {isSubscribed ? (
                <SubscriptionDetails onSubscriptionUpdate={refetch} subscriptionData={subscriptionDetailsData} />
            ) : (
                <div className="max-w-7xl mx-auto">
                    <SubscriptionHeader 
                        title={content.headerContent.title} 
                        subtitle={content.headerContent.subtitle} 
                       />
                    <SubscriptionPricing pricingContent={content.pricingContent} />
                    <AdditionalBenefits benefitsData={content.benefits} />
                    <SubscriptionFaq faqs={content.faqs} />
                </div>
            )}
        </section>
    )
}

export default SubscribeInterface