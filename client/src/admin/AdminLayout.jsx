import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Building2, CalendarDays, ExternalLink, GraduationCap, Inbox, Landmark, LayoutDashboard, Mail, Menu, ScrollText, Settings as Cog, Sparkles, UserRound, X,
} from 'lucide-react';
import { LogoMark } from '../components/layout/Logo';
import { adminApi } from '../lib/adminApi';
import { useAuth } from './auth';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/admissions', label: 'Admissions', icon: Inbox, badge: 'newInterests' },
  { to: '/admin/messages', label: 'Messages', icon: Mail, badge: 'unreadMessages' },
  { to: '/admin/events', label: 'Events & announcements', icon: CalendarDays },
  { to: '/admin/disciplines', label: 'Programs', icon: GraduationCap },
  { to: '/admin/campuses', label: 'Campuses', icon: Building2 },
  { to: '/admin/services', label: 'Services', icon: Sparkles },
  { to: '/admin/college', label: 'College information', icon: Landmark },
  { to: '/admin/md-message', label: 'MD message', icon: UserRound },
  { to: '/admin/activity', label: 'Activity log', icon: ScrollText },
  { to: '/admin/settings', label: 'Settings', icon: Cog },
];

export default function AdminLayout() {
  const { admin } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const stats = useQuery({ queryKey: ['admin', 'stats'], queryFn: adminApi.stats, refetchInterval: 60000 });
  useEffect(() => { setOpen(false); }, [pathname]);

  const nav = (
    <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="space-y-1">
        {NAV.map(({ to, label, icon: Icon, end, badge }) => {
          const count = badge && stats.data ? stats.data[badge] : 0;
          return (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] ${isActive ? 'bg-white/10 font-semibold text-white shadow-[inset_3px_0_0_0_#D6A84F]' : 'text-navy-100 hover:bg-white/5'}`}
              >
                <Icon size={19} aria-hidden="true" />
                <span className="flex-1">{label}</span>
                {count > 0 && <span className="rounded-full bg-[#173B7A] px-2 text-xs font-bold text-navy-900" aria-label={`${count} new`}>{count}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-900 text-white">
      <div className="flex items-center gap-3 px-5 py-5"><LogoMark className="h-9 w-9" /><span className="font-display text-lg">Admin</span></div>
      {nav}
      <div className="border-t border-white/10 px-5 py-4 text-sm">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-navy-100 hover:text-[#173B7A]">View website <ExternalLink size={14} aria-hidden="true" /></a>
        <p className="mt-2 truncate text-navy-300">{admin?.email}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[17rem_1fr]">
      <a href="#admin-main" className="skip-link">Skip to content</a>
      <aside className="sticky top-0 hidden h-screen lg:block">{sidebar}</aside>

      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy-900 px-4 py-3 text-white lg:hidden">
        <span className="flex items-center gap-2 font-display text-lg"><LogoMark className="h-8 w-8" /> Admin</span>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="rounded-md p-2 hover:bg-white/10"><Menu size={24} /></button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%]">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-2 top-3 z-10 rounded-md p-2 text-white hover:bg-white/10"><X size={22} /></button>
            {sidebar}
          </div>
        </div>
      )}

      <main id="admin-main" className="min-w-0 px-4 py-8 sm:px-8"><Outlet /></main>
    </div>
  );
}


