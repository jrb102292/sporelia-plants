'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

interface Route {
  path: string;
  filter?: string;
}

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Mock data for now - will be replaced with actual data
  const plantTypes = ['Succulents', 'Houseplants', 'Herbs', 'Vegetables'];
  const staticCategories = ['Pests', 'Fertilizer', 'Soil'];

  const handleNavigate = (path: string) => {
    // Next.js handles navigation automatically with Link components
    setIsSidebarOpen(false);
  };

  const getCurrentRoute = (): Route => {
    if (pathname.startsWith('/plants/') && pathname !== '/plants') {
      const category = pathname.split('/')[2];
      return { path: 'plants', filter: category };
    }
    if (pathname.startsWith('/plants')) {
      return { path: 'plants', filter: 'All' };
    }
    if (pathname === '/' || pathname === '') {
      return { path: 'home' };
    }
    if (pathname === '/pests') {
      return { path: 'pests' };
    }
    if (pathname === '/fertilizer') {
      return { path: 'fertilizer' };
    }
    if (pathname === '/soil') {
      return { path: 'soil' };
    }
    return { path: 'not-found' };
  };

  const currentRoute = getCurrentRoute();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 via-green-50 to-teal-50">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        plantTypes={plantTypes}
        staticCategories={staticCategories}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {children}
      </main>
    </div>
  );
}
