import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Award, Clock, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const CandidateStartPage = () => {
    const navigate = useNavigate();
    const assessment = JSON.parse(localStorage.getItem('currentAssessment') || '{}');

    // Extract details
    const type = assessment.type ? assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1) : 'Assessment';
    const config = assessment.config || {};
    const duration = config.duration || config.timeLimit || 60;
    const questions = config.questionCount ? `${config.questionCount} Problems` : (config.qCount ? `${config.qCount} Questions` : '2 Problems');

    // Whitelist for showing Format card
    const showFormat = ['Aptitude', 'Coding'].includes(type);

    const handleStart = () => {
        navigate('/portal/instructions');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl w-full"
            >
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

                    {/* Header Section - Lighter Gradient */}
                    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 border-b border-blue-100 p-8 text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200/50"
                        >
                            <Award className="text-white" size={40} />
                        </motion.div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                            {type} Round
                        </h1>
                        <p className="text-gray-600 font-medium">
                            Please review the test details carefully before starting
                        </p>
                        <button
                            onClick={() => { localStorage.clear(); navigate('/portal/login'); }}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-2 underline block mx-auto"
                        >
                            Log out & Exit
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 space-y-8">

                        {/* Test Details Cards - Softer Design */}
                        <div className={`grid grid-cols-1 ${showFormat ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-5`}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="group bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col items-center text-center space-y-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Clock className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                                            Duration
                                        </span>
                                        <span className="block text-2xl font-extrabold text-gray-900">
                                            {duration}
                                        </span>
                                        <span className="block text-sm text-gray-600 font-medium">
                                            Minutes
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {showFormat && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="group bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-100 hover:border-purple-200 hover:shadow-md transition-all"
                                >
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Award className="text-purple-600" size={24} />
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                                                Format
                                            </span>
                                            <span className="block text-2xl font-extrabold text-gray-900">
                                                {questions.split(' ')[0]}
                                            </span>
                                            <span className="block text-sm text-gray-600 font-medium">
                                                {questions.split(' ')[1] || 'Items'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="group bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100 hover:border-green-200 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col items-center text-center space-y-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="text-green-600" size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                                            Proctoring
                                        </span>
                                        <span className="block text-2xl font-extrabold text-gray-900">
                                            ✓
                                        </span>
                                        <span className="block text-sm text-gray-600 font-medium">
                                            Enabled
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Enhanced Warning Section - Alert Style */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-xl p-5 shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <AlertTriangle className="text-amber-600" size={20} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                                        Important Instructions
                                    </h3>
                                    <ul className="text-sm text-amber-800 space-y-1.5 leading-relaxed">
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-600 font-bold mt-0.5">•</span>
                                            <span>The timer will start immediately when you click <strong className="font-bold">Start Test</strong></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-600 font-bold mt-0.5">•</span>
                                            <span>Do not close the browser or switch tabs during the test</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-600 font-bold mt-0.5">•</span>
                                            <span>Any suspicious activity may be flagged as a violation</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        {/* Primary Action Button - More Prominent */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <button
                                onClick={handleStart}
                                className="group w-full py-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-300/50 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 border-2 border-blue-500/20"
                            >
                                <PlayCircle size={24} className="group-hover:scale-110 transition-transform" />
                                {type.toLowerCase().includes('interview') ? 'Start Interview' : 'Start Test'}
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>

                        {/* Session Info */}
                        <div className="text-center pt-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                <ShieldCheck className="text-green-600" size={14} />
                                <span className="text-xs text-gray-500 font-medium">
                                    Session ID: <span className="text-gray-700 font-mono">{assessment.id || 'Unknown'}</span>
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-500 font-medium">Secure Environment</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Tip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-6 text-center"
                >
                    <p className="text-sm text-gray-500">
                        💡 <span className="font-medium">Tip:</span> Ensure you have a stable internet connection before starting
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CandidateStartPage;
