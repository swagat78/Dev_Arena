import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import { problemApi } from '../services/api';

const ProblemsPage = () => {
  const { token } = useAuth();

  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadProblems = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await problemApi.getAll(token, filters);
      setProblems(data);
    } catch (err) {
      setError(err.message || 'Failed to load problems');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.difficulty]);

  if (isLoading) {
    return <LoadingScreen message="Loading problems..." />;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto w-full flex flex-col gap-8">
        <header className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-blue-900/20 to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-brand-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                Problem Set
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Algorithmic Challenges</h1>
              <p className="mt-3 text-lg text-slate-300 max-w-2xl">
                Sharpen your coding skills with our expanding library of challenges. Filter by difficulty, find topics you love, and master your algorithms.
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

          <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-3">
              <input
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Search problems by title or keywords..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-sm text-white shadow-inner outline-none placeholder:text-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
            <div className="relative sm:col-span-1" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-sm text-white shadow-inner focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-semibold"
              >
                <span className="capitalize">
                  {filters.difficulty ? filters.difficulty : 'All Difficulties'}
                </span>
                <svg className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-16 left-0 right-0 z-[200] mt-2 overflow-hidden rounded-2xl border-2 border-slate-500 bg-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)]">
                  {['', 'easy', 'medium', 'hard'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setFilters(prev => ({ ...prev, difficulty: opt }));
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-5 py-3.5 text-sm font-bold transition-colors hover:bg-slate-700 text-slate-200 hover:text-white border-b border-slate-700/80 last:border-b-0"
                    >
                      {opt ? opt.charAt(0).toUpperCase() + opt.slice(1) : 'All Difficulties'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <AlertMessage type="error" message={error} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {problems.map((problem) => {
            const acceptance =
              problem.totalSubmissions > 0
                ? Math.round((problem.acceptedSubmissions / problem.totalSubmissions) * 100)
                : 0;

            const diffColor = problem.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                              problem.difficulty === 'medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 
                              'text-rose-400 bg-rose-500/10 border-rose-500/20';

            return (
              <article
                key={problem._id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/10"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h2 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">{problem.title}</h2>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${diffColor}`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {(problem.tags || []).map((tag) => (
                      <span
                        key={`${problem._id}-${tag}`}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-5">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase font-semibold">Acceptance Rate</span>
                    <strong className="text-sm text-slate-200 mt-1">{acceptance}%</strong>
                  </div>
                  <Link
                    to={`/problems/${problem.slug}`}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:from-brand-500 hover:to-indigo-500"
                  >
                    Solve Challenge
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}

          {!problems.length ? (
            <div className="col-span-1 md:col-span-2 xl:col-span-3 flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/30 p-12 text-center">
              <h3 className="text-xl font-bold text-white mb-2">No problems found</h3>
              <p className="text-slate-400">Try adjusting your search filters to find what you're looking for.</p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default ProblemsPage;
