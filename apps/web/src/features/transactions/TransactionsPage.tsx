import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Pencil, X } from 'lucide-react';
import Layout from '../../components/ui/Layout';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../../api/transactions';
import { getCategories } from '../../api/categories';
import type { Transaction, Category } from '../../types/index';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]!);
  const [categoryId, setCategoryId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      const [t, c] = await Promise.all([getTransactions(), getCategories()]);
      setTransactions(t); setCategories(c);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filteredCategories = categories.filter(c => c.type === type);
  const filtered = transactions.filter(t => {
    const matchType = filterType === 'ALL' || t.type === filterType;
    const matchSearch = !search || t.description?.toLowerCase().includes(search.toLowerCase()) || t.category.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  function resetForm() { setAmount(''); setDescription(''); setCategoryId(''); setDate(new Date().toISOString().split('T')[0]!); setType('EXPENSE'); setEditingId(null); setShowForm(false); setError(''); }

  function startEdit(t: Transaction) { setEditingId(t.id); setAmount(String(t.amount)); setType(t.type); setDescription(t.description ?? ''); setDate(t.date); setCategoryId(t.category.id); setShowForm(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      if (editingId) { await updateTransaction(editingId, { amount: parseFloat(amount), description, date, categoryId }); }
      else { await createTransaction({ amount: parseFloat(amount), type, description, date, categoryId }); }
      resetForm(); load();
    } catch (err: any) { setError(err.response?.data?.message ?? 'Failed to save'); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id: string) { if (!confirm('Delete this transaction?')) return; await deleteTransaction(id); load(); }

  if (loading) return <Layout><div className='flex items-center justify-center h-64'><div className='w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin' /></div></Layout>;

  return (
    <Layout>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Transactions</h1>
        <p className='text-gray-500 text-sm mt-1'>Manage all your income and expenses</p>
      </div>

      <div className='flex items-center gap-3 mb-6'>
        <div className='relative flex-1 max-w-sm'>
          <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search transactions...' className='w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white' />
        </div>
        <div className='flex gap-1 bg-gray-100 rounded-xl p-1'>
          {(['ALL','INCOME','EXPENSE'] as const).map(f => (
            <button key={f} onClick={() => setFilterType(f)} className={'px-4 py-1.5 rounded-lg text-sm font-medium transition-all ' + (filterType === f ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700')}>
              {f === 'ALL' ? 'All' : f === 'INCOME' ? 'Income' : 'Expense'}
            </button>
          ))}
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className='flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all'>
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-900'>{editingId ? 'Edit Transaction' : 'New Transaction'}</h3>
              <button onClick={resetForm} className='text-gray-400 hover:text-gray-600'><X size={18} /></button>
            </div>
            {error && <div className='bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4'>{error}</div>}
            <form onSubmit={handleSubmit} className='grid grid-cols-3 gap-4'>
              {!editingId && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1.5'>Type</label>
                  <select value={type} onChange={e => { setType(e.target.value as 'INCOME' | 'EXPENSE'); setCategoryId(''); }} className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]'>
                    <option value='EXPENSE'>Expense</option>
                    <option value='INCOME'>Income</option>
                  </select>
                </div>
              )}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Amount</label>
                <input type='number' value={amount} onChange={e => setAmount(e.target.value)} required min='0.01' step='0.01' placeholder='0.00' className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]' />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Category</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]'>
                  <option value=''>Select category</option>
                  {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Date</label>
                <input type='date' value={date} onChange={e => setDate(e.target.value)} required className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]' />
              </div>
              <div className='col-span-3'>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Description (optional)</label>
                <input type='text' value={description} onChange={e => setDescription(e.target.value)} placeholder='What was this for?' className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]' />
              </div>
              <div className='col-span-3 flex gap-2'>
                <button type='submit' disabled={submitting} className='bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-blue-700 transition-all'>
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Save Transaction'}
                </button>
                <button type='button' onClick={resetForm} className='border border-gray-200 px-6 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-all'>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        {filtered.length === 0 ? (
          <div className='p-12 text-center'><p className='text-gray-400'>No transactions found.</p></div>
        ) : (
          <div className='divide-y divide-gray-50'>
            {filtered.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className='flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group'>
                <div className='flex items-center gap-4'>
                  <div className={'w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold ' + (t.type === 'INCOME' ? 'bg-[#10B981]' : 'bg-[#EF4444]')}>
                    {t.category.name[0]}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>{t.description ?? t.category.name}</p>
                    <p className='text-xs text-gray-400'>{t.category.name} � {t.date}</p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <span className={'font-semibold ' + (t.type === 'INCOME' ? 'text-[#10B981]' : 'text-[#EF4444]')}>
                    {t.type === 'INCOME' ? '+' : '-'}${t.amount.toFixed(2)}
                  </span>
                  <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button onClick={() => startEdit(t)} className='p-1.5 text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-all'><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(t.id)} className='p-1.5 text-gray-400 hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-all'><Trash2 size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
