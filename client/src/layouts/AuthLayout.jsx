import { Link, Outlet, useLocation } from 'react-router-dom';

const AuthLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';
  const isForgot = location.pathname === '/forgot-password';

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:py-12 text-slate-100">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient-shift opacity-30"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #0f172a 50%, #172554 75%, #0f172a 100%)',
          backgroundSize: '400% 400%',
        }}
      />

      {/* Floating orbs for visual depth */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-brand-600/10 blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 right-1/3 h-48 w-48 rounded-full bg-purple-600/10 blur-[80px] animate-pulse-glow" style={{ animationDelay: '3s' }} />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center lg:min-h-[85vh]">
        {/* Left — Branding & Features */}
        <section className="hidden lg:flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/30">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Dev Arena</span>
          </div>

          <p className="mb-6 inline-flex w-fit rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-300">
            Full-Stack Coding Platform
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl">
            Code, compete, and{' '}
            <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
              level up
            </span>{' '}
            your skills.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
            Dev Arena is your all-in-one platform for solving coding challenges, tracking progress, and competing with developers worldwide.
          </p>
          <ul className="mt-10 space-y-4">
            {[
              { icon: '🔐', text: 'Secure authentication with JWT + bcrypt' },
              { icon: '📊', text: 'Personal dashboard with analytics & leaderboard' },
              { icon: '🏆', text: 'Weekly contests & coding challenges' },
              { icon: '💻', text: 'Built-in code editor with live execution' },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 text-base shadow-inner border border-slate-700/50">
                  {icon}
                </span>
                <span className="text-[15px]">{text}</span>
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'].map((color, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 text-xs font-bold text-white shadow-md"
                  style={{ background: color }}
                >
                  {['SN', 'AK', 'PR', 'MK'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">1,000+ developers</p>
              <p className="text-xs text-slate-400">already solving challenges</p>
            </div>
          </div>
        </section>

        {/* Right — Auth Form */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Glow ring behind card */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-brand-500/20 via-indigo-500/20 to-purple-500/20 blur-xl opacity-60" />
              <div className="relative rounded-3xl border border-slate-700/50 bg-slate-900/80 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-white">Dev Arena</span>
                  </Link>
                  <span className="rounded-full border border-slate-700/50 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-400 backdrop-blur">
                    {isLogin ? 'Welcome Back' : isRegister ? 'Get Started' : 'Recovery'}
                  </span>
                </div>
                <Outlet />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile branding — shown on small screens */}
      <div className="relative z-10 mt-8 text-center lg:hidden">
        <p className="text-xs text-slate-500">Dev Arena — Full-Stack Coding Platform</p>
      </div>
    </div>
  );
};

export default AuthLayout;
