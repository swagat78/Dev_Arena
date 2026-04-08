import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import { authApi } from '../services/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.newPassword || !formData.confirmPassword) {
      setError('Please complete all required fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/[A-Z]/.test(formData.newPassword)) {
      setError('Password must include at least one uppercase letter');
      return;
    }

    if (!/[^A-Za-z0-9]/.test(formData.newPassword)) {
      setError('Password must include at least one symbol');
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.forgotPassword({
        email: formData.email,
        newPassword: formData.newPassword,
      });
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (apiError) {
      setError(apiError.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">Reset your password</h2>
      <p className="mt-2 text-sm text-slate-400">Enter your email and create a new password.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <AlertMessage type="error" message={error} />
        <AlertMessage type="success" message={success} />

        <div>
          <label className="mb-1 block text-sm text-slate-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-300" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-500"
            placeholder="Minimum 8 chars, 1 uppercase, 1 symbol"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-300" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-500"
            placeholder="Repeat your new password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Resetting password...' : 'Reset Password'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        Remember your password?{' '}
        <Link className="font-semibold text-brand-100 hover:text-white" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
