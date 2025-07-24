import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Users, Globe, Star, TrendingUp } from 'lucide-react';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setIsVisible(true);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // @ts-ignore
    const FloatingCard = ({ children, delay = 0, className = "" }) => (
        <div
            className={`absolute bg-white/90 backdrop-blur-lg border border-sky-200 rounded-2xl p-4 shadow-2xl transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                } ${className}`}
            style={{
                animationDelay: `${delay}ms`,
                boxShadow: '0 25px 50px -12px rgba(11, 95, 148, 0.15)'
            }}
        >
            {children}
        </div>
    );

    return (
        <section className="relative w-full overflow-hidden bg-white">

            <div className="relative max-width mx-auto px-6 py-24">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                        }`}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full"
                            style={{
                                backgroundColor: 'rgba(225, 245, 253, 0.8)',
                                border: '1px solid rgba(160, 217, 246, 0.5)',
                                color: '#0B5F94'
                            }}>
                            <Zap className="w-4 h-4" style={{ color: '#009DDE' }} />
                            <span>Trusted by 500+ companies</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1]" style={{ color: '#333333' }}>
                            Your shortcut to{' '}
                            <span className="relative inline-block">
                                <span className='text-boldblue'>elite talent</span>
                                <div className="absolute -inset-2 rounded-lg opacity-20 animate-pulse"
                                    style={{ backgroundColor: 'rgba(160, 217, 246, 0.2)' }} />
                            </span>
                            <br />
                            without the hassle
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl leading-relaxed max-w-2xl" style={{ color: '#808080' }}>
                            GovLink Global connects world-class consultants with ambitious projects.
                            Scale faster, build smarter, and solve complex challenges with expert precision.
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-8 text-sm" style={{ color: '#808080' }}>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#00A871' }} />
                                <span>2.4k+ consultants</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#009DDE' }} />
                                <span>98% success rate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#0B5F94' }} />
                                <span>48h avg. match time</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                className="cursor-pointer group relative px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #0B5F94 0%, #0B5F94 100%)',
                                    // boxShadow: '0 10px 30px rgba(11, 95, 148, 0.3)'
                                }}
                            >
                                <span className="flex items-center justify-center gap-2 relative z-10">
                                    Hire Elite Consultants
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            <button
                                className="cursor-pointer px-8 py-4 font-semibold rounded-xl border-2 transition-all duration-300 hover:scale-105"
                                style={{
                                    color: '#0B5F94',
                                    borderColor: 'rgba(160, 217, 246, 0.6)',
                                    backgroundColor: 'rgba(225, 245, 253, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    // @ts-ignore
                                    e.target.style.backgroundColor = 'rgba(225, 245, 253, 0.6)';
                                    // @ts-ignore
                                    e.target.style.borderColor = 'rgba(11, 95, 148, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    // @ts-ignore
                                    e.target.style.backgroundColor = 'rgba(225, 245, 253, 0.3)';
                                    // @ts-ignore
                                    e.target.style.borderColor = 'rgba(160, 217, 246, 0.6)';
                                }}
                            >
                                Explore Opportunities
                            </button>
                        </div>
                    </div>

                    {/* Right Visual Section */}
                    <div className={`relative h-[600px] transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                        }`}>
                        {/* Main dashboard mockup */}
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadowxl overflow-hidden border-2"
                            style={{
                                borderColor: 'rgba(160, 217, 246, 0.3)',
                            }}>
                            {/* Header bar */}
                            <div className="flex items-center gap-2 p-6 border-b"
                                style={{
                                    borderColor: 'rgba(160, 217, 246, 0.3)',
                                    background: 'rgba(225, 245, 253, 0.3)'
                                }}>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#dc143c' }} />
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f1c232' }} />
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00A871' }} />
                                </div>
                                <div className="flex-1 text-center text-sm font-bold" style={{ color: '#0B5F94' }}>
                                    GovLink Global
                                </div>
                            </div>

                            {/* Content area */}
                            <div className="p-6 space-y-4">
                                <div className="h-4 rounded" style={{
                                    background: 'linear-gradient(90deg, rgba(11, 95, 148, 0.3) 0%, rgba(160, 217, 246, 0.2) 70%, transparent 100%)'
                                }} />
                                <div className="h-4 rounded w-3/4" style={{
                                    background: 'linear-gradient(90deg, rgba(0, 157, 222, 0.3) 0%, rgba(225, 245, 253, 0.2) 70%, transparent 100%)'
                                }} />
                                <div className="h-4 rounded w-1/2" style={{
                                    background: 'linear-gradient(90deg, rgba(0, 168, 113, 0.3) 0%, rgba(160, 217, 246, 0.2) 70%, transparent 100%)'
                                }} />

                                <div className="grid grid-cols-2 gap-4 pt-6">
                                    <div className="h-20 rounded-xl border-2" style={{
                                        background: 'linear-gradient(135deg, rgba(11, 95, 148, 0.1) 0%, rgba(160, 217, 246, 0.1) 100%)',
                                        borderColor: 'rgba(160, 217, 246, 0.3)'
                                    }} />
                                    <div className="h-20 rounded-xl border-2" style={{
                                        background: 'linear-gradient(135deg, rgba(0, 157, 222, 0.1) 0%, rgba(225, 245, 253, 0.1) 100%)',
                                        borderColor: 'rgba(160, 217, 246, 0.3)'
                                    }} />
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <FloatingCard delay={500} className="top-4 -left-8 w-48">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: '#00A871' }}>
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold" style={{ color: '#333333' }}>New Match</div>
                                    <div className="text-xs" style={{ color: '#808080' }}>AI Expert • $180/hr</div>
                                </div>
                            </div>
                        </FloatingCard>

                        <FloatingCard delay={700} className="top-32 -right-12 w-44">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: '#009DDE' }}>
                                    <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold" style={{ color: '#333333' }}>Success Rate</div>
                                    <div className="text-xs font-bold" style={{ color: '#00A871' }}>↗ 98.2%</div>
                                </div>
                            </div>
                        </FloatingCard>

                        <FloatingCard delay={900} className="bottom-20 -left-6 w-52">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: '#0B5F94' }}>
                                    <Globe className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold" style={{ color: '#333333' }}>Global Reach</div>
                                    <div className="text-xs" style={{ color: '#808080' }}>50+ countries</div>
                                </div>
                            </div>
                        </FloatingCard>

                        <FloatingCard delay={1100} className="bottom-4 -right-8 w-40">
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-4 h-4 fill-current" style={{ color: '#f1c232' }} />
                                    ))}
                                </div>
                                <div className="text-sm font-semibold" style={{ color: '#333333' }}>4.9/5</div>
                            </div>
                        </FloatingCard>

                        {/* Glow effects */}
                        <div className="absolute -inset-4 rounded-3xl blur-xl opacity-30 animate-pulse"
                            style={{
                                background: 'linear-gradient(135deg, rgba(11, 95, 148, 0.2) 0%, rgba(160, 217, 246, 0.3) 50%, rgba(0, 157, 222, 0.2) 100%)'
                            }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;