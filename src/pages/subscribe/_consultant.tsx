import AdditionalBenefits from '@/components/subscription/additional-benefits'
import SubscriptionFaq from '@/components/subscription/faq-section'
import SubscriptionHeader from '@/components/subscription/header'
import SubscriptionPricing from '@/components/subscription/pricing'
import { consultantBenefits } from '@/utils/subscription/additionalBenefitsContent'
import { consultantFaqs } from '@/utils/subscription/faqContent'
import { consultantHeaderContent } from '@/utils/subscription/headerContent'
import { consultantPricingContent } from '@/utils/subscription/pricingTierContent'

import React from 'react'

const ConsultantSubscriptionInterface = () => {
  return (
    <div className="min-h-screen bg-white pt-12 pb-30 px-4">
      <div className="max-w-7xl mx-auto">
        <SubscriptionHeader
          title={consultantHeaderContent.title}
          subtitle={consultantHeaderContent.subtitle}
        />
        <SubscriptionPricing
          pricingContent={consultantPricingContent}
        />
        <AdditionalBenefits benefitsData={consultantBenefits} />
        <SubscriptionFaq faqs={consultantFaqs} />
      </div>
    </div>
  )
}

export default ConsultantSubscriptionInterface