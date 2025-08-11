import React from 'react';

type BenefitItem = {
  icon: React.ReactNode
  title: string
  description: string
  stat: string
  statColor: string
}

interface AdditionalBenefitsProps {
  benefitsData: BenefitItem[]
}

const AdditionalBenefits = ({ benefitsData }: AdditionalBenefitsProps) => {
  return (
    <div className="mt-20 w-full">
      <h3 className="text-3xl text-center font-bold text-boldblue/90 mb-4">
        Why Choose Premium?
      </h3>
      <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
        Unlock advanced features and prioritized access to take your experience to the next level
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {benefitsData.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
          >
            <h4 className="font-semibold text-gray-500 mb-4 text-lg">{item.title}</h4>
            <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>
            <div className={`flex items-center space-x-2 text-sm font-medium`}>
              <div className={`w-2 h-2 rounded-full ${item.statColor}`}></div>
              <span>{item.stat}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdditionalBenefits
