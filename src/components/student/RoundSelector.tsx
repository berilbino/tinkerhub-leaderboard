import React from 'react';
import { Round } from '@/types/leaderboard';

interface RoundSelectorProps {
  rounds: Round[];
  selectedRoundId: string;
  onSelectRound: (roundId: string) => void;
}

export function RoundSelector({ rounds, selectedRoundId, onSelectRound }: RoundSelectorProps) {
  const publishedRounds = rounds.filter((r) => r.published).sort((a, b) => a.round_order - b.round_order);

  return (
    <div className="w-full overflow-x-auto py-2 scrollbar-none flex items-center gap-1.5 sm:gap-2 px-1">
      {/* Overall Tab */}
      <button
        type="button"
        onClick={() => onSelectRound('overall')}
        className={`px-3 sm:px-4 py-1.5 rounded-md font-bold text-xs sm:text-sm tracking-wide transition-all whitespace-nowrap cursor-pointer ${
          selectedRoundId === 'overall'
            ? 'bg-[#D91E2E] text-white border-2 border-[#111111] retro-shadow-sm font-black'
            : 'bg-white text-[#111111] border-2 border-[#D9D9D4] hover:border-[#111111]'
        }`}
      >
        Overall
      </button>

      {/* Dynamic Published Rounds */}
      {publishedRounds.map((round) => (
        <button
          key={round.id}
          type="button"
          onClick={() => onSelectRound(round.id)}
          className={`px-3 sm:px-4 py-1.5 rounded-md font-bold text-xs sm:text-sm tracking-wide transition-all whitespace-nowrap cursor-pointer ${
            selectedRoundId === round.id
              ? 'bg-[#D91E2E] text-white border-2 border-[#111111] retro-shadow-sm font-black'
              : 'bg-white text-[#111111] border-2 border-[#D9D9D4] hover:border-[#111111]'
          }`}
        >
          {round.name}
        </button>
      ))}
    </div>
  );
}
