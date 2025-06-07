
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Menu, 
  X,
  User
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://images.seeklogo.com/logo-png/27/1/imw-igreja-metodista-wesleyana-logo-png_seeklogo-275760.png?v=1962823770704272104" 
              alt="Igreja Metodista Wesleyana Logo" 
              className="h-10 w-auto" 
            />
            <span className="hidden font-montserrat font-bold text-xl text-church-blue sm:inline-block">
              Igreja Metodista Wesleyana
            </span>
            <span className="font-montserrat font-bold text-xl text-church-blue sm:hidden">
              IMW
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-5">
          <Link to="/dashboard" className="text-sm font-medium hover:text-church-blue transition-colors">
            Dashboard
          </Link>
          <Link to="/library" className="text-sm font-medium hover:text-church-blue transition-colors">
            Biblioteca
          </Link>
          <Link to="/courses" className="text-sm font-medium hover:text-church-blue transition-colors">
            Cursos
          </Link>
          <Link to="/calendar" className="text-sm font-medium hover:text-church-blue transition-colors">
            Agenda
          </Link>
          <Link to="/members" className="text-sm font-medium hover:text-church-blue transition-colors">
            Membros
          </Link>
          <Link to="/finance" className="text-sm font-medium hover:text-church-blue transition-colors">
            Ofertar
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-church-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
            <span className="sr-only">Notificações</span>
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <User className="h-5 w-5" />
              <span className="sr-only">Perfil</span>
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background">
          <nav className="flex flex-col space-y-3">
            <Link to="/dashboard" className="text-sm font-medium p-2 hover:bg-muted rounded-md">
              Dashboard
            </Link>
            <Link to="/library" className="text-sm font-medium p-2 hover:bg-muted rounded-md">
              Biblioteca
            </Link>
            <Link to="/courses" className="text-sm font-medium p-2 hover:bg-muted rounded-md">
              Cursos
            </Link>
            <Link to="/calendar" className="text-sm font-medium p-2 hover:bg-muted rounded-md">
              Agenda
            </Link>
            <Link to="/members" className="text-sm font-medium p-2 hover:bg-muted rounded-md">
              Membros
            </Link>
            <Link to="/finance" className="text-sm font-medium p-2 hover:bg-muted rounded-md">
              Ofertar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
