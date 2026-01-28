import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Brain, Code, Mic, Users, CheckCircle, ArrowRight,
    Layers, Shield, Zap, TrendingUp, ChevronRight
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ClerkAuthModal from '../components/ClerkAuthModal';
import InfiniteMarquee from '../components/InfiniteMarquee';
import AnimatedBackground from '../components/AnimatedBackground';
import AnimatedTimeline from '../components/AnimatedTimeline';
import ResumeScreeningDemo from '../components/demos/ResumeScreeningDemo';
import CodingTestPreview from '../components/demos/CodingTestPreview';
import AIInterviewSimulation from '../components/demos/AIInterviewSimulation';
import AnimatedHeroText from '../components/AnimatedHeroText';
import { useClerk } from '@clerk/clerk-react';

// Animation Utilities
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
};

const Home = () => {
    const navigate = useNavigate();
    const { user } = useClerk();
    const [isClerkOpen, setIsClerkOpen] = React.useState(false);
    const [clerkMode, setClerkMode] = React.useState('sign-in');

    // Auto-redirect to dashboard if user is signed in
    React.useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Open Clerk modal
    const openClerkSignIn = () => {
        setClerkMode('sign-in');
        setIsClerkOpen(true);
    };

    const openClerkSignUp = () => {
        setClerkMode('sign-up');
        setIsClerkOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
            {/* Global Animated Background Pattern */}
            <div className="fixed inset-0 -z-50 opacity-[0.02]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)
                        `
                    }}
                />
            </div>

            {/* Clerk Auth Modal */}
            <ClerkAuthModal
                isOpen={isClerkOpen}
                onClose={() => setIsClerkOpen(false)}
                mode={clerkMode}
            />

            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">HiringAI</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                        <a href="#demos" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Demos</a>
                        <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
                    </div>

                    <div className="flex items-center gap-6">
                        <button onClick={openClerkSignIn} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Sign In</button>
                        <button onClick={openClerkSignUp} className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* 1. Hero Section */}
            <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-24 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                            The Future of Recruitment is Here
                        </motion.div>



                        <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                            Hire Top Talent <br />
                            <AnimatedHeroText text="10x Faster" />
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed tracking-tight">
                            Screen 100+ resumes in minutes. Conduct AI interviews at scale. Make data-driven hiring decisions—all from one platform.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button onClick={openClerkSignUp} className="w-full sm:w-auto px-12 py-6 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                                Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:bg-gray-50 transition-all hover:border-gray-300 hover:-translate-y-0.5">
                                Watch Demo
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Animated Gradient Background - REMOVED */}
                    {/* <AnimatedBackground /> */}
                </div>
            </section>

            {/* 1.5 Trust Signals - Infinite Marquee */}
            <InfiniteMarquee />

            {/* DEMO 1: Resume Screening */}
            {/* DEMO 1: Resume Screening */}
            <section id="demos" className="py-20 px-6">
                <ResumeScreeningDemo />
            </section>

            {/* 2. How It Works (Visual Story Timeline) */}
            {/* 2. How It Works (Visual Story Timeline) */}
            <section id="how-it-works" className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">How HiringAI Works</h2>
                        <p className="text-lg text-gray-600">A seamless workflow to find your next top talent in minutes.</p>
                    </motion.div>

                    <AnimatedTimeline />
                </div>
            </section>

            {/* DEMO 2: Coding Test Preview */}
            {/* DEMO 2: Coding Test Preview */}
            <section className="py-20 px-6">
                <CodingTestPreview />
            </section>

            {/* 3. Who Is This For? (Audience) */}
            {/* 3. Who Is This For? (Audience) */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">Built for Modern Hiring Teams</h2>
                        <p className="text-lg text-gray-600">Tailored tools for every stakeholder in the recruitment process.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "HR Managers", icon: Users, desc: "Automate screening and focus on culture fit." },
                            { title: "Tech Recruiters", icon: Code, desc: "Assess coding skills without needing technical expertise." },
                            { title: "Enterprises", icon: Shield, desc: "Scale hiring with bias-free, secure AI workflows." }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: i * 0.2 }}
                                className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:border-blue-100 hover:-translate-y-2 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-white rounded-xl flex items-center justify-center mb-6 text-gray-600 shadow-sm group-hover:text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    <card.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DEMO 3: AI Interview Simulation */}
            {/* DEMO 3: AI Interview Simulation */}
            <section className="py-20 px-6">
                <AIInterviewSimulation />
            </section>

            {/* 3. Key Features */}
            {/* 3. Key Features */}
            <section id="features" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2 }}
                        >
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">Intelligence at Every Step</h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Our platform leverages advanced LLMs to understand context, evaluate code correctness, and conduct human-like voice interviews without bias.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "Contextual Resume Parsing", desc: "Goes beyond keywords using RAG." },
                                    { title: "Secure Code Execution", desc: "Piston-powered sandboxed coding environment." },
                                    { title: "Real-time Voice Analytics", desc: "VAPI integration for lifelike technical discussions." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600 mt-1">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                            <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="space-y-4 mt-8">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                    <Shield className="w-8 h-8 text-blue-600 mb-4" />
                                    <h3 className="font-bold text-gray-900">Enterprise Secure</h3>
                                    <p className="text-sm text-gray-500 mt-2">Role-based access control and isolated company data.</p>
                                </div>
                                <div className="bg-blue-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-[1.02] transition-transform">
                                    <Zap className="w-8 h-8 text-blue-200 mb-4" />
                                    <h3 className="font-bold">Lightning Fast</h3>
                                    <p className="text-sm text-blue-100 mt-2">Instant resume parsing and real-time execution.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                                    <TrendingUp className="w-8 h-8 text-purple-600 mb-4" />
                                    <h3 className="font-bold text-gray-900">Analytics Dashboard</h3>
                                    <p className="text-sm text-gray-500 mt-2">Visual insights into your recruitment pipeline efficiency.</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                    <Users className="w-8 h-8 text-gray-600 mb-4" />
                                    <h3 className="font-bold text-gray-900">Collaborative</h3>
                                    <p className="text-sm text-gray-500 mt-2">Seamlessly share candidate profiles with hiring managers.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. Technology & Intelligence */}
            <section className="bg-gray-900 text-white py-20 px-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">Powered by Advanced AI</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-16">
                            We combine the power of Vector Databases, Large Language Models, and Voice Synthesis to create a human-like hiring experience.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-4 lg:gap-8 opacity-70">
                        {["Grok LLM", "ChromaDB", "VAPI Voice", "Monaco Editor", "Django Scale"].map((tech, i) => (
                            <div key={i} className="px-6 py-3 rounded-full border border-gray-700 bg-gray-800/50 text-sm font-mono">
                                {tech}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Call to Action */}
            {/* 5. Call to Action */}
            <section className="py-24 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                        Ready to transform your <br /> hiring process?
                    </h2>
                    <button onClick={openClerkSignUp} className="inline-flex items-center gap-2 px-12 py-6 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/40 transform hover:-translate-y-1">
                        Start Free Trial <ChevronRight className="w-5 h-5" />
                    </button>
                    <p className="mt-6 text-sm text-gray-600 font-medium">
                        No credit card required • 14-day free trial • Cancel anytime
                    </p>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16 px-6 border-t border-gray-800">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <Brain className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">HiringAI</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            The complete AI-powered hiring platform for modern enterprises. Screen, assess, and interview candidates 10x faster.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 text-gray-100">Product</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">Resume Screening</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">Coding Assessments</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">AI Video Interviews</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">Candidate Dashboard</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 text-gray-100">Solutions</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">For Enterprise</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">For Startups</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">For Staffing Agencies</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 text-gray-100">Company</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">About Us</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">Careers</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">Security</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">Contact</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 mt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <div>&copy; 2026 HiringAI Inc. All rights reserved.</div>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
