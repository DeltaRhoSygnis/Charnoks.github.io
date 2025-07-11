import React, { useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useTheme, ThemeProvider } from './hooks/useTheme';
import { AuthProvider, useAuth } from './hooks/useAuth';

import ResponsiveLayout from './components/layout/ResponsiveLayout';
import { WorkerLayout } from './components/layout/WorkerLayout';
import WorkerDashboard from './pages/Workerdashboard';

import Ownersdashboard from './components/ui/Ownersdashboard';
import AnalysisPage from './pages/AnalysisPage';
import AIAssistantPage from './pages/AIAssistantPage';
import StockManagementPage from './pages/StockManagementPage';
import ProductsPage from './pages/ProductsPage';
import ExpensesPage from './pages/ExpensesPage';
import TransactionsPage from './pages/TransactionsPage';
import NotesPage from './pages/NotesPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import Spinner from './components/ui/Spinner';
import SalesPage from './pages/SalesPage';

// This component ensures a user is authenticated before rendering the child routes.
const AuthLayout: React.FC = () => {
    const { user, loading } = useAuth();
    const location = ReactRouterDOM.useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-background">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return <ReactRouterDOM.Navigate to="/login" state={{ from: location }} replace />;
    }

    return <ReactRouterDOM.Outlet />; // Renders nested routes (e.g., owner or worker routes with their layouts)
};


const RoleRedirect: React.FC = () => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen bg-background">
            <Spinner size="lg" />
          </div>
        );
    }

    if (user?.role === 'owner') {
        return <ReactRouterDOM.Navigate to="/owner/dashboard" replace />;
    }
    if (user?.role === 'worker') {
        return <ReactRouterDOM.Navigate to="/worker/dashboard" replace />;
    }
    // Fallback to login if role is not defined or user is null
    return <ReactRouterDOM.Navigate to="/login" replace />;
}


const AppContent: React.FC = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const body = document.body;
    body.className = body.className.replace(/theme-\S+/g, '');
    
    // The login page now uses the same theme as the rest of the app for consistency.
    body.classList.add(theme, 'animate-gradient-x');

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      // Allow time for CSS variables to be applied before reading them
      setTimeout(() => {
        const themeColor = getComputedStyle(body).getPropertyValue('--background-start-rgb');
        metaThemeColor.setAttribute('content', `rgb(${themeColor})`);
      }, 0);
    }
  }, [theme]);

  return (
      <ReactRouterDOM.Routes>
        <ReactRouterDOM.Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes are nested under AuthLayout */}
        <ReactRouterDOM.Route element={<AuthLayout />}>
            {/* Owner Routes are nested under their own layout */}
            <ReactRouterDOM.Route path="/owner" element={<ResponsiveLayout><ReactRouterDOM.Outlet /></ResponsiveLayout>}>
                <ReactRouterDOM.Route path="dashboard" element={<Ownersdashboard />} />
                <ReactRouterDOM.Route path="analysis" element={<AnalysisPage />} />
                <ReactRouterDOM.Route path="ai-assistant" element={<AIAssistantPage />} />
                <ReactRouterDOM.Route path="sales" element={<StockManagementPage />} />
                <ReactRouterDOM.Route path="products" element={<ProductsPage />} />
                <ReactRouterDOM.Route path="expenses" element={<ExpensesPage />} />
                <ReactRouterDOM.Route path="transactions" element={<TransactionsPage />} />
                <ReactRouterDOM.Route path="notes" element={<NotesPage />} />
                <ReactRouterDOM.Route path="settings" element={<SettingsPage />} />
                <ReactRouterDOM.Route index element={<ReactRouterDOM.Navigate to="/owner/dashboard" replace />} />
            </ReactRouterDOM.Route>

            {/* Worker Routes are nested under their own layout */}
            <ReactRouterDOM.Route path="/worker" element={<WorkerLayout><ReactRouterDOM.Outlet /></WorkerLayout>}>
                <ReactRouterDOM.Route path="dashboard" element={<WorkerDashboard />} />
                <ReactRouterDOM.Route path="sales" element={<SalesPage />} />
                <ReactRouterDOM.Route path="expenses" element={<ExpensesPage />} />
                <ReactRouterDOM.Route path="settings" element={<SettingsPage />} />
                <ReactRouterDOM.Route index element={<ReactRouterDOM.Navigate to="/worker/dashboard" replace />} />
            </ReactRouterDOM.Route>
        </ReactRouterDOM.Route>

        <ReactRouterDOM.Route path="/" element={<RoleRedirect />} />
      </ReactRouterDOM.Routes>
  );
}

const App: React.FC = () => {
  return (
    <ReactRouterDOM.HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ReactRouterDOM.HashRouter>
  );
};

export default App;