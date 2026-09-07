import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Participant, Round, Score } from '@/types/leaderboard';
import { 
  Save, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  FileText, 
  X, 
  Sparkles,
  Check
} from 'lucide-react';

interface ScoreTableProps {
  leaderboardId: string;
  participants: Participant[];
  rounds: Round[];
  initialScores: Score[];
  onSaveScores: (scores: { participant_id: string; round_id: string; score: number }[]) => Promise<boolean>;
  onPublishRounds: (roundIds: string[]) => Promise<boolean>;
}

export function ScoreTable({
  leaderboardId,
  participants,
  rounds,
  initialScores,
  onSaveScores,
  onPublishRounds,
}: ScoreTableProps) {
  // Score grid state: key = `${participantId}_${roundId}` -> score (number)
  const [scoreGrid, setScoreGrid] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Save / Publish Choice Modal State
  const [saveChoiceModalOpen, setSaveChoiceModalOpen] = useState(false);

  // Bulk Upload Scores Modal State
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [selectedRoundId, setSelectedRoundId] = useState<string>(rounds[0]?.id || '');
  const [bulkText, setBulkText] = useState('');
  const [bulkResult, setBulkResult] = useState<{
    matched: number;
    unmatched: string[];
    updatedRows: { name: string; score: number }[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep selected round valid when rounds change
  useEffect(() => {
    if (!selectedRoundId && rounds.length > 0) {
      setSelectedRoundId(rounds[0].id);
    }
  }, [rounds, selectedRoundId]);

  // Initialize score matrix
  useEffect(() => {
    const grid: Record<string, number> = {};
    for (const s of initialScores) {
      grid[`${s.participant_id}_${s.round_id}`] = Number(s.score);
    }
    setScoreGrid(grid);
    setHasUnsavedChanges(false);
  }, [initialScores]);

  // Compute row totals
  const rowTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const p of participants) {
      let sum = 0;
      for (const r of rounds) {
        const val = scoreGrid[`${p.id}_${r.id}`] ?? 0;
        sum += val;
      }
      totals[p.id] = sum;
    }
    return totals;
  }, [participants, rounds, scoreGrid]);

  const handleScoreChange = (participantId: string, roundId: string, rawVal: string, maxScore: number | null) => {
    let num = Number(rawVal);
    if (isNaN(num) || num < 0) {
      num = 0;
    }
    if (maxScore !== null && maxScore !== undefined && num > maxScore) {
      num = maxScore;
    }

    setScoreGrid((prev) => ({
      ...prev,
      [`${participantId}_${roundId}`]: num,
    }));
    setHasUnsavedChanges(true);
    setFeedbackMessage(null);
  };

  const handleSave = async (): Promise<boolean> => {
    setIsSaving(true);
    setFeedbackMessage(null);
    try {
      const updates = [];
      for (const p of participants) {
        for (const r of rounds) {
          const val = scoreGrid[`${p.id}_${r.id}`];
          if (val !== undefined) {
            updates.push({
              participant_id: p.id,
              round_id: r.id,
              score: val,
            });
          }
        }
      }

      const success = await onSaveScores(updates);
      if (success) {
        setHasUnsavedChanges(false);
        setFeedbackMessage({ type: 'success', text: 'All score changes saved successfully!' });
        return true;
      } else {
        setFeedbackMessage({ type: 'error', text: "Couldn't save your changes. Please try again." });
        return false;
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'An unexpected error occurred while saving.' });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishAll = async () => {
    setIsPublishing(true);
    setFeedbackMessage(null);
    try {
      // First save any unsaved scores
      const scoresSaved = await handleSave();
      if (!scoresSaved) return;
      // Publish all rounds
      const roundIds = rounds.map((r) => r.id);
      const success = await onPublishRounds(roundIds);
      if (success) {
        setFeedbackMessage({ type: 'success', text: 'All scores and rounds published to public leaderboard!' });
      } else {
        setFeedbackMessage({ type: 'error', text: "Couldn't publish the latest scores." });
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'Error publishing scores.' });
    } finally {
      setIsPublishing(false);
    }
  };

  // Bulk File Upload for Scores
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      setBulkText((prev) => (prev.trim() ? `${prev.trim()}\n${content}` : content));
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Bulk parse and apply scores to scoreGrid
  const handleBulkApplyScores = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoundId) return;

    const targetRound = rounds.find((r) => r.id === selectedRoundId);
    const maxScore = targetRound?.max_score ?? null;

    // Build participant lookups (by name, lowercase normalized, or access code)
    const nameToParticipant = new Map<string, Participant>();
    for (const p of participants) {
      nameToParticipant.set(p.name.trim().toLowerCase(), p);
      if (p.access_code_hint) {
        nameToParticipant.set(p.access_code_hint.trim().toLowerCase(), p);
      }
    }

    const lines = bulkText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const updatedRows: { name: string; score: number }[] = [];
    const unmatched: string[] = [];
    const newScoresToSet: Record<string, number> = {};

    for (const line of lines) {
      // Support comma, tab, or colon separator: "Rahul Nair, 18" or "Rahul Nair \t 18" or "Rahul Nair: 18"
      let parts: string[] = [];
      if (line.includes('\t')) {
        parts = line.split('\t');
      } else if (line.includes(',')) {
        parts = line.split(',');
      } else if (line.includes(':')) {
        parts = line.split(':');
      } else {
        // Fallback: match last token as number e.g. "Rahul Nair 18"
        const match = line.match(/^(.*?)[,\s]+(\d+(?:\.\d+)?)$/);
        if (match) {
          parts = [match[1], match[2]];
        }
      }

      if (parts.length < 2) {
        unmatched.push(line);
        continue;
      }

      const rawIdentifier = parts[0].trim();
      const rawScore = Number(parts[1].trim());

      if (isNaN(rawScore) || rawScore < 0) {
        unmatched.push(line);
        continue;
      }

      let scoreVal = rawScore;
      if (maxScore !== null && scoreVal > maxScore) {
        scoreVal = maxScore;
      }

      const participant = nameToParticipant.get(rawIdentifier.toLowerCase());
      if (participant) {
        newScoresToSet[`${participant.id}_${selectedRoundId}`] = scoreVal;
        updatedRows.push({ name: participant.name, score: scoreVal });
      } else {
        unmatched.push(rawIdentifier);
      }
    }

    // Update grid state
    setScoreGrid((prev) => ({
      ...prev,
      ...newScoresToSet,
    }));
    setHasUnsavedChanges(true);
    setBulkResult({
      matched: updatedRows.length,
      unmatched,
      updatedRows,
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EBEBE6]">
        <div>
          <h2 className="font-display text-xl text-[#111111] uppercase tracking-wide">
            All Scores
          </h2>
          <p className="text-xs text-[#666666] font-medium">
            Enter and manage scores for each round. Auto-computes total ranks.
          </p>
        </div>

        {/* Action Buttons: Bulk Import + Combined Save/Publish */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setBulkResult(null);
              setBulkText('');
              setBulkModalOpen(true);
            }}
            className="bg-white hover:bg-[#FAF9F5] text-[#111111] font-bold text-xs px-3.5 py-2 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center gap-1.5 transition-all retro-btn-active cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#D91E2E]" />
            <span>Bulk Import (Text / Excel)</span>
          </button>

          <button
            type="button"
            onClick={() => setSaveChoiceModalOpen(true)}
            disabled={isSaving || isPublishing}
            className={`px-4 py-2 rounded-md font-bold text-xs uppercase border-2 border-[#111111] retro-shadow-sm flex items-center gap-1.5 transition-all retro-btn-active cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-[#FFD43B] text-[#111111]'
                : 'bg-[#D91E2E] hover:bg-[#A91421] text-white'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>
              {isSaving || isPublishing
                ? 'Processing...'
                : hasUnsavedChanges
                ? 'Save / Publish *'
                : 'Save / Publish'}
            </span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {feedbackMessage && (
        <div
          className={`flex items-center gap-2 p-3 rounded-md border text-xs font-semibold ${
            feedbackMessage.type === 'success'
              ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#166534]'
              : 'bg-[#FFF0F2] border-[#FF9FA6] text-[#A91421]'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Spreadsheet Table Container */}
      <div className="w-full bg-white border-2 border-[#111111] rounded-lg overflow-x-auto retro-shadow">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF9F5] border-b-2 border-[#111111]">
              <th className="py-3 px-4 font-bold text-[#111111] sticky left-0 bg-[#FAF9F5] z-10 min-w-[140px] uppercase tracking-wider">
                Participant
              </th>
              {rounds.map((round) => (
                <th key={round.id} className="py-3 px-3 font-bold text-[#111111] text-center min-w-[80px]">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="uppercase font-bold">{round.name}</span>
                    <span className="text-[10px] text-[#666666] font-medium">
                      {round.max_score ? `/${round.max_score}` : '-'}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[9px] font-semibold">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          round.published ? 'bg-[#16A34A]' : 'bg-[#999999]'
                        }`}
                      />
                    </span>
                  </div>
                </th>
              ))}
              <th className="py-3 px-4 font-display text-[#D91E2E] text-center min-w-[90px] uppercase tracking-wider bg-[#FFF0F2]">
                TOTAL
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EBEBE6]">
            {participants.map((p) => {
              const total = rowTotals[p.id] || 0;
              return (
                <tr key={p.id} className="hover:bg-[#FAF9F5] transition-colors">
                  {/* Participant Name */}
                  <td className="py-2.5 px-4 font-bold text-[#111111] uppercase sticky left-0 bg-white hover:bg-[#FAF9F5] z-10 truncate max-w-[180px]">
                    {p.name}
                  </td>

                  {/* Round Score Inputs */}
                  {rounds.map((round) => {
                    const cellKey = `${p.id}_${round.id}`;
                    const scoreVal = scoreGrid[cellKey] ?? '';

                    return (
                      <td key={round.id} className="py-1 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max={round.max_score ?? undefined}
                          value={scoreVal}
                          onChange={(e) =>
                            handleScoreChange(p.id, round.id, e.target.value, round.max_score)
                          }
                          className="w-14 text-center font-bold text-[#111111] py-1.5 px-1 bg-white border border-[#D9D9D4] rounded focus:border-[#D91E2E] focus:ring-1 focus:ring-[#D91E2E] focus:outline-none transition-all"
                        />
                      </td>
                    );
                  })}

                  {/* Auto-Calculated Total */}
                  <td className="py-2.5 px-4 text-center font-black text-sm text-[#111111] bg-[#FFF0F2]">
                    {total}
                  </td>
                </tr>
              );
            })}

            {participants.length === 0 && (
              <tr>
                <td colSpan={rounds.length + 2} className="py-8 text-center text-[#666666] font-medium">
                  No participants added yet. Add participants first to start scoring.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend Footer */}
      <div className="flex items-center gap-4 text-[11px] font-semibold text-[#666666] pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <span>Published (Visible to students)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#999999]" />
          <span>Unpublished (Admin draft)</span>
        </div>
      </div>

      {/* Save / Publish Choice Modal */}
      {saveChoiceModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border-2 border-[#111111] rounded-lg max-w-sm w-full p-6 retro-shadow relative">
            <button
              type="button"
              onClick={() => setSaveChoiceModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#666666] hover:text-[#111111]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-lg text-[#111111] uppercase mb-1">
              Save or Publish Scores?
            </h3>
            <p className="text-xs text-[#666666] mb-5">
              Choose whether you want to save scores as an admin draft or publish them live to all participants.
            </p>

            <div className="space-y-3">
              {/* Option 1: Save Only */}
              <button
                type="button"
                onClick={async () => {
                  setSaveChoiceModalOpen(false);
                  await handleSave();
                }}
                className="w-full bg-white hover:bg-[#FAF9F5] text-[#111111] font-bold text-xs py-3 px-4 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-2 transition-all retro-btn-active cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes Only (Draft)</span>
              </button>

              {/* Option 2: Save and Publish */}
              <button
                type="button"
                onClick={async () => {
                  setSaveChoiceModalOpen(false);
                  await handlePublishAll();
                }}
                className="w-full bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs py-3 px-4 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-2 transition-all retro-btn-active cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Save & Publish Live</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Scores Modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border-2 border-[#111111] rounded-lg max-w-lg w-full p-6 retro-shadow relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setBulkModalOpen(false);
                setBulkResult(null);
              }}
              className="absolute top-4 right-4 p-1 text-[#666666] hover:text-[#111111]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Upload className="w-5 h-5 text-[#D91E2E]" />
              <h3 className="font-display text-lg text-[#111111] uppercase">
                Bulk Import Scores
              </h3>
            </div>
            <p className="text-xs text-[#666666] mb-4">
              Import scores for all participants at once. Paste names and scores, or upload a <span className="font-bold text-[#111111]">.csv / .txt</span> file.
            </p>

            {bulkResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#DCFCE7] border border-[#86EFAC] rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-[#166534]" />
                    <p className="text-xs font-bold text-[#166534] uppercase">
                      Scores Loaded into Table!
                    </p>
                  </div>
                  <p className="text-xs text-[#166534]">
                    Successfully matched and loaded scores for <span className="font-bold text-sm">{bulkResult.matched}</span> participants into the score table.
                  </p>
                  <p className="text-[11px] text-[#166534] mt-1 font-semibold">
                    Click "Save / Publish" on the dashboard when you're ready to commit these changes!
                  </p>
                  {bulkResult.unmatched.length > 0 && (
                    <p className="text-[11px] text-[#854D0E] mt-2 bg-[#FEF9C3] p-2 rounded border border-[#FDE047]">
                      ⚠️ Unmatched lines ({bulkResult.unmatched.length}): {bulkResult.unmatched.slice(0, 5).join(', ')}{bulkResult.unmatched.length > 5 ? '...' : ''}
                    </p>
                  )}
                </div>

                <div className="max-h-48 overflow-y-auto bg-[#FAF9F5] border border-[#D9D9D4] rounded p-3 text-xs space-y-1">
                  <p className="font-bold text-[#111111] text-[11px] uppercase pb-1 border-b border-[#EBEBE6]">
                    Updated Scores in Table:
                  </p>
                  {bulkResult.updatedRows.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-0.5 font-mono text-[11px]">
                      <span className="font-sans font-bold text-[#111111]">{item.name}</span>
                      <span className="text-[#D91E2E] font-bold">{item.score} pts</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBulkResult(null);
                      setBulkModalOpen(false);
                    }}
                    className="w-full bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs py-2.5 px-4 rounded uppercase cursor-pointer"
                  >
                    Done (Review Table)
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBulkApplyScores} className="space-y-4">
                {/* Select Target Round */}
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                    Select Round / Week to Score
                  </label>
                  <select
                    value={selectedRoundId}
                    onChange={(e) => setSelectedRoundId(e.target.value)}
                    className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-bold text-[#111111] focus:border-[#111111] focus:outline-none"
                  >
                    {rounds.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} (Max: {r.max_score ?? 'No limit'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload Box */}
                <div className="p-3 bg-[#FAF9F5] border-2 border-dashed border-[#D9D9D4] rounded-md text-center hover:border-[#111111] transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="bulk-scores-file-upload"
                  />
                  <label
                    htmlFor="bulk-scores-file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1"
                  >
                    <FileText className="w-6 h-6 text-[#666666]" />
                    <span className="text-xs font-bold text-[#111111] hover:underline">
                      Click to choose a .csv or .txt file
                    </span>
                    <span className="text-[10px] text-[#888888]">
                      e.g., CSV exported from Excel with name and score columns
                    </span>
                  </label>
                </div>

                <div className="text-center text-[10px] font-bold text-[#999999] uppercase tracking-wider">
                  — or paste names & scores below —
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#111111] uppercase">
                      Names and Scores (One per line)
                    </label>
                    <span className="text-[10px] text-[#666666] font-medium">
                      {bulkText.split(/\r?\n/).filter((s) => s.trim().length > 0).length} lines detected
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    required
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`Aardra Santhosh, 18\nAaron Georgy, 20\nAaron T Roy, 15\nAbhijith Roseben, 19`}
                    className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium font-mono text-[#111111] focus:border-[#111111] focus:outline-none"
                  />
                  <p className="text-[10px] text-[#888888] mt-1">
                    Format: <span className="font-mono font-bold">Student Name, Score</span> (or tab-separated from Excel)
                  </p>
                </div>

                <div className="bg-[#FEF9C3] p-2.5 rounded border border-[#FDE047] flex items-start gap-2 text-[11px] text-[#854D0E]">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Scores will be populated into the table for the chosen round. You can review them before clicking Save / Publish.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!bulkText.trim() || rounds.length === 0}
                  className="w-full bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs py-2.5 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-1.5 transition-all retro-btn-active cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>Load Scores into Table</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
