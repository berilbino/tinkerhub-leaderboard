'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Calendar, 
  CheckSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { BuildCreateInspireBadge, RetroStar } from '../illustrations/VectorIllustrations';
import { TinkerHubLogo } from '../brand/TinkerHubLogo';

type LeaderboardTab = 'overview' | 'participants' | 'rounds' | 'scores' | 'settings';

interface AdminSidebarProps {
  currentLeaderboardId?: string;
  currentLeaderboardSlug?: string;
  activeTab?: LeaderboardTab;
  onTabSelect?: (tab: LeaderboardTab) => void;
}

export function AdminSidebar({ currentLeaderboardId, currentLeaderboardSlug, activeTab, onTabSelect }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseUrl = currentLeaderboardSlug ? `/admin/leaderboards/${currentLeaderboardSlug}` : '/admin';
  const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    tab: 'overview' as const,
  },
  {
    label: 'Leaderboards',
    href: '/admin',
    icon: Trophy,
    tab: 'overview' as const,
  },
    { 
      label: 'Participants', 
      href: currentLeaderboardId ? `${baseUrl}?tab=participants` : '/admin', 
      icon: Users,
      tab: 'participants' as const,
      disabled: !currentLeaderboardId 
    },
    { 
      label: 'Rounds', 
      href: currentLeaderboardId ? `${baseUrl}?tab=rounds` : '/admin', 
      icon: Calendar,
      tab: 'rounds' as const,
      disabled: !currentLeaderboardId 
    },
    { 
      label: 'Scores', 
      href: currentLeaderboardId ? `${baseUrl}?tab=scores` : '/admin', 
      icon: CheckSquare,
      tab: 'scores' as const,
      disabled: !currentLeaderboardId 
    },
    { 
      label: 'Settings', 
      href: currentLeaderboardId ? `${baseUrl}?tab=settings` : '/admin', 
      icon: Settings,
      tab: 'settings' as const,
      disabled: !currentLeaderboardId 
    },
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-5 bg-white border-r-2 border-[#111111]">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <TinkerHubLogo href="/admin" className="h-10 sm:h-12 w-auto" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-[#666666] hover:text-[#111111]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] font-black tracking-widest text-[#999999] uppercase mb-8">
          ADMIN PORTAL
        </p>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            let isActive = false;

            if (currentLeaderboardId) {
              // When managing a leaderboard:
              // 'Leaderboards' represents the Overview/Dashboard of this specific leaderboard
              // 'Dashboard' represents returning to the main /admin list
              if (item.label === 'Leaderboards') {
                isActive = activeTab === 'overview';
              } else if (item.label === 'Dashboard') {
                isActive = false; // Admin Dashboard is the /admin root page
              } else {
                isActive = item.tab === activeTab;
              }
            } else {
              // When on main /admin dashboard
              isActive = pathname === '/admin' && (item.label === 'Dashboard' || item.label === 'Leaderboards');
              // To avoid highlighting both on /admin too, only highlight Dashboard:
              if (pathname === '/admin') {
                isActive = item.label === 'Dashboard';
              }
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(event) => {
                  setMobileOpen(false);
                  if (currentLeaderboardId && onTabSelect) {
                    if (item.label === 'Dashboard') {
                      // Navigate back to main admin dashboard
                      return;
                    }
                    event.preventDefault();
                    onTabSelect(item.tab);
                  }
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md font-bold text-xs sm:text-sm tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#D91E2E] text-white border-2 border-[#111111] retro-shadow-sm font-black'
                    : 'text-[#666666] hover:text-[#111111] hover:bg-[#FAF9F5]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#666666]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Area with Badge & Logout */}
      <div className="pt-6 border-t border-[#EBEBE6] space-y-6">
        <div className="flex justify-center">
          <BuildCreateInspireBadge />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#666666] hover:text-[#D91E2E] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden w-full bg-white border-b-2 border-[#111111] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <TinkerHubLogo href="/admin" className="h-9 w-auto" />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-1.5 border border-[#111111] rounded bg-[#FAF9F5] text-[#111111]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full z-10 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
