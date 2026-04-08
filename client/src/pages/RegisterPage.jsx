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
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }

  if (!hasUppercase(password)) {
    errors.push('Password must include at least one uppercase letter');
  }

  if (!hasSymbol(password)) {
    errors.push('Password must include at least one symbol (e.g. @, #, $, !)');
  }

  return errors;
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

  const passwordErrors = getPasswordErrors(formData.password);
  const isPasswordValid = passwordErrors.length === 0;
  const doPasswordsMatch = formData.password === formData.confirmPassword;

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
      <h2 className="text-2xl font-bold text-white">Create your account</h2>
      <p className="mt-2 text-sm text-slate-400">Start building and tracking your projects in one place.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <AlertMessage type="error" message={error} />

        <div>
          <label className="mb-1 block text-sm text-slate-300" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-500"
            placeholder="John Doe"
          />
        </div>

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
          <label className="mb-1 block text-sm text-slate-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full rounded-xl border bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-500 ${
              formData.password && !isPasswordValid ? 'border-red-500' : 'border-slate-700'
            }`}
            placeholder="Minimum 8 chars, 1 uppercase, 1 symbol"
          />
          {formData.password && !isPasswordValid ? (
            <ul className="mt-2 space-y-1 text-sm text-red-400">
              {passwordErrors.map((passwordError) => (
                <li key={passwordError}>• {passwordError}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-300" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full rounded-xl border bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-500 ${
              formData.confirmPassword && !doPasswordsMatch ? 'border-red-500' : 'border-slate-700'
            }`}
            placeholder="Repeat your password"
          />
          {formData.confirmPassword && !doPasswordsMatch ? (
            <p className="mt-2 text-sm text-red-400">Passwords do not match</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isPasswordValid || !doPasswordsMatch}
          className="w-full rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        Already have an account?{' '}
        <Link className="font-semibold text-brand-100 hover:text-white" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
