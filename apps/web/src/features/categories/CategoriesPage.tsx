import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Trash2 } from 'lucide-react';
import Layout from '../../components/ui/Layout';
import { getCategories } from '../../api/categories';
import api from '../../api/client';
import type { Category } from '../../types/index';

const INCOME_COLORS = ['#10B981','#34D399','#6EE7B7'];
const EXPENSE_COLORS = ['#EF4444','#F87171','#FCA5A5'];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() { try { const c = await getCategories(); setCategories(c); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await api.post('/categories', { name, type }); setName(''); setShowForm(false); load(); }
    catch (err: any) { setError(err.response?.data?.message ?? 'Failed to create category'); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    try { await api.delete('/categories/' + id); load(); }
    catch (err: any) { alert(err.response?.data?.message ?? 'Cannot delete'); }
  }

  const income = categories.filter(c => c.type === 'INCOME');
  const expense = categories.filter(c => c.type === 'EXPENSE');

  if (loading) return <Layout><div className='flex items-center justify-center h-64'><div className='w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin' /></div></Layout>;

  return (
    <Layout>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Categories</h1>
          <p className='text-gray-500 text-sm mt-1'>Organize your income and expenses</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className='flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all'>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-semibold text-gray-900'>New Category</h3>
            <button onClick={() => setShowForm(false)}><X size={18} className='text-gray-400' /></button>
          </div>
          {error && <div className='bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4'>{error}</div>}
          <form onSubmit={handleSubmit} className='flex gap-4'>
            <input type='text' placeholder='Category name' value={name} onChange={e => setName(e.target.value)} required className='flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]' />
            <select value={type} onChange={e => setType(e.target.value as 'INCOME' | 'EXPENSE')} className='border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]'>
              <option value='EXPENSE'>Expense</option>
              <option value='INCOME'>Income</option>
            </select>
            <button type='submit' disabled={submitting} className='bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-blue-700 transition-all'>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </form>
        </motion.div>
      )}

      <div className='grid grid-cols-2 gap-6'>
        <div>
          <h3 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
            <span className='w-3 h-3 rounded-full bg-[#10B981] inline-block' /> Income Categories
          </h3>
          <div className='space-y-2'>
            {income.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className='bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-100 group'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold' style={{ background: INCOME_COLORS[i % INCOME_COLORS.length] }}>
                    {c.name[0]}
                  </div>
                  <span className='text-sm font-medium text-gray-900'>{c.name}</span>
                </div>
                <div className='flex items-center gap-2'>
                  {c.isDefault ? <span className='text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full'>default</span> : (
                    <button onClick={() => handleDelete(c.id)} className='opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-all'><Trash2 size={14} /></button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
            <span className='w-3 h-3 rounded-full bg-[#EF4444] inline-block' /> Expense Categories
          </h3>
          <div className='space-y-2'>
            {expense.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className='bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-100 group'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold' style={{ background: EXPENSE_COLORS[i % EXPENSE_COLORS.length] }}>
                    {c.name[0]}
                  </div>
                  <span className='text-sm font-medium text-gray-900'>{c.name}</span>
                </div>
                <div className='flex items-center gap-2'>
                  {c.isDefault ? <span className='text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full'>default</span> : (
                    <button onClick={() => handleDelete(c.id)} className='opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-all'><Trash2 size={14} /></button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
