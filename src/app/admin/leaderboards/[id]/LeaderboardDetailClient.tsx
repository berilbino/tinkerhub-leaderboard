'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Leaderboard, Participant, Round, Score } from '@/types/leaderboard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ScoreTable } from '@/components/admin/ScoreTable';
import { ParticipantManager } from '@/components/admin/ParticipantManager';
import { RoundManager } from '@/components/admin/RoundManager';
import { ShareModal } from '@/components/admin/ShareModal';
import { 
  ArrowLeft, 
  Share2, 
  Eye, 
  Users, 
  Calendar, 
  CheckSquare, 
  Settings as SettingsIcon, 
  LayoutDashboard, 
  Trash2, 
  Save 
} from 'lucide-react';
import { IllustrationRenderer, LeaderboardRibbon } from '@/components/illustrations/VectorIllustrations';

type TabType = 'overview' | 'participants' | 'rounds' | 'scores' | 'settings';

interface LeaderboardDetailClientProps {
  initialLeaderboard: Leaderboard;
  initialParticipants: Participant[];
  initialRounds: Round[];
  initialScores: Score[];
}

export function LeaderboardDetailClient({
  initialLeaderboard,
  initialParticipants,
  initialRounds,
  initialScores,
}: LeaderboardDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'scores';

  const [currentTab, setCurrentTab] = useState<TabType>(initialTab);
  const [leaderboard, setLeaderboard] = useState<Leaderboard>(initialLeaderboard);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [rounds, setRounds] = useState<Round[]>(initialRounds);
  const [scores, setScores] = useState<Score[]>(initialScores);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Settings form state
  const [title, setTitle] = useState(leaderboard.title);
  const [subtitle, setSubtitle] = useState(leaderboard.subtitle || '');
  const [slug, setSlug] = useState(leaderboard.slug);
  const [status, setStatus] = useState(leaderboard.status);
  const [illustrationKey, setIllustrationKey] = useState(leaderboard.illustration_key);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/session').then((res) => {
      if (!res.ok) {
        router.replace('/admin/login');
        return;
      }
      const tabFromUrl = searchParams.get('tab') as TabType;
      if (tabFromUrl) setCurrentTab(tabFromUrl);
    }).catch(() => router.replace('/admin/login'));
  }, [searchParams, router]);

  // Scores Handlers
  const handleSaveScores = async (updatedScores: { participant_id: string; round_id: string; score: number }[]) => {
    try {
      const res = await fetch('/api/admin/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: updatedScores }),
      });
      const json = await res.json();
      if (json.success) {
        // Refresh scores list
        setScores((prev) => {
          const newMap = new Map(prev.map((s) => [`${s.participant_id}_${s.round_id}`, s]));
          for (const u of updatedScores) {
            newMap.set(`${u.participant_id}_${u.round_id}`, {
              id: `s_${u.participant_id}_${u.round_id}`,
              participant_id: u.participant_id,
              round_id: u.round_id,
              score: u.score,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
          return Array.from(newMap.values());
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handlePublishRounds = async (roundIds: string[]) => {
    try {
      const responses = await Promise.all(roundIds.map((id) =>
        fetch('/api/admin/rounds', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, published: true }),
        })
      ));
      const results = await Promise.all(responses.map((response) => response.json()));
      if (results.some((result) => !result.success)) return false;
      setRounds((prev) => prev.map((r) => (roundIds.includes(r.id) ? { ...r, published: true } : r)));
      return true;
    } catch {
      return false;
    }
  };

  // Participant Handlers
  const handleAddParticipant = async (name: string) => {
    try {
      const res = await fetch('/api/admin/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaderboardId: leaderboard.id, name }),
      });
      const json = await res.json();
      if (json.success && json.participant) {
        setParticipants((prev) => [...prev, json.participant]);
        return { participant: json.participant, accessCode: json.accessCode };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleAddParticipantsBulk = async (names: string[]) => {
    try {
      const res = await fetch('/api/admin/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaderboardId: leaderboard.id, names }),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.added)) {
        const newParticipants = json.added.map((item: { participant: Participant }) => item.participant);
        setParticipants((prev) => [...prev, ...newParticipants]);
        return {
          added: json.added as { participant: Participant; accessCode: string }[],
          skipped: (json.skipped || []) as string[],
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleUpdateParticipant = async (id: string, name: string) => {
    try {
      const res = await fetch('/api/admin/participants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      });
      const json = await res.json();
      if (json.success) {
        setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/participants?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setParticipants((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Rounds Handlers
  const handleAddRound = async (name: string, maxScore?: number | null) => {
    try {
      const res = await fetch('/api/admin/rounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaderboardId: leaderboard.id, name, maxScore }),
      });
      const json = await res.json();
      if (json.success && json.round) {
        setRounds((prev) => [...prev, json.round]);
        return json.round;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleUpdateRound = async (id: string, data: Partial<Round>) => {
    try {
      const res = await fetch('/api/admin/rounds', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      const json = await res.json();
      if (json.success && json.round) {
        setRounds((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleDeleteRound = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/rounds?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setRounds((prev) => prev.filter((r) => r.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSaved(false);
    try {
      const res = await fetch(`/api/admin/leaderboards/${leaderboard.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle: subtitle || null,
          slug,
          status,
          illustration_key: illustrationKey,
        }),
      });
      const json = await res.json();
      if (json.success && json.leaderboard) {
        setLeaderboard(json.leaderboard);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteLeaderboard = async () => {
    if (window.confirm(`Are you sure you want to completely delete "${leaderboard.title}"? This cannot be undone.`)) {
      await fetch(`/api/admin/leaderboards/${leaderboard.id}`, { method: 'DELETE' });
      router.push('/admin');
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'rounds', label: 'Rounds', icon: Calendar },
    { id: 'scores', label: 'Scores', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col md:flex-row text-[#111111]">
      <AdminSidebar
        currentLeaderboardId={leaderboard.id}
        currentLeaderboardSlug={leaderboard.slug}
        activeTab={currentTab}
        onTabSelect={(tab) => {
          setCurrentTab(tab);
          // Keep the browser URL readable. The UUID remains an internal database
          // key and is still used for all admin API calls.
          router.replace(`/admin/leaderboards/${leaderboard.slug}?tab=${tab}`, { scroll: false });
        }}
      />

      <main className="flex-1 p-4 sm:p-8 max-w-6xl">
        {/* Top Header Bar matching Reference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-1.5 border border-[#D9D9D4] hover:border-[#111111] bg-white rounded-md text-[#111111] transition-colors inline-flex items-center gap-1 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
            <h1 className="font-display text-2xl sm:text-3xl text-[#111111] uppercase tracking-wide">
              {leaderboard.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="bg-white hover:bg-[#FAF9F5] text-[#D91E2E] border-2 border-[#D91E2E] font-bold text-xs px-4 py-2 rounded-md retro-shadow-sm uppercase flex items-center gap-1.5 transition-all retro-btn-active cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Leaderboard</span>
            </button>
            <a
              href={`/leaderboard/${leaderboard.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs px-3.5 py-2 rounded-md border-2 border-[#111111] uppercase flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </a>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 border-b-2 border-[#111111] mb-6 overflow-x-auto pb-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2.5 font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 border-b-2 -mb-[2px] transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#D91E2E] text-[#D91E2E] font-black'
                    : 'border-transparent text-[#666666] hover:text-[#111111]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D91E2E]' : 'text-[#666666]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {currentTab === 'scores' && (
          <ScoreTable
            leaderboardId={leaderboard.id}
            participants={participants}
            rounds={rounds}
            initialScores={scores}
            onSaveScores={handleSaveScores}
            onPublishRounds={handlePublishRounds}
          />
        )}

        {currentTab === 'participants' && (
          <ParticipantManager
            leaderboardId={leaderboard.id}
            participants={participants}
            onAddParticipant={handleAddParticipant}
            onAddParticipantsBulk={handleAddParticipantsBulk}
            onUpdateParticipant={handleUpdateParticipant}
            onDeleteParticipant={handleDeleteParticipant}
          />
        )}

        {currentTab === 'rounds' && (
          <RoundManager
            leaderboardId={leaderboard.id}
            rounds={rounds}
            onAddRound={handleAddRound}
            onUpdateRound={handleUpdateRound}
            onDeleteRound={handleDeleteRound}
          />
        )}

        {currentTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-[#111111] rounded-lg p-5 retro-shadow">
                <p className="text-xs font-bold text-[#666666] uppercase">Total Participants</p>
                <p className="font-display text-3xl text-[#111111] mt-1">{participants.length}</p>
                <button
                  type="button"
                  onClick={() => setCurrentTab('participants')}
                  className="text-xs font-bold text-[#D91E2E] mt-3 hover:underline inline-block"
                >
                  Manage Roster →
                </button>
              </div>

              <div className="bg-white border-2 border-[#111111] rounded-lg p-5 retro-shadow">
                <p className="text-xs font-bold text-[#666666] uppercase">Rounds</p>
                <p className="font-display text-3xl text-[#111111] mt-1">
                  {rounds.filter((r) => r.published).length} / {rounds.length}
                </p>
                <p className="text-[11px] text-[#666666] mt-0.5">Published / Total</p>
                <button
                  type="button"
                  onClick={() => setCurrentTab('rounds')}
                  className="text-xs font-bold text-[#D91E2E] mt-2 hover:underline inline-block"
                >
                  Manage Rounds →
                </button>
              </div>

              <div className="bg-white border-2 border-[#111111] rounded-lg p-5 retro-shadow">
                <p className="text-xs font-bold text-[#666666] uppercase">Public URL</p>
                <p className="font-mono text-xs font-bold text-[#111111] mt-2 truncate">
                  /leaderboard/{leaderboard.slug}
                </p>
                <button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="text-xs font-bold text-[#D91E2E] mt-3 hover:underline inline-block"
                >
                  Share Link →
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white border-2 border-[#111111] rounded-lg p-6 retro-shadow flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-lg text-[#111111] uppercase mb-1">
                  Ready to Enter Scores?
                </h3>
                <p className="text-xs text-[#666666]">
                  Open the spreadsheet score table to enter weekly points and publish them to students.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('scores')}
                className="bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs px-5 py-2.5 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex-shrink-0 cursor-pointer"
              >
                Go to Score Table
              </button>
            </div>
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="max-w-xl bg-white border-2 border-[#111111] rounded-lg p-6 retro-shadow space-y-6">
            <h3 className="font-display text-lg text-[#111111] uppercase">
              Leaderboard Settings
            </h3>

            {settingsSaved && (
              <div className="p-3 bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] rounded text-xs font-bold">
                Settings saved successfully!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-mono font-bold text-[#111111] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-bold text-[#111111] focus:border-[#111111] focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1">
                  Theme Illustration
                </label>
                <select
                  value={illustrationKey}
                  onChange={(e) => setIllustrationKey(e.target.value as any)}
                  className="w-full py-2 px-3 bg-white border-2 border-[#D9D9D4] rounded-md text-xs font-bold text-[#111111] focus:border-[#111111] focus:outline-none"
                >
                  <optgroup label="Design & Visuals">
                    <option value="graphicdesign">Graphic Design (Pen Tool & Palette)</option>
                    <option value="uiux">UI/UX Design (Wireframes & Cursor)</option>
                    <option value="model3d">3D Modelling (Isometric Mesh Cube)</option>
                    <option value="motion">Motion Design (Keyframes & Speed Curves)</option>
                    <option value="animation">Animation (Cel Frames & Flipbook)</option>
                    <option value="aidesign">AI in Design (Magic Wand & Prompt)</option>
                    <option value="video">Video Editing (Clapperboard & Film)</option>
                    <option value="webdesign">Web Design (Retro Browser & Layout)</option>
                    <option value="camera">Photography (Retro Camera)</option>
                    <option value="pencil">Sketching & Ideation (Pencil)</option>
                  </optgroup>
                  <optgroup label="Coding & Engineering">
                    <option value="coding">General Coding (Terminal & Code)</option>
                    <option value="frontend">Frontend (HTML / CSS / JS)</option>
                    <option value="backend">Backend & DB (Servers & Database)</option>
                    <option value="computer">Workstation (Retro PC)</option>
                    <option value="rocket">Hackathon / Launchpad (Rocket)</option>
                  </optgroup>
                  <optgroup label="General & Events">
                    <option value="cassette">Audio / Creative Jam (Cassette Tape)</option>
                    <option value="gameboy">Gaming / Game Dev (Game Boy)</option>
                    <option value="trophy">Competition (Podium Trophy)</option>
                  </optgroup>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="bg-[#D91E2E] hover:bg-[#A91421] text-white font-bold text-xs py-2.5 px-5 rounded-md border-2 border-[#111111] retro-shadow-sm uppercase flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteLeaderboard}
                  className="text-xs font-bold text-[#A91421] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Leaderboard</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Share Modal */}
        {shareModalOpen && (
          <ShareModal
            leaderboard={leaderboard}
            onClose={() => setShareModalOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
