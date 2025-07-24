import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default

  const faqs = [
    {
      question: "How quickly can I expect to see results?",
      answer: "Most clients begin seeing measurable improvements within 2-4 weeks of implementation. However, significant growth typically becomes evident after 6-8 weeks as our strategies gain momentum and data-driven optimizations take effect."
    },
    {
      question: "What makes your approach different from other agencies?",
      answer: "We focus on data-driven strategies tailored specifically to your business goals. Unlike one-size-fits-all approaches, we conduct thorough analysis of your market, competitors, and audience to create custom solutions that deliver measurable ROI."
    },
    {
      question: "Do you work with businesses in my industry?",
      answer: "We work across various industries including technology, healthcare, finance, e-commerce, and professional services. Our methodology adapts to any sector, focusing on understanding your unique market dynamics and customer behavior patterns."
    },
    {
      question: "What's included in your service packages?",
      answer: "Our packages typically include strategic planning, implementation, performance monitoring, regular reporting, and ongoing optimization. We also provide dedicated account management and monthly strategy sessions to ensure continuous improvement."
    },
    {
      question: "How do you measure success and ROI?",
      answer: "We establish clear KPIs at the project start, including conversion rates, lead quality, revenue growth, and cost per acquisition. You'll receive detailed monthly reports showing progress against these metrics with full transparency on performance and spend."
    },
    {
      question: "What if I'm not satisfied with the results?",
      answer: "We're committed to your success. If you're not seeing the agreed-upon results within the first 90 days, we'll work with you to adjust the strategy at no additional cost. We also offer flexible contract terms to ensure you're completely satisfied."
    }
  ];

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-4xl font-semibold text-darkgray mb-4">
            Frequently Asked {' '}
            <span className="text-boldblue bg-clip-text">
              Questions
            </span>
          </h2>
          <p className="text-darkgray max-w-2xl mx-auto">
            Everything you need to know about our services and process
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openItems.has(index);
            
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none transition-colors duration-200 hover:bg-boldblue/10 cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </h3>
                  
                  {/* Toggle Icon */}
                  <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-boldblue" strokeWidth={2} />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400" strokeWidth={2} />
                    )}
                  </div>
                </button>

                {/* Answer Content */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-8 pb-6">
                    <div className="h-px bg-gray-100 mb-6"></div>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        
      </div>
    </section>
  );
};

export default FAQ;