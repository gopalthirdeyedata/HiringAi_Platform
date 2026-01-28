import { SignIn } from '@clerk/clerk-react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminSignIn() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Lighter backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal content */}
            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute -top-12 right-0 text-white/90 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Subtle glow around white card */}
                <div className="rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)]">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "mx-auto",
                                card: "shadow-none" // Keep default white
                            }
                        }}
                        routing="virtual"
                        afterSignInUrl="/dashboard"
                    />
                </div>
            </div>
        </div>
    );
}
