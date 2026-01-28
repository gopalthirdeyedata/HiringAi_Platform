import React, { useState, useEffect } from 'react';
import API_URL from '../apiConfig';
import { Code2 } from 'lucide-react';
import CandidateTable from '../components/CandidateTable';
import ConfirmationModal from '../components/ConfirmationModal';

const CodingRound = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmation, setConfirmation] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/resume/candidates/`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCandidates(data.filter(c => c.stage === 'Coding Round'));
            }
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handlePromote = async (candidateIds, stage) => {
        if (!candidateIds || candidateIds.length === 0) return;

        // Check eligibility
        const selected = candidates.filter(c => candidateIds.includes(c.id));
        const ineligible = selected.filter(c => {
            const status = c.status || '';
            const isCompleted = status === 'Completed' || status.startsWith('Submitted');
            return !isCompleted || (c.score || 0) < 60;
        });

        let message = `Are you sure you want to promote ${candidateIds.length} candidate(s) to ${stage === 'NEXT' ? 'the NEXT stage' : stage}?`;
        if (ineligible.length > 0) {
            message = `WARNING: ${ineligible.length} candidate(s) are not eligible (Low Score or Incomplete).\n\n` + message;
        }

        setConfirmation({
            isOpen: true,
            title: 'Confirm Promotion',
            message: message,
            type: ineligible.length > 0 ? 'warning' : 'info',
            confirmText: 'Promote Candidates',
            onConfirm: () => executePromote(candidateIds, stage)
        });
    };

    const executePromote = async (candidateIds, stage) => {
        try {
            const res = await fetch(`${API_URL}/api/resume/candidates/bulk-update/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    candidate_ids: candidateIds,
                    stage: stage || 'NEXT'
                })
            });

            if (res.ok) {
                alert('Candidates promoted successfully!');
                fetchCandidates();
            } else {
                const errorData = await res.json();
                alert(`Failed to promote: ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Promotion failed:", error);
            alert('An error occurred during promotion.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <Code2 className="text-blue-600" /> Coding Round Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor candidate progress and evaluate submissions.</p>
                </div>
            </div>

            <CandidateTable
                candidates={candidates}
                currentStage="Coding Round"
                onRefresh={fetchCandidates}
                showRoleColumn={true}
                onPromote={handlePromote}
            />

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                type={confirmation.type}
                confirmText={confirmation.confirmText}
            />
        </div>
    );
};

export default CodingRound;
