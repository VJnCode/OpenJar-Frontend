import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyUser } from '../services/userService';
import Button from '../components/Button';
import InputField from '../components/InputField';

export default function VerifyPage() {
  const [form, setForm]       = useState({ email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await verifyUser(form);
      setSuccess('Account verified! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      setError('Invalid email or OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-white px-6 py-20">
      <div className="w-full max-w-sm animate-fade-up">
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">Almost there</p>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Verify your email</h1>
        <p className="text-gray-400 text-sm mb-10">Enter the OTP code we sent to your inbox.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <InputField label="Email" type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <InputField label="OTP Code" placeholder="6-digit code"
            value={form.otp} onChange={e => setForm(f => ({ ...f, otp: e.target.value }))} required />

          {error   && <p className="text-sm text-red-500 border-l-2 border-red-300 pl-3">{error}</p>}
          {success && <p className="text-sm text-green-600 border-l-2 border-green-300 pl-3">{success}</p>}

          <Button type="submit" loading={loading} className="w-full justify-center py-3">
            Verify Account
          </Button>
        </form>
      </div>
    </div>
  );
}
