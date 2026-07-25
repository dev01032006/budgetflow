import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, ArrowLeftRight, PiggyBank, Tag, BarChart2, LogOut } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/budgets', label: 'Budgets', icon: PiggyBank },
  { path: '/categories', label: 'Categories', icon: Tag },
  
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  function handleLogout() { logout(); navigate('/login'); }

  return (
    <div className='min-h-screen flex bg-[#F8FAFC]'>
      <aside className='w-56 bg-[#0F172A] flex flex-col fixed h-full'>
        <div className='p-6 border-b border-white/10'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>P</span>
            </div>
            <span className='text-white font-bold text-lg'>PennyPilot</span>
          </div>
          <p className='text-white/40 text-xs mt-2 truncate'>{user?.email}</p>
        </div>
        <nav className='flex-1 p-3'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all ' + (active ? 'bg-[#2563EB] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white')}>
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className='p-3 border-t border-white/10'>
          <div className='flex items-center gap-3 px-3 py-2 mb-1'>
            <div className='w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center'>
              <span className='text-white text-sm font-semibold'>{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-white text-sm font-medium truncate'>{user?.name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className='flex items-center gap-3 px-3 py-2 w-full text-white/60 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all'>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
      <main className='flex-1 ml-56 p-8 min-h-screen'>
        {children}
      </main>
    </div>
  );
}
