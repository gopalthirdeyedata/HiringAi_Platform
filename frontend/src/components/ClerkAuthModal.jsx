import { SignIn, SignUp, useClerk } from '@clerk/clerk-react';
import { X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function ClerkAuthModal({ isOpen, onClose, mode = 'sign-in' }) {
    const { user } = useClerk();
    const navigate = useNavigate();
    const wasSignedInRef = useRef(!!user);

    // Only redirect on NEW sign-in, not when modal opens with existing session
    useEffect(() => {
        if (user && !wasSignedInRef.current && isOpen) {
            // User just signed in (wasn't signed in before)
            onClose();
            navigate('/dashboard');
        }
        wasSignedInRef.current = !!user;
    }, [user, isOpen, onClose, navigate]);

    if (!isOpen) return null;

    // If user is already signed in, show a message instead of sign-in form
    if (user) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                <div className="relative z-10 w-full max-w-md mx-4">
                    <button
                        onClick={onClose}
                        className="absolute -top-12 right-0 text-white/90 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="bg-white rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)] p-8 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Signed In</h2>
                        <p className="text-gray-600 mb-6">You're already authenticated as <span className="font-semibold">{user.primaryEmailAddress?.emailAddress}</span></p>
                        <button
                            onClick={() => {
                                onClose();
                                navigate('/dashboard');
                            }}
                            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Lighter backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal content */}
            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white/90 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Subtle glow around white card */}
                <div className="rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)]">
                    {mode === 'sign-in' ? (
                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "mx-auto",
                                    card: "shadow-none",
                                    formFieldInput: "[autocomplete:off]"
                                }
                            }}
                            routing="virtual"
                        />
                    ) : (
                        <SignUp
                            appearance={{
                                elements: {
                                    rootBox: "mx-auto",
                                    card: "shadow-none",
                                    formFieldInput: "[autocomplete:off]"
                                }
                            }}
                            routing="virtual"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
