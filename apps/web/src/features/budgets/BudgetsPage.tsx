import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Trash2 } from 'lucide-react';
import Layout from '../../components/ui/Layout';
import { getBudgets, createBudget, deleteBudget } from '../../api/budgets';
import { getCategories } from '../../api/categories';
import type { Budget, Category } from '../../types/index';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');

  async function load() {
    try { const [b, c] = await Promise.all([getBudgets(month, year), getCategories()]); setBudgets(b); setCategories(c.filter((c: Category) => c.type === 'EXPENSE')); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [month, year]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await createBudget({ amount: parseFloat(amount), month, year, categoryId: categoryId || undefined }); setAmount(''); setCategoryId(''); setShowForm(false); load(); }
    catch (err: any) { setError(err.response?.data?.message ?? 'Failed to create budget'); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id: string) { if (!confirm('Delete this budget?')) return; await deleteBudget(id); load(); }

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  if (loading) return <Layout><div className='flex items-center justify-center h-64'><div className='w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin' /></div></Layout>;

  return (
    <Layout>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Budgets</h1>
          <p className='text-gray-500 text-sm mt-1'>Set and track your monthly spending limits</p>
        </div>
        <div className='flex items-center gap-3'>
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className='border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white'>
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m,i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className='border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white'>
            {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={() => setShowForm(!showForm)} className='flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all'>
            <Plus size={16} /> Add Budget
          </button>
        </div>
      </div>

      {budgets.length > 0 && (
        <div className='grid grid-cols-3 gap-4 mb-6'>
          <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100'>
            <p className='text-sm text-gray-500'>Total Budget</p>
            <p className='text-2xl font-bold text-gray-900 mt-1'>${totalBudget.toFixed(2)}</p>
          </div>
          <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100'>
            <p className='text-sm text-gray-500'>Total Spent</p>
            <p className='text-2xl font-bold text-[#EF4444] mt-1'>${totalSpent.toFixed(2)}</p>
          </div>
          <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100'>
            <p className='text-sm text-gray-500'>Total Remaining</p>
            <p className={'text-2xl font-bold mt-1 ' + (totalSpent > totalBudget ? 'text-[#EF4444]' : 'text-[#10B981]')}>${(totalBudget - totalSpent).toFixed(2)}</p>
          </div>
        </div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-semibold text-gray-900'>New Budget</h3>
            <button onClick={() => setShowForm(false)}><X size={18} className='text-gray-400 hover:text-gray-600' /></button>
          </div>
          {error && <div className='bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4'>{error}</div>}
          <form onSubmit={handleSubmit} className='flex gap-4'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Amount ($)</label>
              <input type='number' value={amount} onChange={e => setAmount(e.target.value)} required min='1' step='0.01' placeholder='0.00' className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]' />
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Category (optional)</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]'>
                <option value=''>Overall budget</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className='flex items-end'>
              <button type='submit' disabled={submitting} className='bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-blue-700 transition-all'>
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {budgets.length === 0 ? (
        <div className='bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100'>
          <p className='text-gray-400'>No budgets set for this month. Add one to get started.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {budgets.map((b, i) => {
            const pct = Math.min((b.spent / b.amount) * 100, 100);
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-3'>
                  <div>
                    <p className='font-semibold text-gray-900'>{b.category ? b.category.name : 'Overall Budget'}</p>
                    <p className='text-sm text-gray-400'>${b.spent.toFixed(2)} spent of ${b.amount.toFixed(2)}</p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className={'font-bold text-lg ' + (b.isOverspent ? 'text-[#EF4444]' : 'text-[#10B981]')}>
                        {b.isOverspent ? '-$' + Math.abs(b.remaining).toFixed(2) : '$' + b.remaining.toFixed(2)}
                      </p>
                      <p className='text-xs text-gray-400'>{b.isOverspent ? 'over budget' : 'remaining'}</p>
                    </div>
                    <button onClick={() => handleDelete(b.id)} className='p-2 text-gray-300 hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-all'><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className='w-full bg-gray-100 rounded-full h-2'>
                  <motion.div initial={{ width: 0 }} animate={{ width: pct + '%' }} transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={'h-2 rounded-full ' + (b.isOverspent ? 'bg-[#EF4444]' : pct > 80 ? 'bg-[#F59E0B]' : 'bg-[#10B981]')} />
                </div>
                <p className='text-xs text-gray-400 mt-2'>{pct.toFixed(0)}% used</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
