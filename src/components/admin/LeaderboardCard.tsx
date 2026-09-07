import React from 'react';
import Link from 'next/link';
import { Leaderboard } from '@/types/leaderboard';
import { IllustrationRenderer } from '../illustrations/VectorIllustrations';
import { Share2 } from 'lucide-react';

interface LeaderboardCardProps {
  leaderboard: Leaderboard;
  roundCount?: number;
  participantCount?: number;
  onShare: (leaderboard: Leaderboard) => void;
}

export function LeaderboardCard({
  leaderboard,
  roundCount,
  participantCount,
  onShare,
}: LeaderboardCardProps) {
  const actualRoundCount = roundCount !== undefined ? roundCount : (leaderboard.round_count ?? 0);
  const actualParticipantCount = participantCount !== undefined ? participantCount : (leaderboard.participant_count ?? 0);
  const getStatusBadge = () => {
    switch (leaderboard.status) {
      case 'completed':
        return (
          <span className="bg-[#E9D5FF] text-[#6B21A8] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-[#C084FC]">
            Completed
          </span>
        );
      case 'draft':
        return (
          <span className="bg-[#FEF08A] text-[#854D0E] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-[#FACC15]">
            Draft
          </span>
        );
      case 'active':
      default:
        return (
          <span className="bg-[#DCFCE7] text-[#166534] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-[#86EFAC]">
            Active
          </span>
        );
    }
  };

  return (
    <div className="bg-white border-2 border-[#111111] rounded-lg p-5 retro-shadow transition-all hover:translate-y-[-2px] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Main Info */}
      <div className="flex-1 pr-0 sm:pr-4">
        {/* Top Header Row with Title, Badge, and Mobile Illustration */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h2 className="font-display text-lg sm:text-xl text-[#111111] uppercase tracking-wide">
                {leaderboard.title}
              </h2>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-[#666666] font-semibold mb-1">
              {actualRoundCount} {actualRoundCount === 1 ? 'Round' : 'Rounds'} · {actualParticipantCount} {actualParticipantCount === 1 ? 'Participant' : 'Participants'}
            </p>
            <p className="text-[11px] text-[#999999] truncate max-w-[240px] sm:max-w-none">
              Slug: <span className="font-mono text-[#111111]">/leaderboard/{leaderboard.slug}</span>
            </p>
          </div>

          {/* Illustration visible on mobile at top-right - bold and prominent */}
          <div className="sm:hidden flex-shrink-0 self-center pl-1">
            <IllustrationRenderer
              illustrationKey={leaderboard.illustration_key || 'cassette'}
              className="w-24 h-18 xs:w-26 xs:h-20 object-contain drop-shadow-sm transform hover:rotate-3 transition-transform"
            />
          </div>
        </div>

        {/* Action Buttons (Manage & Share) */}
        <div className="flex items-center gap-2.5 mt-4 pt-1 sm:pt-0">
          <Link
            href={`/admin/leaderboards/${leaderboard.slug}`}
            className="flex-1 sm:flex-none text-center bg-white hover:bg-[#FAF9F5] text-[#111111] font-bold text-xs px-5 py-2.5 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase transition-all retro-btn-active"
          >
            Manage
          </Link>
          <button
            type="button"
            onClick={() => onShare(leaderboard)}
            className="flex-1 sm:flex-none justify-center bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs px-5 py-2.5 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center gap-1.5 transition-all retro-btn-active cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Right Decorative Illustration (Desktop / Tablet) */}
      <div className="hidden sm:flex flex-shrink-0 items-center justify-center pl-2">
        <IllustrationRenderer
          illustrationKey={leaderboard.illustration_key || 'cassette'}
          className="w-24 h-18 sm:w-28 sm:h-20 object-contain transform hover:rotate-3 transition-transform"
        />
      </div>
    </div>
  );
}
