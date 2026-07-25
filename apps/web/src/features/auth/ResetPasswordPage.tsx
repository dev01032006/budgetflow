import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../api/client';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try { await api.post('/auth/reset-password', { token, password }); navigate('/login'); }
    catch (err: any) { setError(err.response?.data?.message ?? 'Reset failed'); }
    finally { setLoading(false); }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F8FAFC]'>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>Reset Password</h2>
            <p className='text-gray-500 text-sm mt-1'>Enter the token from your server terminal and your new password</p>
          </div>
          {error && <div className='bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl mb-4'>{error}</div>}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Reset Token</label>
              <input type='text' value={token} onChange={e => setToken(e.target.value)} required placeholder='Paste your reset token here' className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>New Password</label>
              <div className='relative'>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder='Min. 8 characters' className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] pr-12' />
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type='submit' disabled={loading} className='w-full bg-[#2563EB] text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all'>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          <p className='text-sm text-center mt-6'><Link to='/login' className='text-gray-500 hover:text-gray-900'>? Back to login</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
