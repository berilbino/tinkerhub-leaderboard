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
  roundCount = 7,
  participantCount = 28,
  onShare,
}: LeaderboardCardProps) {
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
    <div className="bg-white border-2 border-[#111111] rounded-lg p-5 retro-shadow transition-all hover:translate-y-[-2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Left Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
          <h2 className="font-display text-lg sm:text-xl text-[#111111] uppercase tracking-wide">
            {leaderboard.title}
          </h2>
          {getStatusBadge()}
        </div>

        <p className="text-xs text-[#666666] font-semibold mb-1">
          {roundCount} {roundCount === 1 ? 'Round' : 'Rounds'} · {participantCount} Participants
        </p>
        <p className="text-[11px] text-[#999999]">
          Slug: <span className="font-mono text-[#111111]">/leaderboard/{leaderboard.slug}</span>
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Link
            href={`/admin/leaderboards/${leaderboard.slug}`}
            className="bg-white hover:bg-[#FAF9F5] text-[#111111] font-bold text-xs px-4 py-2 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase transition-all retro-btn-active"
          >
            Manage
          </Link>
          <button
            type="button"
            onClick={() => onShare(leaderboard)}
            className="bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs px-4 py-2 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center gap-1.5 transition-all retro-btn-active cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Right Decorative Illustration */}
      <div className="flex-shrink-0 self-center sm:self-auto pr-2">
        <IllustrationRenderer
          illustrationKey={leaderboard.illustration_key || 'cassette'}
          className="w-24 h-18 sm:w-28 sm:h-20 transform hover:rotate-3 transition-transform"
        />
      </div>
    </div>
  );
}
