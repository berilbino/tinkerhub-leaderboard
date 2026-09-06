'use client';

import React, { useState, useEffect } from 'react';
import { Leaderboard } from '@/types/leaderboard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { LeaderboardCard } from '@/components/admin/LeaderboardCard';
import { CreateLeaderboardModal } from '@/components/admin/CreateLeaderboardModal';
import { ShareModal } from '@/components/admin/ShareModal';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, Trophy } from 'lucide-react';
import { RetroStar } from '@/components/illustrations/VectorIllustrations';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sharingLeaderboard, setSharingLeaderboard] = useState<Leaderboard | null>(null);

  const fetchLeaderboards = async () => {
    try {
      const res = await fetch('/api/admin/leaderboards');
      const json = await res.json();
      if (json.success && json.leaderboards) {
        setLeaderboards(json.leaderboards);
      }
    } catch (err) {
      console.error('Failed to load leaderboards', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/admin/session').then((res) => {
      if (!res.ok) {
        router.replace('/admin/login');
        return;
      }
      fetchLeaderboards();
    }).catch(() => router.replace('/admin/login'));
  }, [router]);

  const handleCreateLeaderboard = async (data: {
    title: string;
    subtitle?: string | null;
    slug: string;
    illustration_key?: string;
  }) => {
    try {
      const res = await fetch('/api/admin/leaderboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.leaderboard) {
        setLeaderboards((prev) => [json.leaderboard, ...prev]);
        return json.leaderboard;
      }
      return null;
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col md:flex-row text-[#111111]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-5xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-[#111111] uppercase tracking-wide">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] font-medium mt-0.5">
              Create and manage all your leaderboards in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-md border-2 border-[#111111] retro-shadow uppercase flex items-center justify-center gap-2 transition-all retro-btn-active cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Leaderboard</span>
          </button>
        </div>

        {/* Leaderboards List */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 border-3 border-[#D91E2E] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-[#666666] uppercase">Loading leaderboards...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboards.map((board) => (
              <LeaderboardCard
                key={board.id}
                leaderboard={board}
                roundCount={board.round_count}
                participantCount={board.participant_count}
                onShare={(l) => setSharingLeaderboard(l)}
              />
            ))}

            {leaderboards.length === 0 && (
              <div className="bg-white border-2 border-dashed border-[#D9D9D4] rounded-lg p-12 text-center">
                <Trophy className="w-12 h-12 text-[#999999] mx-auto mb-3" />
                <h3 className="font-display text-lg text-[#111111] uppercase mb-1">
                  No Leaderboards Yet
                </h3>
                <p className="text-xs text-[#666666] mb-4">
                  Get started by creating your first TinkerHub event leaderboard.
                </p>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs px-4 py-2 rounded-md border-2 border-[#111111] uppercase inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Leaderboard</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Leaderboard Modal */}
        {createModalOpen && (
          <CreateLeaderboardModal
            onClose={() => setCreateModalOpen(false)}
            onCreate={handleCreateLeaderboard}
          />
        )}

        {/* Share Modal */}
        {sharingLeaderboard && (
          <ShareModal
            leaderboard={sharingLeaderboard}
            onClose={() => setSharingLeaderboard(null)}
          />
        )}
      </main>
    </div>
  );
}
