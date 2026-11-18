import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/userService';
import Button from '../components/Button';
import InputField from '../components/InputField';
import AuthShowcase from '../components/AuthShowcase';
import GoogleButton from '../components/GoogleButton';
import usePageTitle from '../hooks/usePageTitle';
import Logo from '../components/Logo';

const USERNAME_RE = /^[\p{L}\p{N} ._-]{3,50}$/u;

function validate({ userName, userEmail, password }) {
  const errors = {};
  if (!USERNAME_RE.test(userName.trim())) errors.userName = '3–50 letters, numbers, spaces, dots, dashes or underscores.';
  if (!/^\S+@\S+\.\S+$/.test(userEmail.trim())) errors.userEmail = 'Enter a valid email address.';
  if (password.length < 8) errors.password = 'At least 8 characters.';
  else if (password.length > 72) errors.password = 'At most 72 characters.';
  return errors;
}

export default function RegisterPage() {
  usePageTitle('Create account');
  const [form, setForm]       = useState({ userName: '', userEmail: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(er => ({ ...er, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true); setError('');
    try {
      const email = form.userEmail.trim();
      await registerUser({ ...form, userName: form.userName.trim(), userEmail: email });
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-canvas min-h-[calc(100vh-68px)]">
      <AuthShowcase />

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm animate-fade-up">
          <Link to="/" className="flex justify-center lg:hidden mb-8" aria-label="OpenJar home">
            <Logo variant="full" size={150} />
          </Link>

          <p className="text-xs font-semibold text-muted tracking-widest uppercase mb-1">Get started</p>
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Create account</h1>
          <p className="text-muted text-sm mb-8">Join the community and start sharing what you cook.</p>

          <GoogleButton label="Sign up with Google" />
          <div className="flex items-center gap-3 my-6 text-xs text-muted">
            <div className="flex-1 h-px bg-line" /> or sign up with email <div className="flex-1 h-px bg-line" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
            <InputField label="Username" name="userName" placeholder="chef_mario" autoComplete="username"
              value={form.userName} onChange={set('userName')} error={errors.userName} maxLength={50} required />
            <InputField label="Email" name="userEmail" type="email" placeholder="you@example.com" autoComplete="email"
              value={form.userEmail} onChange={set('userEmail')} error={errors.userEmail} maxLength={254} required />
            <InputField label="Password" name="password" type="password" placeholder="Min. 8 characters"
              autoComplete="new-password" value={form.password} onChange={set('password')}
              error={errors.password} maxLength={72} required />

            {error && <p role="alert" className="text-sm text-danger border-l-2 border-danger/40 pl-3">{error}</p>}

            <Button type="submit" loading={loading} className="w-full justify-center py-3 mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-sm text-muted text-center mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-brand font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
