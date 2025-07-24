import React from 'react'

const CTA = () => {
    return (
        <section className='flex items-center justify-center pt-12 pb-24 px-4'>
            <div className="w-full max-w-6xl bg-gradient-to-t from-boldblue to-deepskyblue p-6 md:p-12 rounded-4xl mx-auto text-center">
                <h2 className="text-xl md:text-4xl font-bold text-white mb-4">
                    Find your next hire
                </h2>

                {/* Description */}
                <p className="md:text-lg text-white/70 mb-6 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of teams already transforming their workflow. Start your journey today.
                </p>

                {/* CTA Button */}
                <button className="group cursor-pointer relative inline-flex items-center px-6 py-4 bg-white text-boldblue font-semibold md:text-lg rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-boldblue/0 group-hover:bg-boldblue/10 transition-colors duration-300"></div>
                    <span className="relative">Hire a Consultant</span>
                </button>

                {/* Trust indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center mt-10 space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-lightblue">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-aquagreen" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Swift Hiring Process
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-aquagreen" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Secure Escrow
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-aquagreen" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7-293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Secure Messaging System
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA