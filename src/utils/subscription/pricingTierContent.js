// Client Pricing Content
export const clientPricingContent = {
    freeTier: {
      title: "Free Tier",
      price: {
        monthly: 0,
        annual: 0
      },
      description: "Perfect to get started",
      features: [
        {
          included: true,
          text: "Can register on the platform",
          icon: "Check"
        },
        {
          included: true,
          text: "View consultant first name + last initial",
          icon: "Check"
        },
        {
          included: false,
          text: "Message consultants directly",
          icon: "X"
        },
        {
          included: false,
          text: "Post job opportunities",
          icon: "X"
        }
      ],
      buttonText: "Get Started Free",
      buttonStyle: "outline"
    },
    premiumTier: {
      title: "Premium Tier",
      price: {
        monthly: 25,
        annual: 240
      },
      description: "Full access to hire top consultants",
      savings: "Save 20%",
      savingsPercentage: "20%",
      features: [
        {
          included: true,
          text: "Full access to consultant profiles",
          icon: "Check"
        },
        {
          included: true,
          text: "Direct messaging with consultants",
          icon: "Check",
          additionalIcon: "MessageCircle"
        },
        {
          included: true,
          text: "Post and manage job opportunities",
          icon: "Check",
          additionalIcon: "Briefcase"
        },
        {
          included: true,
          text: "Priority customer support",
          icon: "Check",
          additionalIcon: "Headphones"
        }
      ],
      buttonText: "Subscribe Now",
      buttonStyle: "gradient",
      badge: "Most Popular"
    }
  };
  
  // Consultant Pricing Content
  export const consultantPricingContent = {
    freeTier: {
      title: "Free Tier",
      price: {
        monthly: 0,
        annual: 0
      },
      description: "Perfect to get started",
      features: [
        {
          included: true,
          text: "Basic profile listing",
          icon: "Check"
        },
        {
          included: true,
          text: "Limited 300-character bio",
          icon: "Check"
        },
        {
          included: false,
          text: "Access to Contract Wizard",
          icon: "X"
        },
        {
          included: false,
          text: "Early job access",
          icon: "X"
        }
      ],
      buttonText: "Get Started Free",
      buttonStyle: "outline"
    },
    premiumTier: {
      title: "Premium Tier",
      price: {
        monthly: 12,
        annual: 99
      },
      description: "Everything you need to succeed",
      savings: "Save 31%",
      savingsPercentage: "31%",
      features: [
        {
          included: true,
          text: "Priority listing with premium badge",
          icon: "Check"
        },
        {
          included: true,
          text: "Full 1500-character bio",
          icon: "Check"
        },
        {
          included: true,
          text: "Access to Contract Wizard",
          icon: "Check",
          additionalIcon: "FileText"
        },
        {
          included: true,
          text: "Early access to jobs",
          icon: "Check",
          additionalIcon: "Clock"
        },
        {
          included: true,
          text: "Discount on GCC certification",
          icon: "Check",
          additionalIcon: "Award"
        }
      ],
      buttonText: "Subscribe Now",
      buttonStyle: "gradient",
      badge: "Most Popular"
    }
  };