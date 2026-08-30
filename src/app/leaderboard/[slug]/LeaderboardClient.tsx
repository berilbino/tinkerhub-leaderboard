'use client';

import React, { useState, useEffect } from 'react';
import { Leaderboard, LeaderboardViewData } from '@/types/leaderboard';
import { AccessCodeScreen } from '@/components/student/AccessCodeScreen';
import { PublicLeaderboard } from '@/components/student/PublicLeaderboard';
import { IllustrationRenderer, RetroStar, Sparkle } from '@/components/illustrations/VectorIllustrations';
import { TinkerHubLogo } from '@/components/brand/TinkerHubLogo';

interface LeaderboardClientProps {
  leaderboard: Leaderboard;
  initialViewData?: LeaderboardViewData | null;
}

export function LeaderboardClient({ leaderboard, initialViewData }: LeaderboardClientProps) {
  const [participant, setParticipant] = useState<{ id: string; name: string } | null>(null);
  const [viewData, setViewData] = useState<LeaderboardViewData | null>(initialViewData || null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  // Check saved session on mount from localStorage or cookie
  useEffect(() => {
    const saved = localStorage.getItem(`th_user_${leaderboard.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id && parsed.name) {
          setParticipant(parsed);
          setIsAdmin(parsed.id === 'admin');
          loadLeaderboardData(parsed.id);
        }
      } catch {
        localStorage.removeItem(`th_user_${leaderboard.id}`);
      }
    }
    setHasCheckedSession(true);
  }, [leaderboard.id]);

  const loadLeaderboardData = async (participantId: string, roundId = 'overall') => {
    setIsFetching(true);
    try {
      const pParam = participantId === 'admin' ? '' : `&participantId=${participantId}`;
      const res = await fetch(`/api/leaderboard/data?slug=${leaderboard.slug}${pParam}&roundId=${roundId}`);
      const json = await res.json();
      if (json.success && json.viewData) {
        setViewData(json.viewData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsFetching(false);
      }, 350);
    }
  };

  const handleCodeSubmit = async (code: string) => {
    setIsFetching(true);
    try {
      const res = await fetch('/api/leaderboard/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: leaderboard.slug, code }),
      });
      const json = await res.json();
      if (json.success) {
        setParticipant(json.participant);
        setIsAdmin(Boolean(json.isAdmin));
        setViewData(json.viewData);
        localStorage.setItem(`th_user_${leaderboard.id}`, JSON.stringify(json.participant));
        return { success: true };
      } else {
        return { success: false, error: json.error };
      }
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsFetching(false);
    }
  };

  const handleRoundChange = async (roundId: string) => {
    if (!participant) return null;
    const pParam = participant.id === 'admin' ? '' : `&participantId=${participant.id}`;
    const res = await fetch(`/api/leaderboard/data?slug=${leaderboard.slug}${pParam}&roundId=${roundId}`);
    const json = await res.json();
    if (json.success) {
      return json.viewData;
    }
    return null;
  };

  const handleClearSession = () => {
    localStorage.removeItem(`th_user_${leaderboard.id}`);
    setParticipant(null);
    setIsAdmin(false);
    setViewData(null);
  };

  // 1. Loading / Welcome Screen matching reference image
  if (isFetching && participant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        {/* Official TinkerHub Brand Logo */}
        <div className="mb-7">
          <TinkerHubLogo href="/" className="h-13 sm:h-16 w-auto" priority />
        </div>

        {/* Cassette / Theme Illustration */}
        <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
          <IllustrationRenderer 
            illustrationKey={leaderboard.illustration_key || 'cassette'} 
            className="w-36 h-24 sm:w-44 sm:h-28" 
          />
        </div>

        <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-1">
          Welcome back!
        </p>
        <h2 className="font-display text-2xl sm:text-3xl text-[#111111] uppercase tracking-wide mb-4">
          {participant.name}
        </h2>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#666666]">
          <span>Fetching leaderboard</span>
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#D91E2E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-[#FFD43B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-[#8EC5FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="w-1.5 h-1.5 bg-[#FF9FA6] rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
          </span>
        </div>
      </div>
    );
  }

  // 2. Active Session -> Show Leaderboard
  if (participant && viewData) {
    return (
      <PublicLeaderboard
        initialData={viewData}
        onRoundChange={handleRoundChange}
        onClearSession={handleClearSession}
        isAdmin={isAdmin}
      />
    );
  }

  // 3. No Session yet -> Show Access Code Entry Screen
  return (
    <AccessCodeScreen
      leaderboard={leaderboard}
      onCodeSubmit={handleCodeSubmit}
    />
  );
}
