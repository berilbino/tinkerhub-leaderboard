'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  RetroStar, 
  Sparkle 
} from '@/components/illustrations/VectorIllustrations';
import { ArrowRight, KeyRound, ArrowLeft } from 'lucide-react';
import { TinkerHubLogo } from '@/components/brand/TinkerHubLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminCode.trim()) {
      setError('Please enter the admin access code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: adminCode.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        router.push('/admin');
      } else {
        setError(json.error || 'Invalid admin access code');
      }
    } catch {
      setError('Unable to authenticate. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Back to Home button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#666666] hover:text-[#111111] bg-[#FAF9F5] hover:bg-white px-3 py-1.5 rounded-md border border-[#D9D9D4] hover:border-[#111111] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Decorative Floating Stickers */}
      <div className="absolute top-12 right-12 pointer-events-none">
        <RetroStar color="#FFD43B" className="w-8 h-8" />
      </div>
      <div className="absolute bottom-12 left-12 pointer-events-none">
        <Sparkle color="#D91E2E" className="w-6 h-6" />
      </div>
      <div className="absolute bottom-16 right-16 pointer-events-none">
        <div className="w-6 h-6 bg-[#8EC5FF] border-2 border-[#111111] transform rotate-12" />
      </div>

      <div className="max-w-md w-full z-10 flex flex-col items-center">
        {/* Official TinkerHub Brand Logo */}
        <div className="mb-5">
          <TinkerHubLogo href="/" className="h-13 sm:h-16 w-auto" priority />
        </div>

        <h1 className="font-display text-xl sm:text-2xl text-[#111111] uppercase tracking-wide text-center mb-1">
          Leaderboard Admin
        </h1>
        <p className="text-xs text-[#666666] font-medium mb-6 text-center">
          Enter your admin access code to manage study jam leaderboards and scores
        </p>

        {/* Login Box */}
        <div className="w-full bg-[#FAF9F5] border-2 border-[#111111] rounded-lg p-6 sm:p-8 retro-shadow">
          {error && (
            <div className="mb-4 p-3 bg-[#FFF0F2] border border-[#FF9FA6] rounded text-xs text-[#A91421] font-semibold">
              {error}
            </div>
          )}

          {/* Hidden dummy fields to stop browser password managers from auto-filling */}
          <form onSubmit={handleAdminCodeSubmit} className="space-y-4" autoComplete="off">
            <input type="text" name="fake_user" style={{display:'none'}} readOnly tabIndex={-1} aria-hidden="true" />
            <input type="password" name="fake_pass" style={{display:'none'}} readOnly tabIndex={-1} aria-hidden="true" />
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5">
                Admin Access Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#999999] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter access code"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-form-type="other"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#D9D9D4] rounded-md font-mono text-xs font-bold text-[#111111] focus:border-[#D91E2E] focus:outline-none tracking-wider"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs py-3 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-2 transition-all retro-btn-active cursor-pointer mt-2"
            >
              {loading ? (
                <span>Verifying Code...</span>
              ) : (
                <>
                  <span>Enter Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
