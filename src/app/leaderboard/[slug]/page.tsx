import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLeaderboardBySlug } from '@/lib/data/store';
import { LeaderboardClient } from './LeaderboardClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeaderboardRibbon, RetroStar } from '@/components/illustrations/VectorIllustrations';

// A leaderboard is created and edited at runtime, so Vercel must always read
// the current Supabase row instead of reusing a build-time page result.
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const leaderboard = await getLeaderboardBySlug(slug);

  if (!leaderboard) {
    return {
      title: 'Leaderboard Not Found — TinkerHub',
    };
  }

  return {
    title: `${leaderboard.title} — TinkerHub Leaderboard`,
    description: leaderboard.subtitle || `Live rankings and scores for ${leaderboard.title}`,
  };
}

export default async function LeaderboardPage({ params }: PageProps) {
  const { slug } = await params;
  const leaderboard = await getLeaderboardBySlug(slug);

  if (!leaderboard) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="flex items-center gap-1 mb-6">
          <span className="font-display text-xl tracking-tight text-[#111111]">TINKER</span>
          <span className="font-display text-xl tracking-tight text-[#D91E2E]">HUB</span>
          <span className="text-[#FFD43B] text-lg font-black">⚡</span>
        </div>
        <RetroStar color="#FFD43B" className="w-12 h-12 mb-4 animate-spin-slow" />
        <h1 className="font-display text-2xl sm:text-3xl text-[#111111] mb-2 uppercase">
          Leaderboard Not Found
        </h1>
        <p className="text-sm text-[#666666] max-w-sm mb-6">
          We couldn't find an active leaderboard for <span className="font-mono font-bold text-[#111111]">"{slug}"</span>. Please verify the URL with your event organizer.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#D91E2E] text-white font-bold py-2.5 px-5 rounded-md border-2 border-[#111111] retro-shadow text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to TinkerHub Home</span>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <LeaderboardClient leaderboard={leaderboard} />
    </main>
  );
}
