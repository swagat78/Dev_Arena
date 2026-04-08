import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import { analyticsApi } from '../services/api';

const LeaderboardPage = () => {
  const { token } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await analyticsApi.getLeaderboard(token);
        setLeaders(data);
      } catch (err) {
        setError(err.message || 'Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [token]);

  if (isLoading) return <LoadingScreen message="Loading leaderboard..." />;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto w-full flex flex-col gap-8">
        <header className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-orange-900/10 to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-amber-300">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Hall of Fame
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Global Leaderboard</h1>
              <p className="mt-3 text-lg text-slate-300 max-w-2xl">
                See how you measure up against the world's most dedicated coders. Ranks are determined by solved problems, contest performance, and submission rate.
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

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-12 border-b border-slate-800 bg-slate-900/50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <p className="col-span-1 text-center">Rank</p>
                <p className="col-span-5">Developer</p>
                <p className="col-span-2 text-center">Accepted Solutions</p>
                <p className="col-span-2 text-center">Acceptance Rate</p>
                <p className="col-span-2 text-right">Overall Score</p>
              </div>

              {leaders.map((item, index) => {
                const isTop3 = index < 3;
                
                return (
                  <div key={item.userId} className={`grid grid-cols-12 items-center border-b border-slate-800/50 px-6 py-4 transition-colors hover:bg-slate-800/50 ${isTop3 ? 'bg-slate-800/20' : ''}`}>
                    <p className="col-span-1 flex items-center justify-center">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-sm ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-yellow-900 shadow-amber-500/30' :
                        index === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 shadow-slate-400/30' :
                        index === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 shadow-amber-900/30' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {index + 1}
                      </span>
                    </p>
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 font-bold text-white border border-slate-700">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-bold ${isTop3 ? 'text-white' : 'text-slate-200'}`}>{item.name}</p>
                        <p className="text-xs text-slate-500">{item.totalSubmissions} Total Attempts</p>
                      </div>
                    </div>
                    <p className="col-span-2 text-center text-lg font-bold text-emerald-400">
                      {item.acceptedSubmissions}
                    </p>
                    <p className="col-span-2 text-center font-semibold text-slate-300">
                      {item.acceptanceRate}%
                    </p>
                    <p className="col-span-2 text-right text-xl font-extrabold text-amber-400 font-mono tracking-tight">
                      {item.score.toLocaleString()}
                    </p>
                  </div>
                );
              })}

              {!leaders.length ? (
                <div className="p-12 text-center">
                  <p className="text-slate-400 text-lg">No leaderboard data found.</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LeaderboardPage;
