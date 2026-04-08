import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import { analyticsApi } from '../services/api';

const UsersInsightsPage = () => {
  const { token } = useAuth();

  const [data, setData] = useState({ totalUsers: 0, loggedInAtLeastOnce: 0, users: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');

      try {
        const result = await analyticsApi.getUsers(token);
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to load user insights');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [token]);

  if (isLoading) {
    return <LoadingScreen message="Loading users insights..." />;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto w-full flex flex-col gap-8">
        <header className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-pink-900/10 to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-rose-300">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Dev Community
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Platform Users</h1>
              <p className="mt-3 text-lg text-slate-300 max-w-2xl">
                Discover the talented developers participating on this competitive workspace.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-950/50 border border-slate-800 p-4">
                   <div className="rounded-xl border border-rose-500/30 bg-rose-500/20 p-3 text-rose-400">
                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                   </div>
                   <div>
                     <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered</p>
                     <p className="text-2xl font-black text-white">{data.totalUsers}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-slate-950/50 border border-slate-800 p-4">
                   <div className="rounded-xl border border-brand-500/30 bg-brand-500/20 p-3 text-brand-400">
                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <div>
                     <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Coders</p>
                     <p className="text-2xl font-black text-white">{data.loggedInAtLeastOnce}</p>
                   </div>
                </div>
              </div>
            </div>
            
            <Link
              to="/dashboard"
              className="group flex w-max items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-slate-700 backdrop-blur-md shadow-lg"
            >
              <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </header>

        <AlertMessage type="error" message={error} />

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
           <div className="overflow-x-auto">
             <div className="min-w-[900px]">
              <div className="grid grid-cols-12 border-b border-slate-800 bg-slate-900/50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <p className="col-span-4">Developer</p>
                <p className="col-span-3">Email</p>
                <p className="col-span-2">Joined Date</p>
                <p className="col-span-2">Last Active</p>
                <p className="col-span-1 text-right">Visits</p>
              </div>

              {(data.users || []).map((user) => (
                <div key={user._id} className="grid grid-cols-12 items-center border-b border-slate-800/50 px-6 py-4 transition-colors hover:bg-slate-800/50">
                  <div className="col-span-4 flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 font-bold text-white border border-slate-700 shadow-inner">
                        {user.name.charAt(0).toUpperCase()}
                     </div>
                     <p className="font-bold text-white">{user.name}</p>
                  </div>
                  <p className="col-span-3 text-sm text-slate-300 truncate pr-4">{user.email}</p>
                  <p className="col-span-2 text-sm text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                  <p className="col-span-2 text-sm text-slate-400">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short'}) : 'Never'}
                  </p>
                  <p className="col-span-1 text-right text-lg font-black text-brand-300">
                    {user.loginCount || 0}
                  </p>
                </div>
              ))}

              {!data.users?.length ? (
                <p className="p-12 text-center text-slate-400 text-lg">No users found.</p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UsersInsightsPage;
