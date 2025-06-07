
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Menu, 
  X,
  User,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const memberMenuItems = [
    { to: "/library", label: "Biblioteca" },
    { to: "/courses", label: "Cursos" },
    { to: "/calendar", label: "Agenda" },
    { to: "/finance", label: "Ofertar" },
    { to: "/pastoral-appointment", label: "Fale com o Pastor" },
  ];

  const adminMenuItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/members", label: "Membros" },
    { to: "/events", label: "Eventos" },
    { to: "/pastoral-management", label: "Gerenc. Pastoral" },
  ];

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
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

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {memberMenuItems.map((item) => (
            <Link 
              key={item.to}
              to={item.to} 
              className="text-sm font-medium hover:text-church-blue transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          {isAdmin() && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Administração
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {adminMenuItems.map((item) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Perfil</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/settings">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile Menu Button */}
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
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background">
          <nav className="flex flex-col space-y-3">
            {memberMenuItems.map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {isAdmin() && (
              <>
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                    Administração
                  </p>
                  {adminMenuItems.map((item) => (
                    <Link 
                      key={item.to}
                      to={item.to} 
                      className="text-sm font-medium p-2 hover:bg-muted rounded-md block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
            
            <div className="border-t pt-3 mt-3">
              <Link 
                to="/settings" 
                className="text-sm font-medium p-2 hover:bg-muted rounded-md block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Configurações
              </Link>
              <button 
                onClick={handleSignOut}
                className="text-sm font-medium p-2 hover:bg-muted rounded-md text-left w-full"
              >
                Sair
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
