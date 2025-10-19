
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CallToAction from '@/components/home/CallToAction';
import Footer from '@/components/home/Footer';

const Home: React.FC = () => {
  const { user, isAdmin, isMember } = useAuth();
  
  let dashboardPath = "/dashboard";
  if (isMember && isMember()) dashboardPath = "/member-dashboard";
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-church-red to-amber-400 text-transparent bg-clip-text font-bold">
                  Ir para Sua Igreja
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/pricing">
                <Button variant="ghost" aria-label="Ver preços e planos disponíveis">
                  Preços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
