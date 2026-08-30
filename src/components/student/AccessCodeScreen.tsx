'use client';

import React, { useState } from 'react';
import { Leaderboard } from '@/types/leaderboard';
import { 
  LeaderboardRibbon, 
  RetroStar, 
  Sparkle, 
  LightningBolt, 
  IllustrationRenderer 
} from '../illustrations/VectorIllustrations';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { TinkerHubLogo } from '../brand/TinkerHubLogo';

interface AccessCodeScreenProps {
  leaderboard: Leaderboard;
  onCodeSubmit: (code: string) => Promise<{ success: boolean; error?: string }>;
}

export function AccessCodeScreen({ leaderboard, onCodeSubmit }: AccessCodeScreenProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter your participant access code');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await onCodeSubmit(code.trim());
      if (!res.success) {
        setError(res.error || "That code doesn't look right. Check it and try again.");
      }
    } catch {
      setError("Unable to verify access code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full">
      {/* Playful Floating Retro Stickers in the background (top-left dotted square removed) */}
      <div className="absolute top-8 right-6 pointer-events-none">
        <RetroStar color="#FFD43B" className="w-7 h-7" />
      </div>
      <div className="absolute top-28 left-2 pointer-events-none">
        <div className="w-5 h-5 bg-[#FF9FA6] border-2 border-[#111111] transform -rotate-12" />
      </div>
      <div className="absolute top-36 right-4 pointer-events-none">
        <LightningBolt color="#8EC5FF" className="w-5 h-7" />
      </div>
      <div className="absolute bottom-20 left-4 pointer-events-none">
        <Sparkle color="#D91E2E" className="w-5 h-5" />
      </div>
      <div className="absolute bottom-16 right-6 pointer-events-none">
        <div className="w-4 h-4 bg-[#FFD43B] border-2 border-[#111111] transform rotate-45" />
      </div>

      {/* Official TinkerHub Brand Logo */}
      <div className="mb-6 z-10">
        <TinkerHubLogo href="/" className="h-12 sm:h-15 w-auto" priority />
      </div>

      {/* Event Title */}
      <div className="text-center mb-4 z-10">
        <h1 className="font-display text-3xl sm:text-4xl text-[#111111] uppercase tracking-wide leading-tight drop-shadow-sm">
          {leaderboard.title}
        </h1>
        {leaderboard.subtitle && (
          <p className="text-xs sm:text-sm text-[#666666] font-medium mt-1">
            {leaderboard.subtitle}
          </p>
        )}
      </div>

      {/* Yellow Ribbon */}
      <div className="mb-6 z-10">
        <LeaderboardRibbon text="LEADERBOARD" />
      </div>

      {/* Main Retro Illustration */}
      <div className="mb-6 transform hover:scale-105 transition-transform duration-300 z-10">
        <IllustrationRenderer 
          illustrationKey={leaderboard.illustration_key || 'cassette'} 
          className="w-36 h-24 sm:w-44 sm:h-28" 
        />
      </div>

      {/* Form Container */}
      <div className="w-full bg-[#FAF9F5] border-2 border-[#111111] p-6 rounded-lg retro-shadow z-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="access-code" className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-2 text-center">
              Enter your access code
            </label>
            <input
              id="access-code"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (error) setError(null);
              }}
              placeholder="Enter access code"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck="false"
              className="w-full bg-white border-2 border-[#111111] text-[#111111] font-mono text-center text-lg font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D91E2E] placeholder:text-[#999999] tracking-wider transition-all"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-[#FFF0F2] border border-[#FF9FA6] p-3 rounded text-xs text-[#A91421] font-medium animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold py-3.5 px-6 rounded-md border-2 border-[#111111] retro-shadow flex items-center justify-center gap-2 text-sm tracking-wide uppercase transition-all retro-btn-active disabled:opacity-75 cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Checking code...
              </span>
            ) : (
              <>
                <span>View Leaderboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Coordinator Note */}
      <div className="mt-8 text-center text-xs text-[#666666] z-10">
        <p className="font-medium">Don't have a code?</p>
        <p className="text-[#999999] mt-0.5">Ask your admin or event coordinator.</p>
      </div>
    </div>
  );
}
