'use client';

import React, { useState } from 'react';
import { Leaderboard } from '@/types/leaderboard';
import { Copy, Check, ExternalLink, X, Share2, MessageCircle } from 'lucide-react';
import { LeaderboardRibbon } from '../illustrations/VectorIllustrations';

interface ShareModalProps {
  leaderboard: Leaderboard;
  onClose: () => void;
}

export function ShareModal({ leaderboard, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const getPublicUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/leaderboard/${leaderboard.slug}`;
    }
    return `/leaderboard/${leaderboard.slug}`;
  };

  const publicUrl = getPublicUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🏆 *${leaderboard.title} Leaderboard is Live!* 🚀\n\nCheck your ranking and scores here:\n${publicUrl}\n\nEnter your participant access code to find your position!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${leaderboard.title} — TinkerHub Leaderboard`,
        text: `Check your ranking on the ${leaderboard.title} leaderboard!`,
        url: publicUrl,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white border-2 border-[#111111] rounded-lg max-w-md w-full p-6 retro-shadow relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#666666] hover:text-[#111111]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-block mb-2">
            <LeaderboardRibbon text="SHARE LEADERBOARD" />
          </div>
          <h3 className="font-display text-xl text-[#111111] uppercase">
            {leaderboard.title}
          </h3>
          <p className="text-xs text-[#666666] mt-1">
            Share this link in your event's WhatsApp group. Students will access their scores using their access codes.
          </p>
        </div>

        {/* Public Link Box */}
        <div className="space-y-3">
          <label className="block text-[11px] font-black text-[#111111] uppercase tracking-wider">
            Public Leaderboard URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 py-2.5 px-3 bg-[#FAF9F5] border-2 border-[#D9D9D4] rounded-md font-mono text-xs text-[#111111] select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs px-3.5 py-2.5 rounded-md border-2 border-[#111111] uppercase flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* WhatsApp Direct Share Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs py-3 px-4 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-2 transition-all retro-btn-active cursor-pointer mt-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share directly on WhatsApp</span>
          </button>

          {/* Preview Public Leaderboard Button */}
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white hover:bg-[#FAF9F5] text-[#111111] font-bold text-xs py-2.5 px-4 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Preview Student Leaderboard</span>
          </a>
        </div>
      </div>
    </div>
  );
}
