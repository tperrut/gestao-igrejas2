
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
