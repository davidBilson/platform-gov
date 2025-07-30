import React from 'react'
import Hero from '../components/_home/hero'
import HowItWorks from '@/components/_home/how-it-works'
import Reviews from '@/components/_home/reviews'
import Footer from '@/components/_home/footer'
import FAQ from '@/components/_home/faq'
import CTA from '@/components/_home/CTA'
import Explore from '@/components/_home/explore'
import useAuthStore from '@/store/useAuth'

const LandingPage = () => {

    const { userId } = useAuthStore()

    if (userId) {
        return null
    }

    return (
        <main>
            <Hero />
            <Explore />
            <HowItWorks />
            <Reviews />
            <FAQ />
            <CTA />
            <Footer />
        </main>
    )
}

export default LandingPage