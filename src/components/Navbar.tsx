import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  Home,
  Book,
  Calendar,
  Users,
  CreditCard,
  MessageSquare,
  ChevronDown,
  BookOpen,
  UserCheck,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

const Navbar: React.FC = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleLogoClick = () => {
    if (user) {
      if (isAdmin()) {
        navigate('/dashboard');
      } else {
        navigate('/member-dashboard');
      }
    } else {
      navigate('/');
    }
  };

  const memberMenuItems = [
    { name: 'Início', href: '/member-dashboard', icon: Home },
    { name: 'Biblioteca', href: '/library', icon: Book },
    { name: 'Calendário', href: '/calendar', icon: Calendar },
    { name: 'Cursos', href: '/courses', icon: Users },
    { name: 'Ofertar', href: '/finance', icon: CreditCard },
    { name: 'Contato', href: '/contact', icon: MessageSquare },
    { name: 'Consulta Pastoral', href: '/pastoral-appointment', icon: MessageSquare },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  const adminMenuItems = [
    { name: 'Início', href: '/dashboard', icon: Home },
    { name: 'Biblioteca', href: '/library', icon: Book },
    { name: 'Calendário', href: '/calendar', icon: Calendar },
    { name: 'Cursos', href: '/courses', icon: Users },
    { name: 'Ofertar', href: '/finance', icon: CreditCard },
    { name: 'Contato', href: '/contact', icon: MessageSquare },
    { name: 'Consulta Pastoral', href: '/pastoral-appointment', icon: MessageSquare },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  const adminOnlyItems = [
    { name: 'Membros', href: '/members', icon: UserCheck },
    { name: 'Eventos', href: '/events', icon: Calendar },
    { name: 'Empréstimos', href: '/loans', icon: BookOpen },
    { name: 'Gestão Pastoral', href: '/pastoral-management', icon: MessageSquare },
  ];

  const menuItems = isAdmin() ? adminMenuItems : memberMenuItems;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-14 items-center px-4 lg:px-6">
        <div className="mr-4 flex">
          <button 
            onClick={handleLogoClick}
            className="mr-6 flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-6 w-6 bg-primary rounded" />
            <span className="hidden font-bold sm:inline-block">Igreja</span>
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-1 transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Admin Menu */}
            {isAdmin() && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-auto p-0 text-foreground/60 hover:text-foreground/80">
                    <span className="flex items-center space-x-1">
                      <BarChart3 className="h-4 w-4" />
                      <span>Administração</span>
                      <ChevronDown className="h-3 w-3" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Área Administrativa</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {adminOnlyItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link to={item.href} className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <div className="px-4">
                  <button 
                    onClick={handleLogoClick}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity mb-6"
                  >
                    <div className="h-6 w-6 bg-primary rounded" />
                    <span className="font-bold">Igreja</span>
                  </button>
                  
                  <div className="space-y-3">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}

                    {/* Admin Menu Mobile */}
                    {isAdmin() && (
                      <>
                        <div className="border-t pt-3 mt-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">ADMINISTRAÇÃO</p>
                          {adminOnlyItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center space-x-3 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                              >
                                <Icon className="h-4 w-4" />
                                <span>{item.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.name || user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Entrar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
