import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthProvider';
import { useAuth } from './hooks/useAuth';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import DashboardPage from './features/dashboard/DashboardPage';
import TransactionsPage from './features/transactions/TransactionsPage';
import BudgetsPage from './features/budgets/BudgetsPage';
import CategoriesPage from './features/categories/CategoriesPage';


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to='/login' />;
}
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to='/' />;
}
function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path='/register' element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path='/forgot-password' element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path='/reset-password' element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path='/' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path='/transactions' element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      <Route path='/budgets' element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />
      <Route path='/categories' element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
     
    </Routes>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
