import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resendOtp, verifyUser } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import InputField from '../components/InputField';
import usePageTitle from '../hooks/usePageTitle';

export default function VerifyPage() {
  usePageTitle('Verify your email');
  const [params] = useSearchParams();
  const { login } = useAuth();
  const [form, setForm]         = useState({ email: params.get('email') || '', otp: '' });
  const [loading, setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError]       = useState('');
  const [info, setInfo]         = useState(params.get('email') ? 'We sent a 6-digit code to your inbox. It expires in 10 minutes.' : '');
  const [verified, setVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(form.otp)) { setError('Enter the 6-digit code from your email.'); return; }
    setLoading(true); setError(''); setInfo('');
    try {
      await verifyUser({ email: form.email.trim(), otp: form.otp });
      setVerified(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!form.email.trim()) { setError('Enter your email first.'); return; }
    setResending(true); setError(''); setInfo('');
    try {
      const res = await resendOtp(form.email.trim());
      setInfo(res?.message || 'If that account is awaiting verification, a new code is on its way.');
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <div className="flex-1 flex items-center justify-center bg-canvas px-6 py-20">
        <div className="w-full max-w-sm text-center animate-fade-up">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="font-display text-3xl font-bold text-ink mb-2">You're verified!</h1>
          <p className="text-muted text-sm mb-8">Your account is ready. Sign in to start sharing recipes.</p>
          <Button onClick={login} className="w-full justify-center py-3">Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-canvas px-6 py-20">
      <div className="w-full max-w-sm animate-fade-up">
        <p className="text-xs font-semibold text-muted tracking-widest uppercase mb-1">Almost there</p>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Verify your email</h1>
        <p className="text-muted text-sm mb-10">Enter the code we sent to your inbox.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
          <InputField label="Email" type="email" placeholder="you@example.com" autoComplete="email"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <InputField label="Verification code" placeholder="6-digit code" inputMode="numeric"
            autoComplete="one-time-code" maxLength={6}
            value={form.otp} onChange={e => setForm(f => ({ ...f, otp: e.target.value.replace(/\D/g, '') }))} required />

          {error && <p role="alert" className="text-sm text-danger border-l-2 border-danger/40 pl-3">{error}</p>}
          {info  && <p className="text-sm text-success border-l-2 border-success/40 pl-3">{info}</p>}

          <Button type="submit" loading={loading} className="w-full justify-center py-3">
            Verify Account
          </Button>
        </form>

        <p className="text-sm text-muted text-center mt-8">
          Didn't get it?{' '}
          <button type="button" onClick={handleResend} disabled={resending}
            className="text-brand font-semibold hover:underline disabled:opacity-50">
            {resending ? 'Sending…' : 'Send a new code'}
          </button>
        </p>
      </div>
    </div>
  );
}
