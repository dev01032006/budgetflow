import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try { const res = await api.post('/auth/forgot-password', { email }); setMessage(res.data.message); }
    catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F8FAFC]'>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
          <div className='mb-8'>
            <div className='w-12 h-12 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mb-4'>
              <span className='text-[#2563EB] text-xl font-bold'>P</span>
            </div>
            <h2 className='text-2xl font-bold text-gray-900'>Forgot Password</h2>
            <p className='text-gray-500 text-sm mt-1'>Enter your email and we will send a reset token</p>
          </div>
          {message ? (
            <div className='bg-green-50 border border-green-100 text-green-700 text-sm p-4 rounded-xl'>
              {message}
              <p className='mt-2 text-green-600 font-medium'>Check your server terminal for the reset token, then use it on the reset page.</p>
              <Link to='/reset-password' className='block mt-3 text-[#2563EB] font-semibold hover:underline'>Go to Reset Password ?</Link>
            </div>
          ) : (
            <>
              {error && <div className='bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl mb-4'>{error}</div>}
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email</label>
                  <input type='email' value={email} onChange={e => setEmail(e.target.value)} required placeholder='you@example.com' className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent' />
                </div>
                <button type='submit' disabled={loading} className='w-full bg-[#2563EB] text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all'>
                  {loading ? 'Sending...' : 'Send Reset Token'}
                </button>
              </form>
            </>
          )}
          <p className='text-sm text-center mt-6'><Link to='/login' className='text-gray-500 hover:text-gray-900'>? Back to login</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
