import React, { useState } from 'react'

type FaqItem = {
  question: string
  answer: string
}

interface SubscriptionFaqProps {
  faqs: FaqItem[]
}

const SubscriptionFaq = ({ faqs }: SubscriptionFaqProps) => {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <div className="mt-20 rounded-2xl max-w-full mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleFaq(index)}
              className="cursor-pointer w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <h4 className="font-semibold text-gray-900">{faq.question}</h4>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 pt-0">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionFaq
