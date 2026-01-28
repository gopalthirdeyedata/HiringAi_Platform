import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MessageCircle, Brain, TrendingUp } from 'lucide-react';

const AIInterviewSimulation = () => {
    const [stage, setStage] = useState('idle');
    const [messages, setMessages] = useState([]);
    const [sentiment, setSentiment] = useState(0);

    const conversation = [
        {
            id: 1,
            type: 'ai',
            text: 'How does the Virtual DOM work in React?',
            sentiment: 0
        },
        {
            id: 2,
            type: 'candidate',
            text: 'It is a lightweight copy of the real DOM. React compares changes and only updates what is necessary.',
            sentiment: 85
        },
        {
            id: 3,
            type: 'ai',
            text: 'Correct. Why is this more efficient?',
            sentiment: 85
        },
        {
            id: 4,
            type: 'candidate',
            text: 'Direct DOM manipulation is slow. The Diffing algorithm minimizes these costly operations.',
            sentiment: 92
        }
    ];

    useEffect(() => {
        const runAnimation = async () => {
            // Reset
            setMessages([]);
            setSentiment(0);
            setStage('listening');

            await delay(500);

            // Show conversation
            for (const msg of conversation) {
                // Simulating thinking/processing time based on who is speaking
                setStage(msg.type === 'ai' ? 'speaking' : 'listening');
                await delay(msg.type === 'ai' ? 1000 : 1500);

                setMessages(prev => [...prev, msg]);

                if (msg.sentiment > 0) {
                    // Animate sentiment meter smoothly
                    const start = sentiment;
                    const end = msg.sentiment;
                    const steps = 20;
                    const stepSize = (end - start) / steps;

                    for (let i = 1; i <= steps; i++) {
                        setSentiment(Math.round(start + (stepSize * i)));
                        await delay(20);
                    }
                }

                await delay(1000);
            }

            setStage('complete');
            await delay(3000);

            // Loop
            runAnimation();
        };

        runAnimation();
    }, []);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    return (
        <div className="relative w-full max-w-4xl mx-auto py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-4">
                    <Brain className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">AI Voice Interview</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Human-Like Technical Interviews</h3>
                <p className="text-gray-600">Our AI conducts natural conversations and analyzes responses in real-time</p>
            </motion.div>

            {/* Demo Container */}
            <div className="relative bg-transparent backdrop-blur-sm rounded-3xl border border-green-200/30 p-8 shadow-2xl shadow-green-500/10">
                {/* Voice Waveform */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        {/* Microphone Icon */}
                        <motion.div
                            animate={{
                                scale: stage === 'listening' ? [1, 1.1, 1] : 1,
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                            <Mic className="w-10 h-10 text-white" />
                        </motion.div>

                        {/* Pulse Rings */}
                        {stage === 'listening' && (
                            <>
                                {[0, 0.3, 0.6].map((delay, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 1, opacity: 0.5 }}
                                        animate={{ scale: 2.5, opacity: 0 }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2,
                                            delay: delay,
                                            ease: 'easeOut'
                                        }}
                                        className="absolute inset-0 rounded-full border-4 border-blue-500"
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Conversation Messages */}
                <div className="space-y-4 mb-6 min-h-[300px]">
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`max-w-[80%] ${msg.type === 'ai' ? 'order-1' : 'order-2'}`}>
                                    {/* Message Bubble */}
                                    <div className={`rounded-2xl px-6 py-4 ${msg.type === 'ai'
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                        }`}>
                                        <div className="flex items-start gap-3">
                                            {msg.type === 'ai' && (
                                                <Brain className="w-5 h-5 mt-1 flex-shrink-0" />
                                            )}
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                    </div>

                                    {/* Typing Indicator */}
                                    {index === messages.length - 1 && index < conversation.length - 1 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-1 mt-2 px-4"
                                        >
                                            {[0, 0.2, 0.4].map((delay, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 0.6,
                                                        delay: delay
                                                    }}
                                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                                />
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Sentiment Analysis Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: sentiment > 0 ? 1 : 0, y: sentiment > 0 ? 0 : 20 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900">Real-Time Analysis</span>
                        </div>
                        <span className={`text-2xl font-bold ${sentiment >= 90 ? 'text-green-600' :
                            sentiment >= 70 ? 'text-blue-600' :
                                'text-gray-600'
                            }`}>
                            {sentiment}%
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${sentiment}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className={`absolute inset-y-0 left-0 rounded-full ${sentiment >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                sentiment >= 70 ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                                    'bg-gradient-to-r from-gray-400 to-gray-500'
                                }`}
                        />
                    </div>

                    {/* Analysis Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {sentiment > 0 && (
                            <>
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm"
                                >
                                    ✓ Technical Knowledge
                                </motion.span>
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm"
                                >
                                    ✓ Communication Skills
                                </motion.span>
                                {sentiment >= 85 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm"
                                    >
                                        ✓ Problem Solving
                                    </motion.span>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AIInterviewSimulation;
