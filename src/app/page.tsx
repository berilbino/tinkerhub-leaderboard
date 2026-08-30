import React from 'react';
import Link from 'next/link';
import { getLeaderboards } from '@/lib/data/store';
import { 
  LeaderboardRibbon, 
  RetroStar, 
  Sparkle, 
  LightningBolt, 
  IllustrationRenderer, 
  BuildCreateInspireBadge 
} from '@/components/illustrations/VectorIllustrations';
import { TinkerHubLogo } from '@/components/brand/TinkerHubLogo';
import { ArrowRight, Trophy, ShieldCheck, Sparkles, Smartphone, Award } from 'lucide-react';

// The event list is stored in Supabase and must reflect newly created boards.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const leaderboards = await getLeaderboards();
  const activeLeaderboards = leaderboards.filter((board) => board.status === 'active');

  return (
    <div className="min-h-screen bg-white flex flex-col text-[#111111] relative overflow-hidden selection:bg-[#FFD43B]">
      {/* Decorative Floating Stickers (top-left dotted square removed) */}
      <div className="absolute top-10 right-10 pointer-events-none">
        <RetroStar color="#FFD43B" className="w-9 h-9" />
      </div>
      <div className="absolute top-40 left-8 pointer-events-none">
        <LightningBolt color="#8EC5FF" className="w-5 h-8" />
      </div>
      <div className="absolute top-56 right-6 pointer-events-none">
        <Sparkle color="#D91E2E" className="w-6 h-6" />
      </div>
      <div className="absolute bottom-20 left-10 pointer-events-none">
        <div className="w-6 h-6 bg-[#FF9FA6] border-2 border-[#111111] transform -rotate-12" />
      </div>

      {/* Top Navigation */}
      <header className="w-full max-w-5xl mx-auto px-4 py-6 flex items-center justify-between z-10">
        {/* Official TinkerHub Brand Logo */}
        <TinkerHubLogo href="/" className="h-12 sm:h-15 w-auto" priority />

        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 bg-[#FAF9F5] hover:bg-white text-[#111111] font-bold text-xs px-3.5 py-2 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase transition-all retro-btn-active cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#D91E2E]" />
          <span>Admin Portal</span>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center text-center z-10 w-full">
        {/* Ribbon */}
        <div className="mb-4">
          <LeaderboardRibbon text="OFFICIAL LEADERBOARDS" className="text-xs sm:text-sm" />
        </div>

        {/* Big Display Title */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#111111] uppercase tracking-wide leading-tight max-w-2xl mb-4">
          TinkerHub Leaderboard
        </h1>

        <p className="text-sm sm:text-base text-[#666666] font-medium max-w-lg mb-8">
          Real-time leaderboard platform for TinkerHub study jams, creative programs, design sprints, and competitions.
        </p>

      {/* Active Events Section */}
        <div className="w-full text-left mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl text-[#111111] uppercase tracking-wide">
              Active Leaderboards
            </h3>
            <span className="text-xs font-bold text-[#666666] uppercase">
              {activeLeaderboards.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeLeaderboards.map((board) => (
              <div
                key={board.id}
                className="bg-white border-2 border-[#111111] rounded-lg p-5 retro-shadow flex flex-col justify-between hover:translate-y-[-2px] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                        board.status === 'active'
                          ? 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]'
                          : board.status === 'completed'
                          ? 'bg-[#E9D5FF] text-[#6B21A8] border-[#C084FC]'
                          : 'bg-[#FEF08A] text-[#854D0E] border-[#FACC15]'
                      }`}
                    >
                      {board.status}
                    </span>
                    <span className="font-mono text-[10px] text-[#999999]">
                      /{board.slug}
                    </span>
                  </div>

                  <h4 className="font-display text-lg text-[#111111] uppercase mb-1">
                    {board.title}
                  </h4>
                  {board.subtitle && (
                    <p className="text-xs text-[#666666] font-medium mb-3">
                      {board.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EBEBE6] mt-2">
                  <div className="flex-shrink-0">
                    <IllustrationRenderer
                      illustrationKey={board.illustration_key || 'cassette'}
                      className="w-16 h-12"
                    />
                  </div>

                  <Link
                    href={`/leaderboard/${board.slug}`}
                    className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs px-3.5 py-2 rounded border-2 border-[#111111] uppercase transition-colors"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {activeLeaderboards.length === 0 && (
            <div className="bg-[#FAF9F5] border-2 border-dashed border-[#D9D9D4] rounded-lg p-8 text-center text-xs font-semibold text-[#666666]">
              No active leaderboards yet. Please check back soon.
            </div>
          )}
        </div>

        {/* How It Works Grid */}
        <div className="w-full bg-[#FAF9F5] border-2 border-[#111111] rounded-lg p-6 sm:p-8 retro-shadow text-left mb-12">
          <h3 className="font-display text-lg sm:text-xl text-[#111111] uppercase mb-4 text-center">
            How The Leaderboard Works
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-white border border-[#D9D9D4] rounded-md">
              <div className="w-8 h-8 rounded bg-[#FFF0A6] border border-[#111111] text-[#111111] font-display text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="font-bold text-xs text-[#111111] uppercase mb-1">
                WhatsApp Link
              </h4>
              <p className="text-xs text-[#666666]">
                Admins share the permanent event link in the WhatsApp study jam group.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#D9D9D4] rounded-md">
              <div className="w-8 h-8 rounded bg-[#8EC5FF] border border-[#111111] text-[#111111] font-display text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="font-bold text-xs text-[#111111] uppercase mb-1">
                Access Code Entry
              </h4>
              <p className="text-xs text-[#666666]">
                Students enter their unique access code to see personalized rankings.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#D9D9D4] rounded-md">
              <div className="w-8 h-8 rounded bg-[#FF9FA6] border border-[#111111] text-[#111111] font-display text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="font-bold text-xs text-[#111111] uppercase mb-1">
                Weekly Updates
              </h4>
              <p className="text-xs text-[#666666]">
                Admins manually evaluate Google Form submissions, enter scores, and publish updates to the same link.
              </p>
            </div>
          </div>
        </div>

        {/* Build Create Inspire Sticker */}
        <div className="mb-8">
          <BuildCreateInspireBadge />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t-2 border-[#111111] py-6 px-4 text-center bg-white z-10">
        <p className="text-xs text-[#666666] font-medium">
          TinkerHub Leaderboard Platform · Built for TinkerHub Community & Creative Study Jams
        </p>
      </footer>
    </div>
  );
}
