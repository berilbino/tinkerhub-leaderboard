import React from 'react';
import { RankedParticipant } from '@/types/leaderboard';

interface PodiumProps {
  top3: RankedParticipant[];
  currentParticipantId?: string | null;
}

export function Podium({ top3, currentParticipantId }: PodiumProps) {
  const p1 = top3[0]; // 1st in sorted order (Center)
  const p2 = top3[1]; // 2nd in sorted order (Left)
  const p3 = top3[2]; // 3rd in sorted order (Right)

  if (!p1) return null;

  return (
    <div className="w-full max-w-2xl mx-auto pt-6 pb-2 px-1 sm:px-4">
      {/* 3-Column Podium Grid aligned at bottom */}
      <div className="grid grid-cols-3 items-end gap-2 sm:gap-4 md:gap-6">
        
        {/* LEFT BLOCK (2nd participant, Retro Blue) */}
        {p2 ? (
          <div className="flex flex-col items-center">
            {/* Number Pill / Badge with their actual rank */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-[#111111] text-white flex items-center justify-center font-display text-xs sm:text-sm md:text-base border-2 border-white shadow-sm -mb-3.5 md:-mb-4 z-10">
              {p2.rank}
            </div>

            {/* Podium Block */}
            <div
              className={`w-full h-28 sm:h-36 md:h-44 bg-[#8EC5FF] border-2 md:border-3 border-[#111111] rounded-t-lg pt-5 sm:pt-6 md:pt-8 px-1 sm:px-3 pb-2 flex flex-col items-center justify-between text-center transition-all ${
                p2.id === currentParticipantId ? 'ring-3 ring-[#D91E2E] shadow-md' : 'retro-shadow-sm'
              }`}
            >
              <div className="w-full overflow-hidden">
                {p2.id === currentParticipantId && (
                  <span className="inline-block bg-[#D91E2E] text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded uppercase mb-0.5">
                    YOU
                  </span>
                )}
                <h3 className="font-bold text-[11px] sm:text-xs md:text-sm text-[#111111] uppercase leading-tight truncate px-0.5">
                  {p2.name}
                </h3>
              </div>

              <div className="mt-auto">
                <span className="font-black text-xs sm:text-sm md:text-base text-[#111111]">
                  {p2.totalPoints} <span className="text-[10px] sm:text-xs font-bold text-[#333333]">PTS</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-28 sm:h-36" />
        )}

        {/* CENTER BLOCK (1st participant, Retro Yellow - Tallest & Prominent) */}
        {p1 && (
          <div className="flex flex-col items-center">
            {/* Crown / Golden Badge with their actual rank */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full bg-[#FFD43B] text-[#111111] flex items-center justify-center font-display text-sm sm:text-base md:text-lg border-2 border-[#111111] shadow-sm -mb-4 md:-mb-5 z-10">
              {p1.rank}
            </div>

            {/* Podium Block */}
            <div
              className={`w-full h-36 sm:h-44 md:h-54 bg-[#FFD43B] border-2 md:border-3 border-[#111111] rounded-t-lg pt-6 sm:pt-7 md:pt-9 px-1 sm:px-3 pb-2.5 flex flex-col items-center justify-between text-center transition-all ${
                p1.id === currentParticipantId ? 'ring-3 ring-[#D91E2E] shadow-md' : 'retro-shadow'
              }`}
            >
              <div className="w-full overflow-hidden">
                {p1.id === currentParticipantId && (
                  <span className="inline-block bg-[#D91E2E] text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded uppercase mb-0.5">
                    YOU
                  </span>
                )}
                <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-[#111111] uppercase leading-tight truncate px-0.5">
                  {p1.name}
                </h3>
              </div>

              <div className="mt-auto">
                <span className="font-black text-sm sm:text-base md:text-lg text-[#111111]">
                  {p1.totalPoints} <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#333333]">PTS</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT BLOCK (3rd participant, Retro Pink) */}
        {p3 ? (
          <div className="flex flex-col items-center">
            {/* Number Pill / Badge with their actual rank */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-[#D91E2E] text-white flex items-center justify-center font-display text-xs sm:text-sm md:text-base border-2 border-white shadow-sm -mb-3.5 md:-mb-4 z-10">
              {p3.rank}
            </div>

            {/* Podium Block */}
            <div
              className={`w-full h-24 sm:h-32 md:h-38 bg-[#FF9FA6] border-2 md:border-3 border-[#111111] rounded-t-lg pt-5 sm:pt-6 md:pt-8 px-1 sm:px-3 pb-2 flex flex-col items-center justify-between text-center transition-all ${
                p3.id === currentParticipantId ? 'ring-3 ring-[#D91E2E] shadow-md' : 'retro-shadow-sm'
              }`}
            >
              <div className="w-full overflow-hidden">
                {p3.id === currentParticipantId && (
                  <span className="inline-block bg-[#D91E2E] text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded uppercase mb-0.5">
                    YOU
                  </span>
                )}
                <h3 className="font-bold text-[11px] sm:text-xs md:text-sm text-[#111111] uppercase leading-tight truncate px-0.5">
                  {p3.name}
                </h3>
              </div>

              <div className="mt-auto">
                <span className="font-black text-xs sm:text-sm md:text-base text-[#111111]">
                  {p3.totalPoints} <span className="text-[10px] sm:text-xs font-bold text-[#333333]">PTS</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-24 sm:h-32" />
        )}
      </div>
    </div>
  );
}
