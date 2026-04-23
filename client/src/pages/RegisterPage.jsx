import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import { useAuth } from '../context/AuthContext';

const PASSWORD_MIN_LENGTH = 8;

const hasUppercase = (value) => /[A-Z]/.test(value);
const hasSymbol = (value) => /[^A-Za-z0-9]/.test(value);

const getPasswordErrors = (password) => {
  const errors = [];
  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`At least ${PASSWORD_MIN_LENGTH} characters`);
  }
  if (!hasUppercase(password)) {
    errors.push('One uppercase letter');
  }
  if (!hasSymbol(password)) {
    errors.push('One symbol (e.g. @, #, $, !)');
  }
  return errors;
};

const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (hasUppercase(password)) score++;
  if (hasSymbol(password)) score++;
  if (/[0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-rose-500' };
  if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 3) return { level: 3, label: 'Good', color: 'bg-yellow-500' };
  if (score <= 4) return { level: 4, label: 'Strong', color: 'bg-emerald-500' };
  return { level: 5, label: 'Excellent', color: 'bg-green-500' };
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordErrors = getPasswordErrors(formData.password);
  const isPasswordValid = passwordErrors.length === 0;
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const strength = getPasswordStrength(formData.password);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please complete all required fields');
      return;
    }
    if (!isPasswordValid) {
      setError('Please fix password requirements');
      return;
    }
    if (!doPasswordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.message || 'Could not create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white tracking-tight">Create your account</h2>
      <p className="mt-2 text-sm text-slate-400">Start solving problems and competing with developers.</p>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
        <AlertMessage type="error" message={error} />

        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="name">Name</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="name" name="name" type="text" value={formData.name} onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-11 pr-4 py-3 text-slate-100 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 placeholder-slate-500"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="email">Email</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              id="email" name="email" type="email" value={formData.email} onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-11 pr-4 py-3 text-slate-100 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 placeholder-slate-500"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="password">Password</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange}
              className={`w-full rounded-xl border bg-slate-800/50 pl-11 pr-12 py-3 text-slate-100 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 placeholder-slate-500 ${
                formData.password && !isPasswordValid ? 'border-rose-500/50' : 'border-slate-700'
              }`}
              placeholder="Min 8 chars, 1 uppercase, 1 symbol"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition">
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>

          {/* Password strength bar */}
          {formData.password && (
            <div className="mt-2.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength.level ? strength.color : 'bg-slate-700'
                  }`} />
                ))}
              </div>
              <div className="mt-1.5 flex justify-between">
                <span className={`text-xs font-medium ${
                  strength.level <= 1 ? 'text-rose-400' : strength.level <= 2 ? 'text-amber-400' : strength.level <= 3 ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {strength.label}
                </span>
              </div>
              {!isPasswordValid && (
                <ul className="mt-2 space-y-1">
                  {passwordErrors.map((err) => (
                    <li key={err} className="flex items-center gap-2 text-xs text-rose-400">
                      <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="confirmPassword">Confirm password</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <input
              id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange}
              className={`w-full rounded-xl border bg-slate-800/50 pl-11 pr-12 py-3 text-slate-100 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 placeholder-slate-500 ${
                formData.confirmPassword && !doPasswordsMatch ? 'border-rose-500/50' : 'border-slate-700'
              }`}
              placeholder="Repeat your password"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition">
              {showConfirm ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
          {formData.confirmPassword && !doPasswordsMatch && (
            <p className="mt-2 flex items-center gap-2 text-xs text-rose-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              Passwords do not match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isPasswordValid || !doPasswordsMatch}
          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-3.5 font-semibold text-white transition-all hover:shadow-lg hover:shadow-brand-500/25 disabled:cursor-not-allowed disabled:opacity-70 mt-2"
        >
          <span className="relative z-10">{isSubmitting ? 'Creating account...' : 'Create account'}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link className="font-semibold text-brand-400 hover:text-brand-300 transition" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
