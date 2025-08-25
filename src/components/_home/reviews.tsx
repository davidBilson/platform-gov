import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

const Reviews = () => {
  const clientReviews = [
    {
      id: 1,
      name: "Karen Mitchell",
      role: "CFO",
      company: "AeroStrategix Solutions",
      review: "GovLink Global connected us with a project consultant who understood FAR and DFARS compliance inside out. Their expertise helped us pass a Defense Contract Audit Agency (DCAA) review with zero findings and positioned us to bid more competitively on DoD contracts.",
      rating: 5,
      avatar: "KM"
    },
    {
      id: 2,
      name: "Michael Torres",
      role: "VP of Business Development",
      company: "FederalEdge Consulting",
      review: "Through GovLink Global we found a GCC-certified project consultant who managed our GSA Schedule submission. With their guidance in federal procurement, we are now eligible to pursue multi-million-dollar opportunities with federal agencies.",
      rating: 5,
      avatar: "MT"
    },
    {
      id: 3,
      name: "David Franklin",
      role: "CEO",
      company: "SecurePath Technologies",
      review: "We urgently needed help with CMMC compliance, and GovLink Global delivered. The freelancer we hired built a zero-trust framework, got us audit-ready, and provided a roadmap for cyber resilience tailored to federal requirements.",
      rating: 5,
      avatar: "DF"
    }
  ];

  const consultantReviews = [
    {
      id: 4,
      name: "Jack Kim",
      role: "Cybersecurity Consultant",
      company: "Independent",
      review: "GovLink Global makes it simple for freelancers like me to connect with companies looking for specialized federal expertise. I've been able to demonstrate my background in CMMC and FedRAMP compliance to clients who specifically need government-ready IT solutions.",
      rating: 5,
      avatar: "JK"
    },
    {
      id: 5,
      name: "Rebecca Allen",
      role: "Independent Project Consultant",
      company: "Freelancer",
      review: "GovLink Global's Contract Wizard made it easy for me to set up my consulting agreement, track milestones, and generate 1099-ready records with the companies I work with. It simplified the whole process.",
      rating: 5,
      avatar: "RA"
    },
    {
      id: 6,
      name: "Julia Black",
      role: "Policy & Contracting Consultant",
      company: "GCCI-Certified",
      review: "As a GCCI-certified project consultant, GovLink Global gave me a direct way to showcase my skills to defense contractors and federal agencies. Within weeks, I secured a new contract that aligned perfectly with my DoD acquisition expertise.",
      rating: 5,
      avatar: "JB"
    }
  ];

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      {/* Curved Glowing Ribbon */}
      <div className="absolute inset-0">
        {/* Main ribbon */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 1000 800" 
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B5F94" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Curved ribbon path */}
          <path
            d="M-100,400 Q200,350 500,450 T1100,400 L1100,550 Q800,600 500,500 T-100,550 Z"
            fill="url(#ribbonGradient)"
            filter="url(#glow)"
            opacity=".1"
            // className="animate-pulse"
            // style={{ animationDuration: '4s' }}
          />
          
          {/* Secondary ribbon for depth */}
          <path
             d="M-100,380 Q250,320 500,420 T1100,380 L1100,480 Q750,530 500,430 T-100,480 Z"
            fill="url(#ribbonGradient)"
            opacity=".1"
          />
        </svg>

      </div>

      <div className="max-width mx-auto px-6 relative z-10">
        <div className="mb-16">
          <h2 className="text-xl md:text-4xl font-semibold text-darkgray mb-6 tracking-tight text-center">
            Trusted by {' '}
            <span className="text-boldblue bg-clip-text">
              Clients & Consultants
            </span>
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto text-lg">
            See how GovLink Global connects federal contractors with specialized expertise
          </p>
        </div>

        {/* Client Testimonials Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-boldblue to-boldblue/80 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg">
              Client Success Stories
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clientReviews.map((review) => (
              <div key={review.id} className="group">
                {/* Glassy Card */}
                <div className="relative p-8 rounded-3xl backdrop-blur-sm min-h-80 bg-white/70 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/80">
                  {/* Quote Icon */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-boldblue to-boldblue flex items-center justify-center shadow-lg">
                    <Quote className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>

                  {/* Stars */}
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed mb-8 font-medium text-sm">
                    "{review.review}"
                  </p>

                  {/* Profile Section */}
                  <div className="flex items-center space-x-4 mt-auto">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-boldblue/10">
                      <span className="text-boldblue font-bold text-sm">
                        {review.avatar}
                      </span>
                    </div>
                    
                    {/* Info */}
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {review.name}
                      </h4>
                      <p className="text-boldblue font-medium text-sm">
                        {review.role}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {review.company}
                      </p>
                    </div>
                  </div>

                  {/* Subtle Glow Effect on Hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-boldblue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consultant Testimonials Section */}
        <div>
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg">
              Consultant Success Stories
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {consultantReviews.map((review) => (
              <div key={review.id} className="group">
                {/* Glassy Card with Green Accent */}
                <div className="relative p-8 rounded-3xl backdrop-blur-sm min-h-80 bg-white/70 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/80">
                  {/* Quote Icon with Green Theme */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center shadow-lg">
                    <Quote className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>

                  {/* Stars */}
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed mb-8 font-medium text-sm">
                    "{review.review}"
                  </p>

                  {/* Profile Section */}
                  <div className="flex items-center space-x-4 mt-auto">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-green-500/10">
                      <span className="text-green-600 font-bold text-sm">
                        {review.avatar}
                      </span>
                    </div>
                    
                    {/* Info */}
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {review.name}
                      </h4>
                      <p className="text-green-600 font-medium text-sm">
                        {review.role}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {review.company}
                      </p>
                    </div>
                  </div>

                  {/* Subtle Glow Effect on Hover with Green Theme */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Reviews;