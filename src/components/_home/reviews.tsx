import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow Inc",
      review: "The results exceeded our expectations. We saw a 340% increase in qualified leads within the first quarter.",
      rating: 5,
      avatar: "SC"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "CEO",
      company: "GrowthLab",
      review: "Outstanding service and genuine expertise. Our conversion rates improved by 285% in just 8 weeks.",
      rating: 5,
      avatar: "MR"
    },
    {
      id: 3,
      name: "Emily Watson",
      role: "Product Manager",
      company: "InnovateCorp",
      review: "Professional, reliable, and results-driven. The ROI was measurable from day one of implementation.",
      rating: 5,
      avatar: "EW"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Founder",
      company: "StartupVenture",
      review: "Incredible attention to detail and strategic thinking. Our user engagement increased by 420%.",
      rating: 5,
      avatar: "DK"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Operations Head",
      company: "ScaleUp Solutions",
      review: "The team delivered exactly what they promised. We achieved 6-figure growth in our first year.",
      rating: 5,
      avatar: "LT"
    },
    {
      id: 6,
      name: "Alex Morgan",
      role: "VP of Sales",
      company: "Revenue Labs",
      review: "Exceptional results and clear communication throughout. Our sales pipeline grew by 380%.",
      rating: 5,
      avatar: "AM"
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

        {/* Additional glow overlay */}
        {/* <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 80% 40% at 50% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)'
          }}
        /> */}
      </div>

      <div className="max-width mx-auto  px-6 relative z-10">
      
        <div className="mb-16 ">
          <h2 className="text-xl md:text-4xl font-semibold text-darkgray mb-6 tracking-tight">
            Measurable Results with {' '}
            <span className="text-boldblue bg-clip-text">
              Real Clients
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="group">
              {/* Glassy Card */}
              <div className="relative p-8 rounded-3xl backdrop-blur-sm min-h-72 bg-white/70 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/70">
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
                <p className="text-gray-700 leading-relaxed mb-8 font-medium">
                  "{review.review}"
                </p>

                {/* Profile Section */}
                <div className="flex items-center space-x-4">
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
    </section>
  );
};

export default Reviews;