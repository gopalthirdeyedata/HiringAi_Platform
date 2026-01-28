import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, Clock, Terminal, BookOpen, Code2 } from 'lucide-react';

const CodingTest = () => {
    const [code, setCode] = useState('// Write your code here\nconsole.log("Hello World");');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript');

    const handleRun = () => {
        setOutput('Running...\n> Hello World');
    };

    const handleSubmit = () => {
        // Submit logic
        alert("Code Submitted!");
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <Code2 className="text-blue-600" /> Coding Assessment
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Solve the standard algorithm and data structure problems.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-amber-600 font-medium">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono">45:00</span>
                    </div>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
                    >
                        <option value="python">Python 3</option>
                        <option value="javascript">JavaScript (Node)</option>
                        <option value="java">Java 15</option>
                        <option value="cpp">C++ (GCC)</option>
                        <option value="c">C (GCC)</option>
                        <option value="go">Go (Golang)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
                {/* Problem Statement */}
                <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2 font-semibold text-gray-700">
                        <BookOpen size={18} className="text-blue-500" /> Problem Description
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Two Sum</h3>
                        <div className="prose prose-sm prose-gray max-w-none">
                            <p className="text-gray-600 leading-relaxed">
                                Given an array of integers <code className="bg-gray-100 px-1 rounded text-red-500 font-mono">nums</code> and an integer <code className="bg-gray-100 px-1 rounded text-red-500 font-mono">target</code>, return indices of the two numbers such that they add up to target.
                            </p>
                            <p className="text-gray-600 mt-4 leading-relaxed">
                                You may assume that each input would have exactly one solution, and you may not use the same element twice.
                            </p>

                            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-2">Example 1</h4>
                                <pre className="font-mono text-xs text-gray-700 whitespace-pre-wrap">
                                    <span className="font-bold text-blue-600">Input:</span> nums = [2,7,11,15], target = 9{'\n'}
                                    <span className="font-bold text-blue-600">Output:</span> [0,1]{'\n'}
                                    <span className="font-bold text-blue-600">Explanation:</span> Because nums[0] + nums[1] == 9, we return [0, 1].
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Editor */}
                <div className="lg:col-span-2 flex flex-col gap-4 h-full min-h-0">
                    <div className="flex-1 border border-gray-300 rounded-xl overflow-hidden shadow-lg shadow-blue-900/5 ring-4 ring-gray-50">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 15,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 20 },
                            }}
                        />
                    </div>

                    <div className="h-40 bg-white border border-gray-200 rounded-xl flex flex-col shadow-sm overflow-hidden">
                        <div className="p-2 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                            <Terminal size={14} /> Output Terminal
                        </div>
                        <div className="p-4 font-mono text-sm text-gray-900 flex-1 overflow-y-auto bg-white">
                            {output || <span className="text-gray-400 italic">// Run code to see output here...</span>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={handleRun} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2">
                            <Play className="w-4 h-4 fill-current" /> Run Code
                        </button>
                        <button onClick={handleSubmit} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
                            <Send className="w-4 h-4" /> Submit Solution
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingTest;
