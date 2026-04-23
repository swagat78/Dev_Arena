import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome back</h2>
      <p className="mt-2 text-sm text-slate-400">Sign in to continue your coding journey.</p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <AlertMessage type="error" message={error} />

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-11 pr-4 py-3 text-slate-100 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 placeholder-slate-500"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-11 pr-12 py-3 text-slate-100 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 placeholder-slate-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition"
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-3.5 font-semibold text-white transition-all hover:shadow-lg hover:shadow-brand-500/25 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="relative z-10">{isSubmitting ? 'Signing in...' : 'Sign in'}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link to="/forgot-password" className="text-sm font-medium text-brand-400 hover:text-brand-300 transition">
          Forgot Password?
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-xs text-slate-500 uppercase tracking-wider">or</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      <p className="mt-5 text-center text-sm text-slate-400">
        New here?{' '}
        <Link className="font-semibold text-brand-400 hover:text-brand-300 transition" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
