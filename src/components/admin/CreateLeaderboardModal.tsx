'use client';

import React, { useState } from 'react';
import { IllustrationKey, Leaderboard } from '@/types/leaderboard';
import { 
  IllustrationRenderer,
} from '../illustrations/VectorIllustrations';
import { X, Plus } from 'lucide-react';

interface CreateLeaderboardModalProps {
  onClose: () => void;
  onCreate: (data: { title: string; subtitle?: string | null; slug: string; illustration_key?: string }) => Promise<Leaderboard | null>;
}

const THEME_OPTIONS: { key: IllustrationKey; label: string; category: string }[] = [
  // Design & Creative
  { key: 'graphicdesign', label: 'Graphic Design', category: 'Design' },
  { key: 'uiux', label: 'UI/UX Design', category: 'Design' },
  { key: 'model3d', label: '3D Modelling', category: 'Design' },
  { key: 'motion', label: 'Motion Design', category: 'Design' },
  { key: 'animation', label: 'Animation', category: 'Design' },
  { key: 'aidesign', label: 'AI in Design', category: 'Design' },
  { key: 'video', label: 'Video Editing', category: 'Design' },
  { key: 'webdesign', label: 'Web Design', category: 'Design' },
  { key: 'camera', label: 'Photography', category: 'Design' },
  { key: 'pencil', label: 'Sketching', category: 'Design' },
  // Coding & Engineering
  { key: 'coding', label: 'Coding / Dev', category: 'Tech' },
  { key: 'frontend', label: 'Frontend (HTML/CSS/JS)', category: 'Tech' },
  { key: 'backend', label: 'Backend & DB', category: 'Tech' },
  { key: 'computer', label: 'Workstation', category: 'Tech' },
  { key: 'rocket', label: 'Hackathon / Launch', category: 'Tech' },
  // General & Events
  { key: 'cassette', label: 'Audio / Study Jam', category: 'General' },
  { key: 'gameboy', label: 'Game Dev', category: 'General' },
  { key: 'trophy', label: 'Competition', category: 'General' },
];

export function CreateLeaderboardModal({ onClose, onCreate }: CreateLeaderboardModalProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [illustrationKey, setIllustrationKey] = useState<IllustrationKey>('cassette');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const suggested = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setSlug(suggested);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError('Title and slug are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const created = await onCreate({
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        slug: slug.trim().toLowerCase(),
        illustration_key: illustrationKey,
      });
      if (created) {
        onClose();
      } else {
        setError('Failed to create leaderboard. Please try a different slug.');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white border-2 border-[#111111] rounded-lg max-w-lg w-full p-6 retro-shadow relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#666666] hover:text-[#111111]"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display text-xl text-[#111111] uppercase mb-1">
          Create Leaderboard
        </h3>
        <p className="text-xs text-[#666666] mb-5">
          Set up a new leaderboard for your TinkerHub event, study jam, or challenge.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[#FFF0F2] border border-[#FF9FA6] rounded text-xs text-[#A91421] font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. 3D Design Challenge 2026"
              className="w-full py-2.5 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. 6-Week Blender & CGI Study Jam"
              className="w-full py-2.5 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
              URL Slug *
            </label>
            <div className="flex items-center">
              <span className="bg-[#FAF9F5] border-2 border-r-0 border-[#D9D9D4] rounded-l-md px-2.5 py-2.5 text-xs text-[#666666] font-mono">
                /leaderboard/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="3d-design-challenge"
                className="flex-1 py-2.5 px-3 bg-white border-2 border-[#D9D9D4] rounded-r-md text-xs font-mono font-bold text-[#111111] focus:border-[#111111] focus:outline-none"
              />
            </div>
          </div>

          {/* Illustration Selection */}
          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5">
              Theme Illustration
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1 bg-[#FAF9F5] border border-[#D9D9D4] rounded-md">
              {THEME_OPTIONS.map(({ key, label }) => {
                const isSelected = illustrationKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIllustrationKey(key)}
                    className={`p-2 rounded-md border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#111111] bg-[#FFF0A6] retro-shadow-sm font-bold scale-[1.02]'
                        : 'border-[#D9D9D4] bg-white hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <IllustrationRenderer illustrationKey={key} className="w-12 h-9 object-contain" />
                    <span className="text-[9px] text-[#111111] font-bold text-center leading-tight">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs py-3 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center justify-center gap-2 transition-all retro-btn-active cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Creating...' : 'Create Leaderboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
