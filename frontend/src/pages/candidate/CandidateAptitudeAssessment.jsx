import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useProctoring from '../../hooks/useProctoring';
import API_URL from '../../apiConfig';

const CandidateAptitudeAssessment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    // Config Extraction (Fail-safe)
    const getDuration = () => {
        const assessmentData = localStorage.getItem('currentAssessment');
        if (!assessmentData) return 30 * 60;
        const info = JSON.parse(assessmentData);
        return (info.config?.duration || 30) * 60;
    };

    const [timeLeft, setTimeLeft] = useState(getDuration());
    const [submitted, setSubmitted] = useState(false);

    // Proctoring Integration
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');

    const { violations } = useProctoring({
        enabled: !loading && !submitted,
        maxViolations: 3,
        onViolation: (reason, count) => {
            setWarningMessage(`Malpractice Detected: ${reason}. This attempt has been logged.`);
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 5000); // Auto-hide warning after 5s
        },
        onTerminalViolation: (reason) => {
            handleSubmit(`Malpractice - ${reason}`);
            setTerminalMessage(`Maximum violations reached (${reason}). Your assessment has been submitted automatically.`);
            setShowTerminalOverlay(true);
        }
    });

    const [scoreResult, setScoreResult] = useState(null); // To store result after submission
    const [showTerminalOverlay, setShowTerminalOverlay] = useState(false);
    const [terminalMessage, setTerminalMessage] = useState('');

    // Load Context
    useEffect(() => {
        const assessmentData = localStorage.getItem('currentAssessment');
        const assessment = assessmentData ? JSON.parse(assessmentData) : null;

        if (!assessment) {
            alert("No active assessment found.");
            navigate('/portal/login');
            return;
        }

        const config = assessment.config || {};

        // SYNC FIX: Update Timer if different from initial state
        if (config.duration) {
            setTimeLeft((prev) => {
                // Only update if significantly different (avoid reset on small re-renders)
                // Actually, for a fresh load, we trust the config.
                // For anti-cheat resume, we might need more logic, but user Asked for "Admin config duration".
                return config.duration * 60;
            });
        }

        // Check for Backend-Generated Questions (Real AI)
        if (config.generated_questions && config.generated_questions.length > 0) {
            console.log("Using Backend AI Generated Questions");
            setQuestions(config.generated_questions);
            setLoading(false);
            return;
        }

        // ... Existing Local Storage Check (Optional, but Backend is source of truth) ...
        // If Backend didn't provide questions, it means lazy gen failed or is slow.
        // We should encourage backend reliance to ensure SCORING INTEGRITY.
        console.warn("No questions found in config. Local generation disabled.");
        setLoading(false);

    }, [navigate]);

    // Timer Logic
    useEffect(() => {
        if (!loading && !submitted && timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else if (timeLeft === 0 && !submitted) {
            handleSubmit();
        }
    }, [loading, timeLeft, submitted]);

    const handleSubmit = async (forcedStatus = null) => {
        // Prevent double submission
        if (submitted) return;

        // If forcedStatus is provided (proctoring auto-submit), set submitted true immediately to disable hook
        if (forcedStatus) setSubmitted(true);

        const token = localStorage.getItem('candidateToken');
        if (!token) {
            alert("Session expired. Please login again.");
            navigate('/portal/login');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/assessments/submit/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ answers, status: forcedStatus })
            });

            if (response.ok) {
                const data = await response.json();
                setSubmitted(true);
                // Capture Score Result directly from backend response for immediate display
                // Backend returns 'score' (0-10) or we can parse status
                if (data.score !== undefined) {
                    setScoreResult(data.score * 10); // Convert to percentage
                } else if (data.status && data.status.startsWith('Submitted:')) {
                    // Fallback parse
                    const parts = data.status.split(': ')[1].split('/');
                    if (parts.length === 2) {
                        setScoreResult(Math.round((parseInt(parts[0]) / parseInt(parts[1])) * 100));
                    }
                }
            } else {
                alert("Failed to submit assessment. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Network error. Please check connection.");
        }
    };
    // ANTI-MALPRACTICE: Prevent Back Button / Refresh (Handled by useProctoring, keeping keepalive sync for hard exits)
    useEffect(() => {
        const handleUnload = (e) => {
            if (!submitted) {
                const token = localStorage.getItem('candidateToken');
                fetch(`${API_URL}/api/assessments/submit/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ answers, status: 'Malpractice - Assessment Abandoned' }),
                    keepalive: true
                });
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [answers, submitted]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleAnswer = (optionIdx) => {
        // CRITICAL FIX: Use question.id instead of array index to match backend answer_key
        const questionId = questions[currentQuestion]?.id;
        if (questionId !== undefined) {
            setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    // ... (Anti-Cheat hooks remain same)

    if (submitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Completed</h2>

                    {/* Score Hidden for Candidate - Admin Only */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Thank You!</h3>
                        <p className="text-blue-800">
                            Your assessment has been successfully submitted and recorded.
                        </p>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Thank you for completing the aptitude assessment. Your responses have been recorded.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-1">What's Next?</h3>
                        <p className="text-sm text-blue-700">
                            Our recruiting team will review your performance. You will be notified via email about the next steps.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/portal/login')}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Return to Portal
                    </button>
                </motion.div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <h2 className="mt-4 text-xl font-semibold text-gray-700">Generating AI Assessment...</h2>
                <p className="text-gray-500">Analyzing job context and creating unique questions.</p>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-800">No Questions Available</h2>
                <p className="text-gray-600 mt-2 mb-6">
                    We couldn't load the assessment questions. This might be a temporary connection issue.
                </p>
                <button
                    onClick={() => {
                        window.location.reload();
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Warning Banner */}
            <AnimatePresence>
                {showWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-6 py-4 shadow-2xl"
                    >
                        <div className="max-w-5xl mx-auto flex items-center gap-4">
                            <AlertCircle size={28} className="flex-shrink-0 animate-pulse" />
                            <div className="flex-1">
                                <p className="font-bold text-lg">{warningMessage}</p>
                                <p className="text-sm text-red-100 mt-1">Warning: {violations}/3 - Further violations will result in automatic submission.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Terminal Violation Overlay */}
            <AnimatePresence>
                {showTerminalOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[200] bg-gray-950/90 backdrop-blur-md flex items-center justify-center p-4 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gray-900 border border-red-500/50 p-8 rounded-2xl max-w-md shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={40} className="text-red-500 animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Assessment Terminated</h2>
                            <p className="text-gray-400 mb-8">{terminalMessage}</p>
                            <button
                                onClick={() => navigate('/portal/login')}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
                            >
                                Return to Portal
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Bar */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Aptitude Assessment</h1>
                        <p className="text-xs text-gray-500">Question {currentQuestion + 1} of {questions.length}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        <Clock size={20} />
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-8 flex flex-col">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex-1 flex flex-col"
                >
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
                            {questions[currentQuestion]?.question || "Question loading error..."}
                        </h3>
                    </div>

                    <div className="space-y-3 mb-8">
                        {(questions[currentQuestion]?.options || []).map((option, idx) => {
                            const questionId = questions[currentQuestion]?.id;
                            const isSelected = answers[questionId] === idx;

                            return (
                                <label
                                    key={idx}
                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${isSelected ? 'border-blue-600' : 'border-gray-300'
                                        }`}>
                                        {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name={`question-${questionId}`}
                                        className="hidden"
                                        checked={isSelected}
                                        onChange={() => handleAnswer(idx)}
                                    />
                                    <span className={`text-base ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                                        {option}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between">
                        <button
                            onClick={handlePrev}
                            disabled={currentQuestion === 0}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${currentQuestion === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Previous
                        </button>

                        {currentQuestion === questions.length - 1 ? (
                            <button
                                onClick={() => handleSubmit()}
                                className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
                            >
                                Submit Assessment
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                            >
                                Next Question
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Progress Bar */}
                <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-4 overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                    <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
            </div>
        </div>
    );
};

export default CandidateAptitudeAssessment;
