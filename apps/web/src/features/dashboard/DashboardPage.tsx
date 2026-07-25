import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../../api/client';
import type { DashboardData } from '../../types/index';
import Layout from '../../components/ui/Layout';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const cards = (data: DashboardData) => [
  { label: 'Current Balance', value: data.currentBalance, icon: Wallet, color: '#2563EB', bg: '#EFF6FF', positive: data.currentBalance >= 0 },
  { label: 'Monthly Income', value: data.monthlyIncome, icon: TrendingUp, color: '#10B981', bg: '#ECFDF5', positive: true },
  { label: 'Monthly Expenses', value: data.monthlyExpenses, icon: TrendingDown, color: '#EF4444', bg: '#FEF2F2', positive: false },
  { label: 'Budget Remaining', value: data.budgetRemaining ?? 0, icon: Target, color: data.isOverBudget ? '#EF4444' : '#10B981', bg: data.isOverBudget ? '#FEF2F2' : '#ECFDF5', positive: !data.isOverBudget },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(res => { setData(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className='flex items-center justify-center h-64'><div className='w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin' /></div></Layout>;
  if (!data) return <Layout><p className='text-red-500'>Failed to load dashboard.</p></Layout>;

  const categoryMap: Record<string, number> = {};
  data.recentTransactions.filter(t => t.type === 'EXPENSE').forEach(t => { categoryMap[t.category.name] = (categoryMap[t.category.name] ?? 0) + t.amount; });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  const COLORS = ['#2563EB','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899'];
  const barData = [{ name: 'This Month', Income: data.monthlyIncome, Expenses: data.monthlyExpenses }];

  return (
    <Layout>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
        <p className='text-gray-500 text-sm mt-1'>Welcome back! Here is your financial overview.</p>
      </div>

      <div className='grid grid-cols-4 gap-4 mb-8'>
        {cards(data).map((card, i) => {
          const Icon = card.icon;
          const Arrow = card.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{ background: card.bg }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                <span className='flex items-center gap-1 text-xs font-medium' style={{ color: card.color }}>
                  <Arrow size={14} />
                </span>
              </div>
              <p className='text-2xl font-bold text-gray-900'>${card.value.toFixed(2)}</p>
              <p className='text-sm text-gray-500 mt-1'>{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className='grid grid-cols-2 gap-6 mb-8'>
        <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
          <h3 className='font-semibold text-gray-900 mb-4'>Expenses by Category</h3>
          {pieData.length === 0 ? <p className='text-gray-400 text-sm'>No expenses yet.</p> : (
            <ResponsiveContainer width='100%' height={220}>
              <PieChart>
                <Pie data={pieData} cx='50%' cy='50%' outerRadius={85} dataKey='value' label={({ name, percent }) => name + ' ' + (percent * 100).toFixed(0) + '%'} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => '$' + v.toFixed(2)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
          <h3 className='font-semibold text-gray-900 mb-4'>Income vs Expenses</h3>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis dataKey='name' tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => '$' + v.toFixed(2)} />
              <Legend />
              <Bar dataKey='Income' fill='#10B981' radius={[4,4,0,0]} />
              <Bar dataKey='Expenses' fill='#EF4444' radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
        <div className='p-6 border-b border-gray-100'>
          <h3 className='font-semibold text-gray-900'>Recent Transactions</h3>
        </div>
        {data.recentTransactions.length === 0 ? (
          <p className='text-gray-400 text-sm p-6'>No transactions yet.</p>
        ) : (
          <div className='divide-y divide-gray-50'>
            {data.recentTransactions.map((t) => (
              <div key={t.id} className='flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors'>
                <div className='flex items-center gap-4'>
                  <div className={'w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold ' + (t.type === 'INCOME' ? 'bg-[#10B981]' : 'bg-[#EF4444]')}>
                    {t.category.name[0]}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>{t.description ?? t.category.name}</p>
                    <p className='text-xs text-gray-400'>{t.category.name} � {t.date}</p>
                  </div>
                </div>
                <span className={'font-semibold ' + (t.type === 'INCOME' ? 'text-[#10B981]' : 'text-[#EF4444]')}>
                 {t.type === 'INCOME' ? '+' : '-'}{t.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
