import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, Calculator, MessageSquare, TrendingUp, Eye, PlusCircle, Send, ArrowRight } from 'lucide-react';

const ContractWizardAd = () => {
  const [activeTab, setActiveTab] = useState('clients');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove: (e: MouseEvent) => void = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const clientBenefits = [
    {
      id: 1,
      icon: <Eye className="w-7 h-7" />,
      title: "View & Manage Contracts",
      description: "Easily track all your active contracts and project agreements in one centralized dashboard",
      metric: "99.9% Uptime"
    },
    {
      id: 2,
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Milestone Management",
      description: "Set, track, and approve project milestones with automated notifications and progress tracking",
      metric: "3x Faster"
    },
    {
      id: 3,
      icon: <PlusCircle className="w-7 h-7" />,
      title: "Post & Manage Jobs",
      description: "Create detailed job postings and manage applications from qualified government contractors",
      metric: "50% More Applicants"
    },
    {
      id: 4,
      icon: <DollarSign className="w-7 h-7" />,
      title: "Custom Invoice Generator",
      description: "Generate professional, compliant invoices with your branding and project details",
      metric: "Instant Generation"
    },
    {
      id: 5,
      icon: <Calculator className="w-7 h-7" />,
      title: "1099 Tax Form Generator",
      description: "Automatically generate and file 1099 forms for all your contractor relationships",
      metric: "100% Compliant"
    },
    {
      id: 6,
      icon: <MessageSquare className="w-7 h-7" />,
      title: "Secure Messaging",
      description: "Communicate directly with consultants through encrypted, project-specific messaging",
      metric: "End-to-End Encrypted"
    }
  ];

  const consultantBenefits = [
    {
      id: 7,
      icon: <FileText className="w-7 h-7" />,
      title: "Contract Management",
      description: "Organize and track all your consulting contracts with automated reminders and deadlines",
      metric: "Zero Missed Deadlines"
    },
    {
      id: 8,
      icon: <Send className="w-7 h-7" />,
      title: "Proposal Management",
      description: "Create, send, and track professional proposals with templates designed for government work",
      metric: "40% Win Rate Increase"
    },
    {
      id: 9,
      icon: <DollarSign className="w-7 h-7" />,
      title: "Invoice Generator",
      description: "Create compliant invoices that meet federal contracting requirements and payment terms",
      metric: "Paid 2x Faster"
    },
    {
      id: 10,
      icon: <Calculator className="w-7 h-7" />,
      title: "1099 Tax Management",
      description: "Automatically track earnings and generate tax documents for seamless filing",
      metric: "Tax Ready"
    },
    {
      id: 11,
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Expert Tips & Guidance",
      description: "Access insider tips on federal contracting, compliance, and business development",
      metric: "Expert Insights"
    },
    {
      id: 12,
      icon: <MessageSquare className="w-7 h-7" />,
      title: "Client Communication",
      description: "Professional messaging tools to maintain clear communication with your clients",
      metric: "Real-time Sync"
    }
  ];

  const benefits = activeTab === 'clients' ? clientBenefits : consultantBenefits;

  return (
    <div className="bg-white overflow-hidden relative">
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Hero Section */}
        <div className="pt-12 pb-12">
          <div className="text-center mb-16">
            <h1 className="text-xl md:text-4xl font-black mb-8">
              <span className="bg-boldblue bg-clip-text text-transparent">
                Streamline Your Work Processes With
              </span>
              <br />
              <span className="text-gray-300">Contract Wizard</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto  leading-relaxed">
              Contract lifecycle management that transforms chaos into clarity
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-16">
            <div className="bg-gray-100 p-2 rounded-2xl flex">
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'clients'
                    ? 'bg-white text-boldblue shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-boldblue'
                }`}
              >
                For Clients
              </button>
              <button
                onClick={() => setActiveTab('consultants')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'consultants'
                    ? 'bg-white text-boldblue shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-boldblue'
                }`}
              >
                For Consultants
              </button>
            </div>
          </div>

          {/* Dynamic Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.id}
                className="group relative bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-boldblue/10 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-boldblue to-boldblue rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                     style={{ padding: '2px' }}>
                  <div className="bg-white rounded-3xl h-full w-full" />
                </div>
                
                <div className="relative z-10">
                  {/* Metric Badge */}
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-boldblue to-boldblue text-white text-xs px-3 py-1 rounded-full font-semibold">
                    {benefit.metric}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-boldblue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-boldblue">
                      {benefit.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-boldblue transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {benefit.description}
                  </p>

                  {/* Arrow Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-boldblue/10 flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-boldblue transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractWizardAd;