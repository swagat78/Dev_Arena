import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import { problemApi, submissionApi } from '../services/api';

const LANGUAGE_OPTIONS = ['javascript', 'python', 'java', 'cpp'];

const ProblemSolvePage = () => {
  const { slug } = useParams();
  const { token } = useAuth();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const acceptance = useMemo(() => {
    if (!problem?.totalSubmissions) return 0;
    return Math.round((problem.acceptedSubmissions / problem.totalSubmissions) * 100);
  }, [problem]);

  const loadProblemAndSubmissions = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await problemApi.getBySlug(slug, token);
      setProblem(data);

      const initialLanguage = LANGUAGE_OPTIONS.includes(data.language) ? data.language : 'javascript';
      setLanguage(initialLanguage);
      setCode(data.starterCode?.[initialLanguage] || data.starterCode?.javascript || '');

      const mine = await submissionApi.getMine(token, data._id);
      setSubmissions(mine);
    } catch (err) {
      setError(err.message || 'Failed to load problem workspace');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProblemAndSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!problem) return;
    setCode(problem.starterCode?.[language] || problem.starterCode?.javascript || '');
  }, [language, problem]);

  const handleRunAndSubmit = async () => {
    if (!problem?._id) return;

    setError('');
    setSuccess('');

    if (!code.trim()) {
      setError('Code cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await submissionApi.create(
        {
          problemId: problem._id,
          language,
          sourceCode: code,
        },
        token
      );

      setSubmissions((prev) => [created, ...prev]);
      setSuccess(
        `Submission verdict: ${created.verdictLabel || created.status.replaceAll('_', ' ').toUpperCase()} | Runtime: ${created.runtimeMs}ms`
      );

      setProblem((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          totalSubmissions: (prev.totalSubmissions || 0) + 1,
          acceptedSubmissions:
            created.status === 'accepted'
              ? (prev.acceptedSubmissions || 0) + 1
              : prev.acceptedSubmissions || 0,
        };
      });
    } catch (err) {
      setError(err.message || 'Failed to submit code');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Preparing coding workspace..." />;
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
          <p className="text-slate-300">Problem not found.</p>
          <Link to="/problems" className="mt-4 inline-block text-brand-200 hover:text-white">
            Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-2">
        <section className="glass rounded-3xl p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Solve Problem</p>
              <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
            </div>
            <Link to="/problems" className="text-sm text-brand-100 hover:text-white">
              ← Back
            </Link>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase text-slate-200">
              {problem.difficulty}
            </span>
            <span className="text-xs text-slate-400">Acceptance {acceptance}%</span>
          </div>

          <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-200">{problem.description}</p>

          <div className="mt-6 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Examples</h2>
              <div className="mt-2 space-y-2">
                {(problem.examples || []).map((example, idx) => (
                  <div key={`${problem._id}-ex-${idx}`} className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-slate-300">
                    <p>
                      <span className="text-slate-400">Input:</span> {example.input}
                    </p>
                    <p>
                      <span className="text-slate-400">Output:</span> {example.output}
                    </p>
                    {example.explanation ? (
                      <p>
                        <span className="text-slate-400">Explanation:</span> {example.explanation}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">Constraints</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-300">
                {(problem.constraints || []).map((constraint) => (
                  <li key={`${problem._id}-${constraint}`}>{constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="glass rounded-3xl p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Code Editor</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <AlertMessage type="error" message={error} />
          <AlertMessage type="success" message={success} />

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-4 min-h-[360px] w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-brand-500"
          />

          <button
            type="button"
            onClick={handleRunAndSubmit}
            disabled={isSubmitting}
            className="mt-4 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Run & Submit'}
          </button>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-white">Recent Submissions</h3>
            <div className="mt-3 space-y-2">
              {submissions.slice(0, 6).map((submission) => (
                <div
                  key={submission._id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs"
                >
                  <span className="text-slate-300">{submission.language}</span>
                  <span
                    className={`font-semibold ${
                      submission.status === 'accepted' ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {submission.verdictLabel || submission.status.replaceAll('_', ' ')}
                  </span>
                  <span className="text-slate-400">{submission.runtimeMs}ms</span>
                </div>
              ))}

              {!submissions.length ? (
                <p className="text-xs text-slate-400">No submissions yet for this problem.</p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProblemSolvePage;
