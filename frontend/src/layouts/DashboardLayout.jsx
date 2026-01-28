import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, FileText, Code2, Users,
    Mic, ChevronLeft, ChevronRight, LogOut, Settings,
    BrainCircuit, UserCheck, Layers
} from 'lucide-react';
import GlobalNavbar from '../components/GlobalNavbar';

const SidebarItem = ({ icon: Icon, label, path, isOpen }) => {
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <Link to={path} className="focus:outline-none group block">
            <div
                className={`relative flex items-center gap-3 px-3 py-3 mx-2 rounded-xl transition-all duration-200 cursor-pointer ${isActive
                    ? 'bg-blue-600/10 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
            >
                {isActive && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                )}

                <Icon size={20} className={`z-10 transition-colors ${isActive ? 'text-blue-400' : 'group-hover:text-blue-200'}`} />

                {isOpen && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`text-[14px] font-medium whitespace-nowrap z-10 ${isActive ? 'text-white' : 'group-hover:text-gray-200'}`}
                    >
                        {label}
                    </motion.span>
                )}
            </div>
        </Link>
    );
};

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden font-sans antialiased text-gray-900 selection:bg-blue-100 selection:text-blue-900">
            {/* 1. Global Navbar (Fixed Height) */}
            <div className="flex-none z-50 shadow-sm relative">
                <GlobalNavbar />
            </div>

            {/* 2. Main Layout (Fills remaining height) */}
            <div className="flex flex-1 overflow-hidden relative pt-16">

                {/* Sidebar */}
                <motion.div
                    initial={false}
                    animate={{ width: isSidebarOpen ? 260 : 80 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-[#0f172a] border-r border-slate-800 flex flex-col h-full z-40 shadow-xl relative"
                >
                    {/* Toggle */}
                    <div className="absolute -right-3 top-6 z-50">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-1.5 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 hover:scale-110 transition-all border-2 border-[#0f172a]"
                        >
                            {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                        </button>
                    </div>

                    {/* Scrollable Menu */}
                    <div className="flex-1 overflow-y-auto no-scrollbar py-8 space-y-10">
                        {/* Pipeline Stages */}
                        <div className="px-3">
                            {isSidebarOpen && (
                                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3 flex items-center gap-2">
                                    <BrainCircuit size={14} className="text-blue-500" /> Recruitment Pipeline
                                </h3>
                            )}
                            {!isSidebarOpen && <div className="h-4" />}
                            <div className="space-y-1">
                                <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" isOpen={isSidebarOpen} />
                                <SidebarItem icon={Layers} label="Rounds Manager" path="/recruitment/rounds" isOpen={isSidebarOpen} />
                                <SidebarItem icon={FileText} label="Resume Screening" path="/resume-screening" isOpen={isSidebarOpen} />
                                <SidebarItem icon={BrainCircuit} label="Screened Candidates" path="/screened-candidates" isOpen={isSidebarOpen} />
                                <SidebarItem icon={UserCheck} label="Aptitude Round" path="/aptitude-round" isOpen={isSidebarOpen} />
                                <SidebarItem icon={Code2} label="Coding Round" path="/coding-round" isOpen={isSidebarOpen} />
                                <SidebarItem icon={Mic} label="Technical Interview" path="/technical-interview" isOpen={isSidebarOpen} />
                            </div>
                        </div>

                        {/* Management */}
                        <div className="px-3">
                            {isSidebarOpen && <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">Management</h3>}
                            <div className="space-y-1">
                                <SidebarItem icon={Users} label="All Candidates" path="/candidates" isOpen={isSidebarOpen} />
                                {/* <SidebarItem icon={Settings} label="Global Settings" path="/settings" isOpen={isSidebarOpen} /> */}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <main className="flex-1 h-full overflow-y-auto bg-gray-50/50 p-4 md:p-8 relative scroll-smooth w-full">
                    <div className="max-w-[1600px] mx-auto pb-20">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
