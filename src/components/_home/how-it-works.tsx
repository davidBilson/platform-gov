import React, { useState } from 'react';
import { UserPlus, UserCheck, Briefcase } from 'lucide-react';

const HowItWorks = () => {
  const [hoveredStep, setHoveredStep] = useState< null | number>(null);

  const steps = [
    {
      number: 1,
      title: "Create an Account",
      description: "Sign up in seconds and verify your profile to get started",
      icon: UserPlus,
      accentColor: "var(--color-boldblue)",
      cardPosition: "top-left"
    },
    {
      number: 2,
      title: "Complete Profile", 
      description: "Set up your profile details to match with opportunities",
      icon: UserCheck,
      accentColor: "var(--color-boldblue)",
      cardPosition: "bottom-left"
    },
    {
      number: 3,
      title: "Find Opportunities",
      description: "Hire talents or look for jobs that fit your profile",
      icon: Briefcase,
      accentColor: "var(--color-boldblue)",
      cardPosition: "top-left"
    }
  ];

  return (
    <section className="pt-12 pb-20  bg-boldblue/10 relative overflow-hidden"
    style={{
      backgroundColor: 'rgba(225, 245, 253, 0.3)'
  }}
    >
      <div className="max-w-[var(--width-maxWidth)] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/80 border border-[var(--color-lightblue)] mb-6 backdrop-blur-sm">
            <span className="text-[var(--color-boldblue)] text-sm font-medium">Simple Process</span>
          </div>
          <h2 className="text-xl md:text-4xl font-semibold text-darkgray mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-mediumgray max-w-2xl mx-auto leading-relaxed">
            Our straightforward three-step process connects talent with opportunity
          </p>
        </div>
        
        {/* Steps Container */}
        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-start justify-between gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isHovered = hoveredStep === step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div 
                    className="flex-1 max-w-sm relative"
                    onMouseEnter={() => setHoveredStep(step.number)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {/* Glassy attached card */}
                    <div className={`absolute ${step.cardPosition === 'top-left' ? '-top-4 -left-4' : '-bottom-4 -left-4'} w-24 h-24 rounded-lg bg-white/80 backdrop-blur-sm border border-white/90 shadow-lg flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                      <span className="text-3xl font-bold" style={{ color: step.accentColor }}>0{step.number}</span>
                    </div>
                    
                    <div className={`relative pt-16 pb-8 px-8 rounded-xl bg-white border border-lightblue transition-all duration-300  hover:border-[var(--color-lightblue)]/50 ${isHovered ? 'scale-[1.02]' : ''}`}>
                      {/* Icon Container */}
                      <div className="relative z-10 mb-6 flex justify-center">
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300" 
                          style={{ 
                            backgroundColor: isHovered ? step.accentColor : 'var(--color-boldblue)',
                            color: 'white'
                          }}
                        >
                          <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="relative z-10 space-y-3 mb-6 text-center">
                        <h3 
                          className="text-xl font-semibold transition-colors duration-300"
                          style={{ color: isHovered ? step.accentColor : 'var(--color-darkgray)' }}
                        >
                          {step.title}
                        </h3>
                        <p className="text-[var(--color-mediumgray)] leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div className="flex items-center justify-center mt-16 relative">
                      <div className="w-16 h-1 bg-[var(--color-lightblue)] opacity-40"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isHovered = hoveredStep === step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div 
                    className="relative"
                    onMouseEnter={() => setHoveredStep(step.number)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {/* Glassy attached card */}
                    <div className={`absolute ${step.cardPosition === 'top-left' ? '-top-3 -left-3' : '-bottom-3 -left-3'} w-16 h-16 rounded-md bg-white/80 backdrop-blur-sm border border-white/90 shadow-sm flex items-center justify-center transition-all duration-300`}>
                      <span className="text-2xl font-bold" style={{ color: step.accentColor }}>0{step.number}</span>
                    </div>
                    
                    <div className={`relative pt-14 pb-6 px-6 rounded-xl bg-white border border-[var(--color-lightblue)]/30 transition-all duration-300 hover:shadow-md`}>
                      <div className="flex items-start space-x-4 relative z-10">
                        <div className="flex-shrink-0">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                            style={{ 
                              backgroundColor: isHovered ? step.accentColor : 'var(--color-boldblue)',
                              color: 'white'
                            }}
                          >
                            <IconComponent className="w-5 h-5" strokeWidth={1.5} />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 
                            className="text-lg font-semibold mb-2 transition-colors duration-300"
                            style={{ color: isHovered ? step.accentColor : 'var(--color-darkgray)' }}
                          >
                            {step.title}
                          </h3>
                          <p className="text-[var(--color-mediumgray)] leading-relaxed text-sm">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center">
                      <div className="w-px h-8 bg-[var(--color-lightblue)] opacity-40"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
    
      </div>
    </section>
  );
};

export default HowItWorks;