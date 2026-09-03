'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Participant, Round, Score } from '@/types/leaderboard';
import { Save, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

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

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md font-bold text-xs uppercase border-2 border-[#111111] retro-shadow-sm flex items-center gap-1.5 transition-all retro-btn-active cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-[#FFD43B] text-[#111111]'
                : 'bg-white text-[#111111] hover:bg-[#FAF9F5]'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>

          <button
            type="button"
            onClick={handlePublishAll}
            disabled={isPublishing}
            className="bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs px-4 py-2 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center gap-1.5 transition-all retro-btn-active cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing...' : 'Publish Changes'}</span>
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
    </div>
  );
}
