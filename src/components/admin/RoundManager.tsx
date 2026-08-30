'use client';

import React, { useState } from 'react';
import { Round } from '@/types/leaderboard';
import { Plus, Edit2, Trash2, CheckCircle2, Eye, EyeOff, X } from 'lucide-react';

interface RoundManagerProps {
  leaderboardId: string;
  rounds: Round[];
  onAddRound: (name: string, maxScore?: number | null) => Promise<Round | null>;
  onUpdateRound: (id: string, data: Partial<Round>) => Promise<boolean>;
  onDeleteRound: (id: string) => Promise<boolean>;
}

export function RoundManager({
  leaderboardId,
  rounds,
  onAddRound,
  onUpdateRound,
  onDeleteRound,
}: RoundManagerProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [roundName, setRoundName] = useState(`Week ${rounds.length + 1}`);
  const [maxScore, setMaxScore] = useState<number>(20);
  const [isAdding, setIsAdding] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [editName, setEditName] = useState('');
  const [editMaxScore, setEditMaxScore] = useState<number>(20);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roundName.trim()) return;

    setIsAdding(true);
    try {
      const res = await onAddRound(roundName.trim(), maxScore || null);
      if (res) {
        setAddModalOpen(false);
        setRoundName(`Week ${rounds.length + 2}`);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRound || !editName.trim()) return;

    setIsUpdating(true);
    try {
      const success = await onUpdateRound(editingRound.id, {
        name: editName.trim(),
        max_score: editMaxScore || null,
      });
      if (success) {
        setEditModalOpen(false);
        setEditingRound(null);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTogglePublish = async (round: Round) => {
    await onUpdateRound(round.id, { published: !round.published });
  };

  const handleDelete = async (round: Round) => {
    if (window.confirm(`Are you sure you want to delete round "${round.name}"? Any scores in this round will also be deleted.`)) {
      await onDeleteRound(round.id);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EBEBE6]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl text-[#111111] uppercase tracking-wide">
              Scoring Rounds
            </h2>
            <span className="bg-[#FAF9F5] border border-[#111111] text-[#111111] font-mono text-xs font-bold px-2 py-0.5 rounded-full">
              {rounds.length}
            </span>
          </div>
          <p className="text-xs text-[#666666] font-medium">
            Rounds are completely dynamic. Add weeks, challenges, or custom criteria.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setRoundName(`Week ${rounds.length + 1}`);
            setAddModalOpen(true);
          }}
          className="bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs px-4 py-2 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center gap-1.5 transition-all retro-btn-active cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Round</span>
        </button>
      </div>

      {/* Rounds List */}
      <div className="w-full bg-white border-2 border-[#111111] rounded-lg overflow-hidden retro-shadow">
        <div className="divide-y divide-[#EBEBE6]">
          {rounds.map((round) => (
            <div
              key={round.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-[#FAF9F5] transition-colors"
            >
              {/* Left Order & Name */}
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded bg-[#FAF9F5] border border-[#111111] text-[#111111] font-display text-xs flex items-center justify-center">
                  {round.round_order}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[#111111] uppercase">
                    {round.name}
                  </h3>
                  <p className="text-[11px] text-[#666666]">
                    Max Score: <span className="font-bold text-[#111111]">{round.max_score ?? 'No limit'}</span>
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2">
                {/* Publish Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleTogglePublish(round)}
                  className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    round.published
                      ? 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC] hover:bg-[#BBF7D0]'
                      : 'bg-[#F1F1EE] text-[#666666] border-[#D9D9D4] hover:bg-[#E5E5E0]'
                  }`}
                >
                  {round.published ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#166534]" />
                      <span>Published</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-[#666666]" />
                      <span>Draft</span>
                    </>
                  )}
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingRound(round);
                    setEditName(round.name);
                    setEditMaxScore(round.max_score || 20);
                    setEditModalOpen(true);
                  }}
                  className="p-1.5 border border-[#D9D9D4] hover:border-[#111111] rounded bg-white text-[#111111] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#666666]" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(round)}
                  className="p-1.5 border border-[#D9D9D4] hover:border-[#D91E2E] rounded bg-white text-[#666666] hover:text-[#D91E2E] hover:bg-[#FFF0F2] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {rounds.length === 0 && (
            <div className="p-8 text-center text-xs text-[#666666] font-medium">
              No scoring rounds created yet. Click "+ Add Round" to add your first week.
            </div>
          )}
        </div>
      </div>

      {/* Add Round Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border-2 border-[#111111] rounded-lg max-w-sm w-full p-5 retro-shadow relative">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#666666] hover:text-[#111111]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-lg text-[#111111] uppercase mb-1">
              Add Scoring Round
            </h3>
            <p className="text-xs text-[#666666] mb-4">
              Create a new evaluation round for this leaderboard.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                  Round Name
                </label>
                <input
                  type="text"
                  required
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  placeholder="e.g. Week 8 or UI Design"
                  className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                  Maximum Score
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  placeholder="20"
                  className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isAdding}
                className="w-full bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs py-2.5 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAdding ? 'Creating...' : 'Create Round'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Round Modal */}
      {editModalOpen && editingRound && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border-2 border-[#111111] rounded-lg max-w-sm w-full p-5 retro-shadow relative">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#666666] hover:text-[#111111]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-lg text-[#111111] uppercase mb-1">
              Edit Round
            </h3>
            <p className="text-xs text-[#666666] mb-4">
              Update round name and scoring limits.
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                  Round Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                  Maximum Score
                </label>
                <input
                  type="number"
                  min="1"
                  value={editMaxScore}
                  onChange={(e) => setEditMaxScore(Number(e.target.value))}
                  className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs py-2.5 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
