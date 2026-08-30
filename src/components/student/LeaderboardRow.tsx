import React from 'react';
import { RankedParticipant } from '@/types/leaderboard';

interface LeaderboardRowProps {
  participant: RankedParticipant;
  isCurrentUser?: boolean;
}

export function LeaderboardRow({ participant, isCurrentUser }: LeaderboardRowProps) {
  // Format rank number with leading zero if single digit (e.g. "04", "08", "15")
  const formattedRank = participant.rank < 10 ? `0${participant.rank}` : `${participant.rank}`;

  return (
    <div
      className={`w-full flex items-center justify-between py-3 px-3.5 transition-all text-xs sm:text-sm ${
        isCurrentUser
          ? 'bg-[#FFF0F2] border-2 border-[#D91E2E] rounded-md my-1 shadow-sm font-semibold'
          : 'bg-white border-b border-[#EBEBE6] hover:bg-[#FAF9F5]'
      }`}
    >
      {/* Left: Rank Number */}
      <div className="flex items-center gap-3 w-12 flex-shrink-0">
        <span
          className={`font-mono font-bold text-xs sm:text-sm ${
            isCurrentUser ? 'text-[#D91E2E]' : 'text-[#333333]'
          }`}
        >
          {formattedRank}
        </span>
      </div>

      {/* Center: Participant Name */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-1.5 truncate">
          {isCurrentUser && (
            <span className="font-extrabold text-[#D91E2E] text-[11px] sm:text-xs tracking-wider">
              YOU •
            </span>
          )}
          <span
            className={`truncate uppercase font-bold tracking-tight ${
              isCurrentUser ? 'text-[#A91421] font-extrabold' : 'text-[#111111]'
            }`}
          >
            {participant.name}
          </span>
        </div>
      </div>

      {/* Right: Points Total */}
      <div className="flex-shrink-0 text-right">
        <span
          className={`font-black text-xs sm:text-sm tracking-tight ${
            isCurrentUser ? 'text-[#D91E2E]' : 'text-[#111111]'
          }`}
        >
          {participant.totalPoints}{' '}
          <span className={`text-[10px] sm:text-xs font-bold ${isCurrentUser ? 'text-[#A91421]' : 'text-[#666666]'}`}>
            PTS
          </span>
        </span>
      </div>
    </div>
  );
}
