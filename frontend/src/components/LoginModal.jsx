import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Brain, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../apiConfig';

const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Store actual token from backend
                localStorage.setItem('token', data.access);
                // Also store user info if needed, but for now just token
                // Navigate to dashboard
                navigate('/dashboard');
            } else {
                alert("Login failed: Incorrect email or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 pointer-events-auto relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8 sm:p-10">
                                <div className="flex justify-center mb-8">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                                        <Brain className="w-7 h-7 text-white" />
                                    </div>
                                </div>

                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
                                    <p className="text-gray-500 mt-2 text-sm">Sign in to manage your hiring pipeline</p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-5">
                                    <div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            </div>
                                            <input
                                                type="email"
                                                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                placeholder="Enter your work email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                autoComplete="new-password"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Sign In <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
                                Protected by <span className="font-semibold text-gray-700">HiringAI Secure</span>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
