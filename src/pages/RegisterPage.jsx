import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/userService';
import Button from '../components/Button';
import InputField from '../components/InputField';

export default function RegisterPage() {
  const [form, setForm]       = useState({ userName: '', userEmail: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await registerUser(form);
      navigate('/verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-white">
      {/* Left — decorative */}
      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden bg-gray-50">
        <img
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=85"
          alt=""
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <p className="font-display text-3xl font-bold text-gray-900 leading-snug">
            "Cooking is an art.<br />Share yours."
          </p>
          <p className="text-gray-500 text-sm mt-2">— OpenJar Community</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm animate-fade-up">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-7 h-7 rounded-lg bg-[#C8472B] flex items-center justify-center">
              <span className="text-white font-bold text-xs">OJ</span>
            </div>
            <span className="font-display font-bold text-gray-900">OpenJar</span>
          </Link>

          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">Get started</p>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-10">Create account</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <InputField label="Username" name="userName" placeholder="chef_mario"
              value={form.userName} onChange={e => setForm(f => ({ ...f, userName: e.target.value }))} required />
            <InputField label="Email" name="userEmail" type="email" placeholder="you@example.com"
              value={form.userEmail} onChange={e => setForm(f => ({ ...f, userEmail: e.target.value }))} required />
            <InputField label="Password" name="password" type="password" placeholder="Min. 8 characters"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />

            {error && <p className="text-sm text-red-500 border-l-2 border-red-300 pl-3">{error}</p>}

            <Button type="submit" loading={loading} className="w-full justify-center py-3 mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-sm text-gray-400 text-center mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C8472B] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
