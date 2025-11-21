import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../store/auth';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {showSidebar && user && <Sidebar />}
        <main className={`flex-1 ${showSidebar && user ? 'ml-64' : ''} transition-all duration-200`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
