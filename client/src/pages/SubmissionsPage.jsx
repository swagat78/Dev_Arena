import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import { submissionApi } from '../services/api';

const SubmissionsPage = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSubmissions = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await submissionApi.getMine(token);
        setSubmissions(data);
      } catch (err) {
        setError(err.message || 'Failed to load submissions');
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmissions();
  }, [token]);

  if (isLoading) {
    return <LoadingScreen message="Loading submissions..." />;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto w-full flex flex-col gap-8">
        <header className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/10 to-transparent"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Execution Logs
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">My Submissions</h1>
              <p className="mt-3 text-lg text-slate-300 max-w-2xl">
                Review your recent code executions, check your runtime analytics, and debug previous unaccepted attempts.
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
            <div className="min-w-[900px]">
              <div className="grid grid-cols-12 border-b border-slate-800 bg-slate-900/50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <p className="col-span-2">Time Submitted</p>
                <p className="col-span-4">Question</p>
                <p className="col-span-2 text-center">Status</p>
                <p className="col-span-2 text-center">Runtime / Memory</p>
                <p className="col-span-2 text-right">Language</p>
              </div>

              {submissions.map((sub) => (
                <div key={sub._id} className="grid grid-cols-12 items-center border-b border-slate-800/50 px-6 py-4 transition-colors hover:bg-slate-800/50">
                  <div className="col-span-2 flex flex-col">
                    <span className="text-sm font-medium text-slate-200">{new Date(sub.createdAt).toLocaleDateString()}</span>
                    <span className="text-xs text-slate-500">{new Date(sub.createdAt).toLocaleTimeString()}</span>
                  </div>
                  
                  <div className="col-span-4">
                    <p className="text-base font-bold text-white hover:text-brand-300 cursor-pointer">{sub.problem?.title || 'Unknown Problem'}</p>
                    {sub.totalTestCases > 0 && <p className="text-xs text-slate-400 mt-1">Tests: {sub.passedTestCases} / {sub.totalTestCases} passed</p>}
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      sub.status === 'accepted' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' :
                      sub.status === 'wrong-answer' ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' :
                      'border-amber-500/50 bg-amber-500/10 text-amber-400'
                    }`}>
                      {sub.verdictLabel || sub.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="col-span-2 flex flex-col items-center justify-center text-sm">
                    <div className="flex items-center gap-1 font-mono text-slate-300">
                      <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {sub.runtimeMs} ms
                    </div>
                    <div className="flex items-center gap-1 font-mono text-slate-500 mt-0.5 text-xs">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                      {sub.memoryKb} kb
                    </div>
                  </div>

                  <div className="col-span-2 text-right">
                    <span className="inline-block rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-mono font-bold text-slate-300">
                      {sub.language}
                    </span>
                  </div>
                </div>
              ))}

              {!submissions.length ? (
                <div className="p-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 mb-4">
                    <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No code executed yet</h3>
                  <p className="text-slate-400">Head over to the problems list and write your first algorithm!</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SubmissionsPage;
