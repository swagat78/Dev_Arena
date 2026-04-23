import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { analyticsApi, contestApi } from '../services/api';

const NOTIF_READ_KEY = 'dev_arena_notif_read';

const generateNotifications = (user, stats) => {
  const notifications = [];
  const now = new Date();

  // Welcome notification
  notifications.push({
    id: 'welcome',
    icon: '🚀',
    iconBg: 'bg-brand-500/20',
    title: 'Welcome to Dev Arena!',
    message: 'Your coding journey starts here. Try solving your first problem.',
    time: user?.createdAt ? new Date(user.createdAt) : now,
  });

  // Profile completion
  const profile = user?.profile || {};
  const filledFields = ['fullName', 'gender', 'location', 'github', 'linkedin', 'work', 'education', 'skills', 'avatarUrl']
    .filter((f) => profile[f]);
  if (filledFields.length < 5) {
    notifications.push({
      id: 'profile_incomplete',
      icon: '👤',
      iconBg: 'bg-amber-500/20',
      title: 'Complete your profile',
      message: `You've filled ${filledFields.length}/9 fields. A complete profile helps you stand out.`,
      time: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    });
  } else {
    notifications.push({
      id: 'profile_complete',
      icon: '✅',
      iconBg: 'bg-emerald-500/20',
      title: 'Profile looking great!',
      message: `${filledFields.length}/9 profile fields completed. Well done!`,
      time: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    });
  }

  // Stats-based
  const solved = stats?.solvedProblems || 0;
  if (solved === 0) {
    notifications.push({
      id: 'first_problem',
      icon: '💡',
      iconBg: 'bg-indigo-500/20',
      title: 'Solve your first challenge',
      message: 'Head to Problems to start solving. Every journey begins with one step.',
      time: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    });
  } else if (solved >= 5) {
    notifications.push({
      id: 'milestone_5',
      icon: '🏅',
      iconBg: 'bg-yellow-500/20',
      title: `${solved} problems solved!`,
      message: "You're making excellent progress. Keep the momentum going!",
      time: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    });
  }

  // Account age
  if (user?.createdAt) {
    const daysSinceJoin = Math.floor((now - new Date(user.createdAt)) / 86400000);
    if (daysSinceJoin >= 7) {
      notifications.push({
        id: 'one_week',
        icon: '📅',
        iconBg: 'bg-purple-500/20',
        title: `${daysSinceJoin} days on Dev Arena`,
        message: "You've been a member for over a week. Great commitment!",
        time: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      });
    }
  }

  // Contest reminder
  notifications.push({
    id: 'contest_reminder',
    icon: '🏆',
    iconBg: 'bg-rose-500/20',
    title: 'Upcoming contests',
    message: 'Check out this week\'s coding challenges and compete for the leaderboard.',
    time: new Date(now.getTime() - 10 * 60 * 60 * 1000),
  });

  return notifications.sort((a, b) => b.time - a.time);
};

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifs, setReadNotifs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(NOTIF_READ_KEY)) || []; } catch { return []; }
  });
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await analyticsApi.getMyStats(token);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (isLoading) {
    return <LoadingScreen message="Loading your coding dashboard..." />;
  }

  const solvedProblems = stats?.solvedProblems || 0;
  const acceptanceRate = stats?.acceptanceRate || 0;
  const totalSubmissions = stats?.totalSubmissions || 0;
  const recentActivity = stats?.recentActivity || [];

  const problemsSolvedToday = recentActivity.filter(sub => sub.status === 'accepted' && new Date(sub.createdAt).toDateString() === new Date().toDateString()).length;
  const dailyGoalPercentage = Math.min(100, Math.round((problemsSolvedToday / 3) * 100));

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full flex-col gap-8">
        {/* Navigation and Header Row */}
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between rounded-3xl bg-slate-900/50 p-6 shadow-xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-brand-500 bg-slate-800 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 font-bold text-white text-xl uppercase">
                {user?.name?.charAt(0) || 'D'}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium tracking-wide text-brand-400 uppercase">Welcome back</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">{user?.name || 'Developer'}</h1>
              <p className="mt-1 text-sm text-slate-400">
                Ready to conquer new coding challenges today?
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 bg-slate-950/60 p-2 rounded-2xl border border-slate-800/80 shadow-inner mt-4 lg:mt-0">
            <Link
              to="/problems"
              className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-brand-500/10 hover:text-brand-300"
            >
              <svg className="h-4 w-4 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              Problems
            </Link>
            <Link
              to="/contests"
              className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-indigo-500/10 hover:text-indigo-300"
            >
              <svg className="h-4 w-4 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2z"/></svg>
              Contests
            </Link>
            <Link
              to="/submissions"
              className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-emerald-500/10 hover:text-emerald-300"
            >
              <svg className="h-4 w-4 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Submissions
            </Link>
            <Link
              to="/leaderboard"
              className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-amber-500/10 hover:text-amber-300"
            >
              <svg className="h-4 w-4 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z"/></svg>
              Leaderboard
            </Link>
            <Link
              to="/users-insights"
              className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-pink-500/10 hover:text-pink-300"
            >
              <svg className="h-4 w-4 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              Users
            </Link>
            
            <div className="w-px h-6 bg-slate-700 mx-1"></div>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex items-center justify-center h-9 w-9 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Notifications"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {(() => {
                  const notifs = generateNotifications(user, stats);
                  const unread = notifs.filter(n => !readNotifs.includes(n.id)).length;
                  return unread > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white border-2 border-slate-900">{unread}</span>
                    </span>
                  ) : null;
                })()}
              </button>

              {showNotifications && (() => {
                const notifs = generateNotifications(user, stats);
                const unreadCount = notifs.filter(n => !readNotifs.includes(n.id)).length;
                
                const markAllRead = () => {
                  const ids = notifs.map(n => n.id);
                  setReadNotifs(ids);
                  localStorage.setItem(NOTIF_READ_KEY, JSON.stringify(ids));
                };

                const markOneRead = (id) => {
                  if (!readNotifs.includes(id)) {
                    const next = [...readNotifs, id];
                    setReadNotifs(next);
                    localStorage.setItem(NOTIF_READ_KEY, JSON.stringify(next));
                  }
                };

                return (
                  <div className="absolute right-0 mt-3 w-[340px] rounded-2xl border border-slate-700 bg-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] z-[200] overflow-hidden">
                    <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 border-l border-t border-slate-700 bg-slate-800"></div>
                    <div className="relative flex items-center justify-between px-4 py-3 border-b border-slate-700">
                      <h3 className="font-bold text-white text-sm">Notifications {unreadCount > 0 && <span className="text-xs font-normal text-slate-400">({unreadCount} new)</span>}</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition">Mark all read</button>
                      )}
                    </div>
                    <div className="relative max-h-[320px] overflow-y-auto">
                      {notifs.map((n) => {
                        const isRead = readNotifs.includes(n.id);
                        return (
                          <div
                            key={n.id}
                            onClick={() => markOneRead(n.id)}
                            className={`flex gap-3 items-start px-4 py-3 cursor-pointer transition border-b border-slate-700/50 last:border-b-0 ${isRead ? 'opacity-60 hover:opacity-80' : 'hover:bg-slate-700/40'}`}
                          >
                            <div className={`flex-shrink-0 flex items-center justify-center rounded-xl ${n.iconBg} h-9 w-9 text-base border border-slate-700/30 mt-0.5`}>
                              {n.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-100 truncate">{n.title}</p>
                                {!isRead && <span className="h-2 w-2 rounded-full bg-brand-500 flex-shrink-0"></span>}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                              <p className="text-[10px] font-semibold text-slate-500 mt-1.5 uppercase tracking-wider">{formatTimeAgo(n.time)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-yellow-300 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <Link
              to="/profile"
              className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Profile Settings"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </Link>
            <button
              onClick={logout}
              className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </nav>
        </header>

        {/* Stats Grid */}
        <section className="grid gap-6 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl transition hover:border-brand-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-transparent"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Problems Solved</p>
                <div className="rounded-full bg-brand-500/20 p-2 text-brand-300">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-white">{solvedProblems}</p>
              <p className="mt-2 text-sm text-slate-400">
                You're in the top 15% of active users!
              </p>
            </div>
            <div className="h-1 w-full bg-slate-800">
              <div className="h-full bg-brand-500" style={{ width: `${Math.min(100, solvedProblems)}%` }}></div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl transition hover:border-emerald-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Acceptance Rate</p>
                <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-300">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-white">{acceptanceRate}%</p>
              <p className="mt-2 text-sm text-slate-400">
                Based on {totalSubmissions} total submissions
              </p>
            </div>
            <div className="h-1 w-full bg-slate-800">
              <div className="h-full bg-emerald-500" style={{ width: `${acceptanceRate}%` }}></div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl transition hover:border-indigo-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Global Rank</p>
                <div className="rounded-full bg-indigo-500/20 p-2 text-indigo-300">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-white">#1,024</p>
              <p className="mt-2 text-sm text-slate-400">
                Out of 10k+ registered coders
              </p>
            </div>
            <div className="h-1 w-full bg-slate-800">
              <div className="h-full bg-indigo-500" style={{ width: `70%` }}></div>
            </div>
          </div>
        </section>

        {/* Dashboard Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Submissions */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-white">Recent Submissions</h2>
              <Link to="/submissions" className="text-sm font-semibold text-brand-400 hover:text-brand-300">
                View all →
              </Link>
            </div>
            
            <div className="flex-1">
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-900 p-4 border border-slate-800 transition hover:border-slate-700">
                      <div>
                        <p className="font-semibold text-slate-200">Submission #{sub._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs mt-1 text-slate-400">{new Date(sub.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          sub.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          sub.status === 'wrong-answer' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {sub.status.replace('-', ' ')}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">{sub.runtimeMs ? `${sub.runtimeMs}ms` : '--'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 p-10 text-center">
                  <div className="rounded-full bg-slate-800 p-4 mb-4">
                    <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No Submissions Yet</h3>
                  <p className="text-sm text-slate-400 max-w-sm mb-6">
                    Start solving problems to see your code execution stats and recent activity here.
                  </p>
                  <Link to="/problems" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 shadow-lg shadow-brand-500/30">
                    Solve Random Problem
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Quick Actions & Upcoming Contests */}
          <section className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex-1 bg-gradient-to-b from-indigo-900/20 to-transparent">
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">Upcoming Contests</h2>
              <p className="text-sm text-slate-400 mb-6">Test your skills against the best programmers worldwide.</p>
              
              <div className="space-y-4">
                <div className="group overflow-hidden rounded-2xl border border-indigo-500/30 bg-indigo-900/20 p-5 transition hover:bg-indigo-900/30 hover:border-indigo-400/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block rounded bg-indigo-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm mb-2">
                        Official
                      </span>
                      <h3 className="text-lg font-bold text-indigo-100">Weekly Coding Challenge 40</h3>
                      <p className="text-sm text-indigo-300 mt-1">Starts in: 2 days, 4 hours</p>
                    </div>
                    <Link to="/contests" className="rounded-lg bg-indigo-600/20 p-2 text-indigo-300 transition group-hover:bg-indigo-500 group-hover:text-white">
                      →
                    </Link>
                  </div>
                </div>
                
                <div className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-600">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block rounded bg-slate-700 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Community
                      </span>
                      <h3 className="text-lg font-bold text-slate-200">Algorithm Sprint</h3>
                      <p className="text-sm text-slate-400 mt-1">Starts in: 5 days, 12 hours</p>
                    </div>
                     <Link to="/contests" className="rounded-lg bg-slate-800 p-2 text-slate-400 transition group-hover:bg-slate-700 group-hover:text-white">
                      →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-brand-500/20 bg-brand-900/10 p-6">
              <h3 className="text-lg font-bold text-brand-100 mb-4">Daily Goal</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-brand-300">{problemsSolvedToday} / 3 Problems Today</span>
                    <span className="text-brand-200 font-bold">{dailyGoalPercentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-indigo-500" style={{ width: `${dailyGoalPercentage}%` }}></div>
                  </div>
                </div>
                <Link to="/problems" className="bg-brand-600 text-white px-4 py-2 rounded-xl border border-brand-500 text-sm font-semibold whitespace-nowrap hover:bg-brand-500 transition">
                  {problemsSolvedToday >= 3 ? 'Completed!' : 'Continue'}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
