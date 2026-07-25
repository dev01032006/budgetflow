import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { login as loginApi } from '../../api/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await loginApi({ email, password });
      login(res.data.user, res.data.tokens.accessToken);
      navigate('/');
    } catch (err: any) { setError(err.response?.data?.message ?? 'Login failed'); }
    finally { setLoading(false); }
  }

  return (
    <div className='min-h-screen flex'>
      <div className='hidden lg:flex w-1/2 bg-[#0F172A] flex-col items-center justify-center p-12'>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className='text-center'>
          <div className='w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-6'>
            <span className='text-white font-bold text-3xl'>P</span>
          </div>
          <h1 className='text-4xl font-bold text-white mb-4'>PennyPilot</h1>
          <p className='text-white/60 text-lg max-w-sm'>Your smart financial companion for tracking, budgeting, and growing your wealth.</p>
          <div className='mt-12 grid grid-cols-2 gap-4 text-left'>
            {['Track expenses', 'Set budgets', 'Manage categories'].map(f => (
              <div key={f} className='bg-white/10 rounded-xl p-4'>
                <div className='w-2 h-2 bg-[#2563EB] rounded-full mb-2' />
                <p className='text-white text-sm font-medium'>{f}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className='flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]'>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className='w-full max-w-md'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900'>Welcome back</h2>
              <p className='text-gray-500 text-sm mt-1'>Sign in to your PennyPilot account</p>
            </div>
            {error && <div className='bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl mb-4'>{error}</div>}
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email</label>
                <input type='email' value={email} onChange={e => setEmail(e.target.value)} required placeholder='you@example.com' className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all' />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Password</label>
                <div className='relative'>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder='��������' className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all pr-12' />
                  <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className='flex justify-end'>
                <Link to='/forgot-password' className='text-sm text-[#2563EB] hover:underline'>Forgot password?</Link>
              </div>
              <button type='submit' disabled={loading} className='w-full bg-[#2563EB] text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all'>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <p className='text-sm text-center mt-6 text-gray-500'>Don't have an account? <Link to='/register' className='text-[#2563EB] font-semibold hover:underline'>Register</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
