import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MomentDetail from './pages/MomentDetail';
import Dashboard from './pages/Dashboard';
import HostDashboard from './pages/HostDashboard';
import AdminDashboard from './pages/AdminDashboard';

type Page = 'home' | 'explore' | 'moment' | 'dashboard' | 'host-dashboard' | 'admin-dashboard' | 'settings';

interface NavigationParams {
  momentId?: string;
  mood?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [navParams, setNavParams] = useState<NavigationParams>({});

  const handleNavigate = (page: string, params?: NavigationParams) => {
    setCurrentPage(page as Page);
    setNavParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'explore':
        return <Explore onNavigate={handleNavigate} initialMood={navParams.mood} />;
      case 'moment':
        return navParams.momentId ? (
          <MomentDetail momentId={navParams.momentId} onNavigate={handleNavigate} />
        ) : (
          <Home onNavigate={handleNavigate} />
        );
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'host-dashboard':
        return <HostDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'settings':
        return <Dashboard onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
          <main>{renderPage()}</main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
