import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, TrendingUp, Award, CheckCircle } from 'lucide-react';

const ResumeScreeningDemo = () => {
    const [stage, setStage] = useState('idle');
    const [scores, setScores] = useState({});

    const resumes = [
        { id: 1, name: 'Sarah Chen', role: 'Senior Developer', score: 95, color: 'from-blue-500 to-blue-600' },
        { id: 2, name: 'Michael Rodriguez', role: 'Full Stack Engineer', score: 88, color: 'from-purple-500 to-purple-600' },
        { id: 3, name: 'Emily Watson', role: 'Frontend Developer', score: 82, color: 'from-pink-500 to-pink-600' },
    ];

    useEffect(() => {
        const runAnimation = async () => {
            // Reset
            setStage('idle');
            setScores({});
            setVisibleCandidates([]);

            // 1. Show candidates appearing one by one
            setStage('appearing');
            for (const resume of resumes) {
                await delay(500);
                setVisibleCandidates(prev => [...prev, resume.id]);
            }

            await delay(500);

            // 2. Scan and score each candidate sequentially
            setStage('scanning');
            for (const resume of resumes) {
                // Highlight current candidate
                setStage(`scanning-${resume.id}`);
                await delay(800);

                // Show score
                setScores(prev => ({ ...prev, [resume.id]: resume.score }));
                await delay(400);
            }

            setStage('ranked');

            // Loop animation
            await delay(4000);
            runAnimation();
        };

        runAnimation();
    }, []);

    const [visibleCandidates, setVisibleCandidates] = useState([]);
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    return (
        <div className="relative w-full max-w-4xl mx-auto py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">AI-Powered Resume Screening</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Screen 1000+ Resumes in Seconds</h3>
                <p className="text-gray-600">Watch our AI analyze and rank candidates automatically</p>
            </motion.div>

            {/* Demo Container */}
            <div className="relative bg-transparent backdrop-blur-sm rounded-3xl border border-blue-200/30 p-8 shadow-2xl shadow-blue-500/10 overflow-hidden min-h-[500px]">

                {/* Resume Cards */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {resumes.filter(r => visibleCandidates.includes(r.id)).map((resume, index) => (
                            <motion.div
                                key={resume.id}
                                initial={{ x: -50, opacity: 0 }}
                                animate={{
                                    x: 0,
                                    opacity: 1,
                                    scale: stage === `scanning-${resume.id}` ? 1.02 : 1,
                                    boxShadow: stage === `scanning-${resume.id}` ? "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" : ""
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className={`relative bg-white rounded-xl border-2 ${stage === `scanning-${resume.id}` ? 'border-blue-400 ring-2 ring-blue-100' :
                                        scores[resume.id] >= 90 ? 'border-green-200 bg-green-50/30' :
                                            'border-gray-200'
                                    } p-6 transition-all duration-300 overflow-hidden`}
                            >
                                {/* Scanning Light Effect */}
                                {stage === `scanning-${resume.id}` && (
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '200%' }}
                                        transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent z-0 pointer-events-none"
                                    />
                                )}

                                <div className="relative z-10 flex items-center justify-between">
                                    {/* Left: Resume Info */}
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${resume.color} flex items-center justify-center text-white font-bold text-lg`}>
                                            {resume.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{resume.name}</h4>
                                            <p className="text-sm text-gray-600">{resume.role}</p>
                                        </div>
                                    </div>

                                    {/* Right: Score Badge */}
                                    <AnimatePresence>
                                        {scores[resume.id] ? (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className="flex items-center gap-3"
                                            >
                                                {/* Score Circle */}
                                                <div className={`relative w-16 h-16 rounded-full ${scores[resume.id] >= 90 ? 'bg-green-100' :
                                                    scores[resume.id] >= 80 ? 'bg-blue-100' : 'bg-gray-100'
                                                    } flex items-center justify-center`}>
                                                    <span className={`text-2xl font-bold ${scores[resume.id] >= 90 ? 'text-green-600' :
                                                        scores[resume.id] >= 80 ? 'text-blue-600' : 'text-gray-600'
                                                        }`}>
                                                        {scores[resume.id]}
                                                    </span>
                                                </div>

                                                {/* Top Candidate Badge */}
                                                {scores[resume.id] >= 90 && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.3 }}
                                                        className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                                                    >
                                                        <Award className="w-3 h-3" />
                                                        Top Match
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        ) : (
                                            stage === `scanning-${resume.id}` && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-2 text-blue-600 text-sm font-medium"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                    Analyzing...
                                                </motion.div>
                                            )
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Skills Tags (appear after scoring) */}
                                <AnimatePresence>
                                    {scores[resume.id] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            transition={{ delay: 0.2 }}
                                            className="mt-4 flex flex-wrap gap-2"
                                        >
                                            {['React', 'Node.js', 'TypeScript', 'AWS'].map((skill, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                    {skill}
                                                </span>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {visibleCandidates.length < resumes.length && (
                        <div className="h-24 flex items-center justify-center">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Indicator */}
                <motion.div
                    className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 text-sm"
                >
                    {stage.startsWith('scanning') ? (
                        <>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                            <span className="text-blue-600 font-medium">AI Agent Processing Candidates...</span>
                        </>
                    ) : stage === 'ranked' ? (
                        <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">All Candidates Ranked!</span>
                        </>
                    ) : (
                        <span className="text-gray-400">Waiting for candidates...</span>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ResumeScreeningDemo;
