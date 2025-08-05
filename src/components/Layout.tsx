import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SecurityMonitor from '@/components/security/SecurityMonitor';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <SecurityMonitor />
    </div>
  );
};

export default Layout;
