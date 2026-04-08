import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <section className="glass hidden rounded-3xl p-10 shadow-card lg:block">
          <p className="mb-6 inline-flex rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand-100">
            Major MERN Project
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white">
            Build, track, and manage your personal projects like a pro.
          </h1>
          <p className="mt-5 max-w-xl text-slate-300">
            Project Hub is a production-ready MERN application with secure JWT authentication,
            user-specific dashboards, and complete CRUD workflows backed by MongoDB.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            <li>• Secure login with JWT + bcrypt hashing</li>
            <li>• User-specific data isolation and project analytics</li>
            <li>• Clean architecture following major full-stack project standards</li>
          </ul>
        </section>

        <section className="glass rounded-3xl p-6 shadow-card sm:p-10">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/" className="text-lg font-semibold text-white">
              Project Hub
            </Link>
            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
              Interview Ready
            </span>
          </div>
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
