import React, { useState } from 'react';
import { 
  Code, 
  Palette, 
  Brain, 
  TrendingUp, 
  PenTool, 
  Headphones, 
  Calculator, 
  Scale, 
  Users, 
  Building,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Explore = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    {
      title: "Development & IT",
      icon: Code,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Web development, mobile apps, software engineering"
    },
    {
      title: "Design & Creative",
      icon: Palette,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "UI/UX design, branding, graphic design, video editing"
    },
    {
      title: "AI Services",
      icon: Brain,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      description: "Machine learning, AI development, automation"
    },
    {
      title: "Sales & Marketing",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      description: "Digital marketing, lead generation, social media"
    },
    {
      title: "Writing & Translation",
      icon: PenTool,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      description: "Content writing, copywriting, translation services"
    },
    {
      title: "Admin & Support",
      icon: Headphones,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      description: "Virtual assistance, customer support, data entry"
    },
    {
      title: "Finance & Accounting",
      icon: Calculator,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Bookkeeping, financial planning, tax preparation"
    },
    {
      title: "Legal",
      icon: Scale,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      description: "Legal consulting, contract review, compliance"
    },
    {
      title: "HR & Training",
      icon: Users,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      description: "Recruitment, training programs, HR consulting"
    },
    {
      title: "Engineering & Architecture",
      icon: Building,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      description: "CAD design, structural engineering, architecture"
    }
  ];

  return (
    <section className=" overflow-hidden">

      <div className="max-width mx-auto pb-12 px-6 relative z-10">
       
        {/* Header */}
        <div className="mb-16 ">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-boldblue/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-boldblue" />
            <span className="text-boldblue font-medium text-sm">Professional Services</span>
          </div>
          
          <h2 className="text-xl md:text-4xl font-semibold text-darkgray mb-6 tracking-tight">
            Explore millions of{' '}
            <span className="text-boldblue bg-clip-text">
              professionals
            </span>
          </h2>
          
          <p className="md:text-lg text-darkgray leading-relaxed max-w-5xl">
            Connect with skilled experts across every industry and skill set. From tech innovation to creative excellence, find the perfect professional for your project.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isHovered = hoveredCategory === index;
            
            return (
              <div
                key={index}
                className="group cursor-pointer"
              >
                <div className={`
                  relative p-6 rounded-2xl min-h-56  shadow transition-all duration-300 transform                `}>
                  <div className={`bg-boldblue/10 w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-all duration-300`}>
                    <Icon 
                      className={`w-6 h-6 transition-colors duration-300 text-boldblue`} 
                      strokeWidth={2}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-gray-800 transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed transition-all duration-300 ${
                    isHovered ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {category.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className={`
                    absolute top-4 right-4 transition-all duration-300
                    ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
                  `}>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Subtle Glow */}
                  <div className={`
                    absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none
                    ${isHovered ? 'opacity-20' : 'opacity-0'}
                    bg-gradient-to-br ${category.color}
                  `}></div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Explore;