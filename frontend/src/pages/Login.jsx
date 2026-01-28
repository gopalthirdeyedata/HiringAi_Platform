import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth'; // To be implemented

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login for now
        setTimeout(() => setIsLoading(false), 2000);
        console.log("Login attempt", { email, password });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">HiringAI</h1>
                <p className="text-gray-400 mt-2">Enterprise Log In</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field pl-10"
                            placeholder="admin@company.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field pl-10"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary disabled:opacity-50 flex justify-center items-center"
                >
                    {isLoading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                    ) : 'Sign In'}
                </button>
            </form>

            <p className="mt-6 text-sm text-gray-500">
                Forgot password? <a href="#" className="text-primary hover:underline">Contact Support</a>
            </p>
        </motion.div>
    );
};

export default Login;
