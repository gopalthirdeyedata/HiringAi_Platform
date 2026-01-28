import React from 'react';
import { Shield, Zap, Users, Award, Lock, TrendingUp, CheckCircle, Globe } from 'lucide-react';

const InfiniteMarquee = () => {
    const features = [
        { icon: Shield, text: 'Enterprise-Ready' },
        { icon: Lock, text: 'Secure by Design' },
        { icon: Award, text: 'Bias-Aware AI' },
        { icon: Zap, text: 'Lightning Fast' },
        { icon: Users, text: 'Scalable Architecture' },
        { icon: TrendingUp, text: '95% Accuracy' },
        { icon: CheckCircle, text: 'SOC 2 Compliant' },
        { icon: Globe, text: 'Global Coverage' },
    ];

    // Duplicate for seamless loop
    const duplicatedFeatures = [...features, ...features];

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 py-6 border-y border-gray-200">
            {/* Gradient Overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-blue-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-50 to-transparent z-10 pointer-events-none" />

            {/* Scrolling Container */}
            <div className="flex animate-marquee hover:pause-marquee">
                {duplicatedFeatures.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 px-8 whitespace-nowrap"
                    >
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600">
                            <feature.icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                            {feature.text}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 ml-4" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfiniteMarquee;
