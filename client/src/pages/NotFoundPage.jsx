import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="glass w-full max-w-xl rounded-3xl p-10 text-center shadow-card">
        <p className="text-sm uppercase tracking-widest text-slate-400">404</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Page Not Found</h1>
        <p className="mt-3 text-slate-300">The page you are trying to access does not exist.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
