import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Code, Mic, CheckCircle } from 'lucide-react';

const AnimatedTimeline = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const steps = [
        { step: 1, title: "Upload JD", desc: "Drag & drop job description", icon: Upload, color: "blue" },
        { step: 2, title: "AI Screen", desc: "Rank candidates instantly", icon: Sparkles, color: "purple" },
        { step: 3, title: "Assess", desc: "Auto-send coding tests", icon: Code, color: "pink" },
        { step: 4, title: "Interview", desc: "Voice AI conducts rounds", icon: Mic, color: "indigo" },
        { step: 5, title: "Hire", desc: "Data-backed decisions", icon: CheckCircle, color: "green" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => prev + 1);
        }, 3000); // 3 second pause at each step
        return () => clearInterval(interval);
    }, []);

    const radius = 260; // Slightly larger for better spacing
    const totalSteps = steps.length;
    const baseAngle = 360 / totalSteps;

    return (
        <div className="relative h-[600px] w-full flex items-center justify-center overflow-hidden perspective-1000">
            {/* Center Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -z-10" />

            <div className="relative w-full h-full flex items-center justify-center">
                {steps.map((item, index) => {
                    // Calculate angle for this specific item based on activeIndex
                    const currentRotation = activeIndex * -baseAngle;
                    const itemExposedAngle = (index * baseAngle) + currentRotation;

                    // Normalize angle to work with Math.sin/cos properly
                    const radian = (itemExposedAngle * Math.PI) / 180;

                    // 3D Matrix Calculations
                    const x = Math.sin(radian) * radius;
                    const z = Math.cos(radian) * radius;

                    // Scale and Opacity logic
                    const scale = (z + radius * 2.5) / (radius * 3.5);
                    const opacity = (z + radius * 1.5) / (radius * 2.5);
                    const zIndex = Math.round(z + radius);

                    // Is this item the focused one? (front)
                    const isFront = z > (radius - 50);

                    return (
                        <motion.div
                            key={index}
                            className={`absolute top-1/2 left-1/2 flex flex-col items-center justify-center text-center p-8 rounded-3xl w-72 h-80 backdrop-blur-sm transition-all duration-500
                                ${isFront ? 'bg-white shadow-2xl border-2 border-blue-50/50' : 'bg-white/80 shadow-lg border border-gray-100/50'}
                            `}
                            initial={false}
                            animate={{
                                x: x - 144, // Center offset (width/2)
                                y: -160, // Center offset (height/2)
                                scale: scale,
                                opacity: Math.max(0.3, Math.min(1, opacity)),
                                zIndex: zIndex,
                                filter: isFront ? 'blur(0px)' : 'blur(1px)' // Subtle depth blur
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 50,
                                damping: 15,
                                mass: 1
                            }}
                        >
                            {/* Prominent Step Number Badge */}
                            <div className={`absolute -top-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${isFront ? `bg-${item.color}-600 text-white` : 'bg-gray-200 text-gray-500'
                                }`}>
                                Step 0{item.step}
                            </div>

                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${isFront ? `bg-${item.color}-100 text-${item.color}-600 scale-110 shadow-inner` : 'bg-gray-50 text-gray-400'
                                }`}>
                                <item.icon className="w-10 h-10" />
                            </div>

                            <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${isFront ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                {item.title}
                            </h3>
                            <p className="text-base text-gray-500 leading-relaxed max-w-[200px]">
                                {item.desc}
                            </p>

                            {/* Active Glow Effect */}
                            {isFront && (
                                <motion.div
                                    layoutId="active-glow"
                                    className={`absolute inset-0 rounded-3xl ring-4 ring-${item.color}-100 -z-10`}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnimatedTimeline;
