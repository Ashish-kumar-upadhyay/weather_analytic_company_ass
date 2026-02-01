import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HiCloud, HiEnvelope, HiArrowLeft } from 'react-icons/hi2';
import { forgotPassword } from '../store/slices/authSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(forgotPassword(email));
    setLoading(false);
    if (forgotPassword.fulfilled.match(result)) {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-surface-950 to-surface-950" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <HiCloud className="w-10 h-10 text-primary-400 mx-auto mb-3" />
          <h1 className="font-display font-bold text-2xl mb-2">Reset Password</h1>
          <p className="text-surface-400 text-sm">Enter your email to receive a reset link</p>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiEnvelope className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="font-semibold text-lg mb-2">Check your email</h2>
              <p className="text-surface-400 text-sm mb-6">We've sent a password reset link to <strong className="text-white">{email}</strong></p>
              <Link to="/login" className="btn-secondary inline-flex items-center gap-2">
                <HiArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <HiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field pl-10" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <Link to="/login" className="block text-center text-sm text-surface-400 hover:text-surface-300">
                ← Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
