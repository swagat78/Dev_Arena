import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import { contestApi } from '../services/api';

const ContestsPage = () => {
  const { token } = useAuth();
  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadContests = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await contestApi.getAll(token);
        setContests(data);
      } catch (err) {
        setError(err.message || 'Failed to load contests');
      } finally {
        setIsLoading(false);
      }
    };

    loadContests();
  }, [token]);

  if (isLoading) {
    return <LoadingScreen message="Loading contests..." />;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto w-full flex flex-col gap-8">
        {/* Modern Full-Screen Header */}
        <header className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Global Competitions
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Code Contests</h1>
              <p className="mt-3 text-lg text-slate-300 max-w-2xl">
                Compete against the best developers in the community. Solve algorithmic challenges under pressure and climb the global ranks!
              </p>
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

        {/* Dynamic Contests Grid */}
        <section className="grid gap-6 xl:grid-cols-2">
          {contests.map((contest) => (
            <article
              key={contest._id}
              className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 transition-all hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20">
                <svg className="h-24 w-24 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                      contest.status === 'live' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                      contest.status === 'upcoming' ? 'border-sky-500/30 bg-sky-500/10 text-sky-400' :
                      'border-slate-700 bg-slate-800 text-slate-400'
                    }`}>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{contest.title}</h2>
                  </div>
                  <span
                    className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm ${
                      contest.status === 'live'
                        ? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                        : contest.status === 'upcoming'
                          ? 'border border-sky-500/50 bg-sky-500/20 text-sky-300'
                          : 'border border-slate-600 bg-slate-800/80 text-slate-400'
                    }`}
                  >
                    {contest.status}
                  </span>
                </div>

                <p className="mt-4 text-base text-slate-300 max-w-3xl leading-relaxed border-l-2 border-indigo-500/30 pl-4">
                  {contest.description}
                </p>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-4 rounded-2xl bg-slate-950/50 p-5 border border-slate-800/50">
                  <div className="flex flex-col lg:col-span-1">
                    <span className="text-xs font-semibold uppercase text-slate-500 mb-1">Starts At</span>
                    <span className="text-sm font-medium text-slate-200">{new Date(contest.startTime).toLocaleString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex flex-col lg:col-span-1">
                    <span className="text-xs font-semibold uppercase text-slate-500 mb-1">Ends At</span>
                    <span className="text-sm font-medium text-slate-200">{new Date(contest.endTime).toLocaleString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex flex-col lg:col-span-1">
                    <span className="text-xs font-semibold uppercase text-slate-500 mb-1">Total Problems</span>
                    <span className="text-sm font-medium text-slate-200">{contest.problemIds?.length || 0} Challenges</span>
                  </div>
                  <div className="flex flex-col justify-end items-end lg:col-span-1">
                    <Link to={contest.status === 'live' ? '/problems' : '#'} className={`w-full xl:w-max block text-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition ${contest.status === 'live' ? 'bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5' : 'bg-slate-700 hover:bg-slate-600'}`}>
                      {contest.status === 'live' ? 'Enter Now' : 'View Details'}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {!contests.length ? (
            <div className="xl:col-span-2 flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/30 p-12 text-center">
              <div className="mb-4 rounded-full bg-slate-800 p-6">
                <svg className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No active contests</h3>
              <p className="text-slate-400 max-w-sm">The arena is currently quiet. Stay tuned for upcoming official and community coding contests.</p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default ContestsPage;
