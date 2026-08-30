'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LeaderboardViewData, RankedParticipant } from '@/types/leaderboard';
import { 
  LeaderboardRibbon, 
  YourPositionRibbon, 
  MotivationalFooterBadge,
  RetroStar, 
  Sparkle, 
  LightningBolt, 
  getEventTheme 
} from '../illustrations/VectorIllustrations';
import { Podium } from './Podium';
import { LeaderboardRow } from './LeaderboardRow';
import { RoundSelector } from './RoundSelector';
import confetti from 'canvas-confetti';
import { LogOut, Share2, Sparkles, ShieldCheck } from 'lucide-react';
import { TinkerHubLogo } from '../brand/TinkerHubLogo';

interface PublicLeaderboardProps {
  initialData: LeaderboardViewData;
  onRoundChange?: (roundId: string) => Promise<LeaderboardViewData | null>;
  onClearSession?: () => void;
  isAdmin?: boolean;
}

export function PublicLeaderboard({ initialData, onRoundChange, onClearSession, isAdmin }: PublicLeaderboardProps) {
  const [data, setData] = useState<LeaderboardViewData>(initialData);
  const [selectedRoundId, setSelectedRoundId] = useState<string>(initialData.selectedRoundId || 'overall');
  const [changingRound, setChangingRound] = useState(false);

  const theme = getEventTheme(data.leaderboard.slug, data.leaderboard.illustration_key);

  // Trigger subtle confetti on load if participant is rank 1-3
  useEffect(() => {
    if (data.currentParticipant && data.currentParticipant.rank <= 3) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D91E2E', '#FFD43B', '#8EC5FF', '#FF9FA6'],
        });
      } catch {
        // Safe fail in SSR
      }
    }
  }, [data.currentParticipant]);

  const handleSelectRound = async (roundId: string) => {
    setSelectedRoundId(roundId);
    if (onRoundChange) {
      setChangingRound(true);
      try {
        const updated = await onRoundChange(roundId);
        if (updated) {
          setData(updated);
        }
      } finally {
        setChangingRound(false);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${data.leaderboard.title} — TinkerHub Leaderboard`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Leaderboard link copied to clipboard!');
    }
  };

  // Top 3 on podium (index 0, 1, 2)
  const podiumParticipants = data.allRanked.slice(0, 3);

  // Ranks in horizontal bars (index 3 to 14, i.e. 4th person up to 15th person)
  const listParticipants = data.allRanked.slice(3, 15);

  // Check if current participant is beyond the 15th person (index >= 15)
  const currentParticipantIndex = data.currentParticipant
    ? data.allRanked.findIndex((p) => p.id === data.currentParticipant?.id)
    : -1;
  const isOutsideTop15 = currentParticipantIndex >= 15;

  return (
    <div className="relative min-h-screen bg-white text-[#111111] flex flex-col items-center px-3 sm:px-6 md:px-8 py-6 max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto w-full">
      {/* Playful Floating Retro Stickers */}
      <div className="absolute top-6 right-3 sm:right-6 pointer-events-none">
        <RetroStar color="#FFD43B" className="w-6 h-6 sm:w-8 sm:h-8" />
      </div>
      <div className="absolute top-36 left-2 sm:left-4 pointer-events-none">
        <LightningBolt color="#8EC5FF" className="w-4 h-6 sm:w-5 sm:h-8" />
      </div>
      <div className="absolute top-52 right-2 sm:right-4 pointer-events-none">
        <Sparkle color="#D91E2E" className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      {/* Admin Quick Banner (if viewing via Admin code) */}
      {isAdmin && (
        <div className="w-full bg-[#FFF0A6] border-2 border-[#111111] rounded-md py-2 px-3.5 mb-4 flex items-center justify-between z-20 retro-shadow-sm text-xs font-bold text-[#111111]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D91E2E]" />
            <span>Admin View Active</span>
          </div>
          <Link
            href={`/admin/leaderboards/${data.leaderboard.id}`}
            className="bg-[#111111] text-white px-2.5 py-1 rounded text-[11px] font-extrabold uppercase hover:bg-[#333333] transition-colors"
          >
            Open Score Manager 🛠️
          </Link>
        </div>
      )}

      {/* Top Bar with Brand and Action Buttons */}
      <div className="w-full flex items-center justify-between mb-4 sm:mb-6 z-10">
        {/* Official TinkerHub Brand Logo */}
        <TinkerHubLogo href="/" className="h-11 sm:h-14 w-auto" priority />

        {/* Share & Session controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            title="Share Leaderboard"
            className="p-2 sm:px-3 sm:py-2 rounded-md border border-[#D9D9D4] hover:border-[#111111] bg-white text-[#111111] hover:bg-[#FAF9F5] transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          {onClearSession && (
            <button
              type="button"
              onClick={onClearSession}
              title="Switch Access Code"
              className="p-2 sm:px-3 sm:py-2 rounded-md border border-[#D9D9D4] hover:border-[#111111] bg-white text-[#666666] hover:text-[#D91E2E] hover:bg-[#FAF9F5] transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Switch Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Event Title Banner */}
      <div className="text-center mb-4 sm:mb-6 z-10 w-full">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] uppercase tracking-wide leading-tight">
          {data.leaderboard.title}
        </h1>
        <div className="mt-2 sm:mt-3 flex items-center justify-center gap-2">
          <LeaderboardRibbon text="LEADERBOARD" className="text-xs sm:text-sm" />
        </div>
        <p className="text-[11px] sm:text-xs text-[#666666] font-bold tracking-wider uppercase mt-2">
          {data.publishedRounds.length} {data.publishedRounds.length === 1 ? 'ROUND' : 'ROUNDS'} · {data.totalParticipants} PARTICIPANTS
        </p>
      </div>

      {/* Current Participant Recognition Card */}
      {data.currentParticipant && (
        <div className="w-full bg-[#FAF9F5] border-2 md:border-3 border-[#111111] rounded-lg p-3.5 sm:p-5 mb-4 sm:mb-6 retro-shadow-sm flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#666666] uppercase">
                YOUR POSITION
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#FFD43B]" />
            </div>
            <div className="font-bold text-sm sm:text-base md:text-lg text-[#111111] uppercase mt-0.5 truncate max-w-[180px] sm:max-w-md">
              {data.currentParticipant.name}
            </div>
          </div>
          
          <div className="text-right flex items-center gap-3 sm:gap-6">
            <div className="text-center">
              <span className="text-[10px] sm:text-xs font-bold text-[#666666] block uppercase leading-none">Rank</span>
              <span className="font-display text-lg sm:text-2xl text-[#D91E2E]">
                #{data.currentParticipant.rank}
              </span>
            </div>
            <div className="text-center pl-3 sm:pl-6 border-l-2 border-[#D9D9D4]">
              <span className="text-[10px] sm:text-xs font-bold text-[#666666] block uppercase leading-none">Points</span>
              <span className="font-black text-sm sm:text-xl text-[#111111]">
                {data.currentParticipant.totalPoints} <span className="text-[10px] sm:text-xs font-bold text-[#666666]">PTS</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Round Selector Bar */}
      <div className="w-full mb-3 sm:mb-4 z-10">
        <RoundSelector
          rounds={data.rounds}
          selectedRoundId={selectedRoundId}
          onSelectRound={handleSelectRound}
        />
      </div>

      {/* Changing Round Spinner overlay if needed */}
      {changingRound && (
        <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-[#666666]">
          <span className="w-3 h-3 border-2 border-[#D91E2E] border-t-transparent rounded-full animate-spin" />
          Updating scores...
        </div>
      )}

      {/* Top 3 Podium */}
      {podiumParticipants.length > 0 && (
        <div className="w-full mb-4 sm:mb-6 z-10">
          <Podium top3={podiumParticipants} currentParticipantId={data.currentParticipant?.id} />
        </div>
      )}

      {/* Ranks 4-15 List Container */}
      <div className="w-full bg-white border-2 md:border-3 border-[#111111] rounded-lg overflow-hidden retro-shadow mb-6 z-10">
        {listParticipants.length > 0 ? (
          <div className="divide-y divide-[#EBEBE6]">
            {listParticipants.map((p) => (
              <LeaderboardRow
                key={p.id}
                participant={p}
                isCurrentUser={p.id === data.currentParticipant?.id}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#666666] font-medium">
            {podiumParticipants.length === 0 ? 'No published scores available yet.' : 'All participants are shown on the podium!'}
          </div>
        )}
      </div>

      {/* Outside Top 15 Section (e.g. Rank #24) */}
      {isOutsideTop15 && data.currentParticipant && (
        <div className="w-full flex flex-col items-center mb-6 z-10">
          {/* Section Ribbon */}
          <div className="mb-2">
            <YourPositionRibbon />
          </div>

          {/* User's row with the exact same component */}
          <div className="w-full bg-white border-2 md:border-3 border-[#111111] rounded-lg overflow-hidden retro-shadow">
            <LeaderboardRow
              participant={data.currentParticipant}
              isCurrentUser={true}
            />
          </div>
        </div>
      )}

      {/* Motivational Footer Badge */}
      <div className="mt-2 mb-8 z-10">
        <MotivationalFooterBadge />
      </div>
    </div>
  );
}
