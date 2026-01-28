import React, { useState, useEffect } from 'react';
import {
    Save, Building2, GitBranch, Shield, Bell,
    Mail, Workflow, Database, AlertTriangle, FileText,
    Settings, Key, Download, Trash2, CheckCircle
} from 'lucide-react';
import API_URL from '../apiConfig';

const GlobalSettings = () => {
    const [activeTab, setActiveTab] = useState('organization');
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock Store state - in real app, these would come from context/API
    const [formData, setFormData] = useState({
        orgName: 'Acme Corp',
        timezone: 'UTC-5 (EST)',
        apiKey: 'sk_live_xxxxxxxx',
        pipeline: {
            screeningScore: 75,
            autoReject: true,
            stages: ['Resume Screening', 'Aptitude Round', 'Coding Round', 'Technical Interview', 'Offer']
        },
        notifications: {
            emailAlerts: true,
            slackIntegration: false,
            weeklyDigest: true
        }
    });

    useEffect(() => {
        fetch(`${API_URL}/api/settings/`)
            .then(res => res.json())
            .then(data => {
                // Ensure we merge with defaults to avoid undefined errors if backend is empty
                if (data) {
                    setFormData(prev => ({ ...prev, ...data }));
                }
            })
            .catch(err => console.error("Failed to load settings", err));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/settings/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth header if needed, assuming open or same token logic
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ config: formData })
            });

            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save settings. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'organization', label: 'Organization', icon: Building2 },
        { id: 'pipeline', label: 'Hiring Pipeline', icon: Workflow },
        { id: 'assessments', label: 'Assessments', icon: FileText },
        { id: 'roles', label: 'Job Roles', icon: Database },
        { id: 'scoring', label: 'AI Scoring', icon: BrainCircuitIcon },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'email', label: 'Email Templates', icon: Mail },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'export', label: 'Export Data', icon: Download },
        { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true },
    ];

    return (
        <div className="max-w-[1200px] mx-auto pb-20">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <Settings className="text-gray-600" /> Global Settings
                    </h1>
                    <p className="text-gray-500 mt-2">Manage your organization, hiring pipeline, and AI configurations centrally.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                    {saving ? (
                        <>Saving...</>
                    ) : showSuccess ? (
                        <><CheckCircle size={20} /> Saved!</>
                    ) : (
                        <><Save size={20} /> Save Changes</>
                    )}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                        <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-500 text-xs uppercase tracking-wider">
                            Configuration
                        </div>
                        <nav className="flex flex-col p-2 space-y-1">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left
                                            ${isActive
                                                ? 'bg-blue-50 text-blue-700'
                                                : tab.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    {/* ORGANIZATION SETTINGS */}
                    {activeTab === 'organization' && (
                        <Section title="Organization Profile" description="Basic details about your company workspace.">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Company Name" value={formData.orgName} />
                                <Input label="Workspace URL" value="acme.hiring.ai" disabled suffix=".hiring.ai" />
                                <Select label="Default Timezone" options={['UTC-8 (PST)', 'UTC-5 (EST)', 'UTC+0 (GMT)', 'UTC+5:30 (IST)']} />
                                <Input label="Support Email" value="admin@acme.com" />
                            </div>
                        </Section>
                    )}

                    {/* PIPELINE SETTINGS */}
                    {activeTab === 'pipeline' && (
                        <Section title="Hiring Pipeline" description="Configure the stages and flow of your recruitment process.">
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-wrap gap-2">
                                    {formData.pipeline.stages.map((stage, i) => (
                                        <div key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                            {stage}
                                        </div>
                                    ))}
                                    <button className="px-3 py-1.5 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
                                        + Add Stage
                                    </button>
                                </div>
                                <Toggle label="Auto-reject below threshold" description="Automatically reject candidates who score below 40% in Resume Screening." checked={formData.pipeline.autoReject} />
                                <Toggle label="Require Approval for Offer" description="Offers must be approved by an Admin before sending." checked={true} />
                            </div>
                        </Section>
                    )}

                    {/* AI SCORING */}
                    {activeTab === 'scoring' && (
                        <Section title="AI Scoring Weights" description="Adjust how the AI prioritizes different factors.">
                            <div className="space-y-6">
                                <Range label="Skills Match" value={40} />
                                <Range label="Experience Relevance" value={30} />
                                <Range label="Education Fit" value={20} />
                                <Range label="Cultural Alignment" value={10} />
                                <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start gap-3">
                                    <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                                    Total weight must equal 100%. Adjust sliders carefully.
                                </div>
                            </div>
                        </Section>
                    )}

                    {/* DANGER ZONE */}
                    {activeTab === 'danger' && (
                        <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-red-100">
                                <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                                    <AlertTriangle size={20} /> Danger Zone
                                </h3>
                                <p className="text-red-600/80 text-sm mt-1">Irreversible actions. Proceed with caution.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-900">Reset Pipeline Data</h4>
                                        <p className="text-sm text-gray-500">Archives all current candidates and resets stats.</p>
                                    </div>
                                    <button className="px-4 py-2 bg-white border border-red-300 text-red-600 font-bold rounded-lg hover:bg-red-50">
                                        Archive All
                                    </button>
                                </div>
                                <div className="h-px bg-red-200/50"></div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-900">Delete Workspace</h4>
                                        <p className="text-sm text-gray-500">Permanently delete this organization and all data.</p>
                                    </div>
                                    <button className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">
                                        Delete Forever
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {!['organization', 'pipeline', 'scoring', 'danger'].includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-xl border-dashed">
                            <Settings className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Configure {tabs.find(t => t.id === activeTab)?.label}</h3>
                            <p className="text-gray-500">Settings for this section coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Reusable Components ---

const Section = ({ title, description, children }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const Input = ({ label, value, disabled, suffix }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <div className="relative">
            <input
                type="text"
                defaultValue={value}
                disabled={disabled}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none disabled:text-gray-500"
            />
            {suffix && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    {suffix}
                </span>
            )}
        </div>
    </div>
);

const Select = ({ label, options }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none">
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

const Toggle = ({ label, description, checked }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div>
            <h4 className="font-bold text-gray-900 text-sm">{label}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={checked} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    </div>
);

const Range = ({ label, value }) => (
    <div className="space-y-3">
        <div className="flex justify-between">
            <label className="font-semibold text-gray-700 text-sm">{label}</label>
            <span className="font-bold text-blue-600 text-sm">{value}%</span>
        </div>
        <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" defaultValue={value} />
    </div>
);

// Icon for AI Brain
const BrainCircuitIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" /><path d="M3.477 10.896a4 4 0 0 1 .585-.396" /><path d="M19.938 10.5a4 4 0 0 1 .585.396" /><path d="M6 18a4 4 0 0 1-1.97-3.284" /><path d="M17.97 14.716A4 4 0 0 1 18 18" /></svg>
);

export default GlobalSettings;
