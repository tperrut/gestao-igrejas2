
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Book, 
  Calendar, 
  ChartBar, 
  CircleDollarSign, 
  Home, 
  Settings, 
  Users,
  Mail,
  MessageSquare,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    title: 'Biblioteca',
    icon: Book,
    path: '/library',
  },
  {
    title: 'Agenda',
    icon: Calendar,
    path: '/calendar',
  },
  {
    title: 'Membros',
    icon: Users,
    path: '/members',
  },
  {
    title: 'Financeiro',
    icon: CircleDollarSign,
    path: '/finance',
  },
  {
    title: 'Cursos',
    icon: GraduationCap,
    path: '/courses',
  },
  {
    title: 'Relatórios',
    icon: ChartBar,
    path: '/reports',
  },
  {
    title: 'Fale com o Pastor',
    icon: MessageSquare,
    path: '/pastoral-appointment',
  },
  {
    title: 'Contato',
    icon: Mail,
    path: '/contact',
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: 'Configurações',
    icon: Settings,
    path: '/settings',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "bg-sidebar pb-12 transition-all duration-300 ease-in-out fixed left-0 top-0 z-20 h-full w-[250px] flex-col border-r border-sidebar-border md:left-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-[80px]"
      )}
    >
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className={cn(
            "font-montserrat font-bold text-xl text-sidebar-foreground transition-all", 
            !isOpen && "md:hidden"
          )}>
            ChurchConnect
          </span>
          <span className={cn(
            "font-montserrat font-bold text-xl text-sidebar-foreground hidden",
            !isOpen && "md:inline-block"
          )}>
            CC
          </span>
        </Link>
      </div>
      <div className="flex flex-col h-[calc(100%-64px)] justify-between">
        <div className="px-3 py-4">
          <div className="mb-4">
            <h2 className={cn(
              "px-4 text-xs font-semibold text-sidebar-foreground/60 mb-2",
              !isOpen && "md:text-center md:px-0"
            )}>
              {isOpen || !window.matchMedia('(min-width: 768px)').matches ? "Menu Principal" : ""}
            </h2>
            <nav className="grid gap-1">
              {mainNavItems.map((item) => (
                <React.Fragment key={item.path}>
                  {isOpen || !window.matchMedia('(min-width: 768px)').matches ? (
                    <NavLink item={item} />
                  ) : (
                    <Link
                      to={item.path}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                        location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                      title={item.title}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-xs mt-1">{item.title.substring(0, 3)}</span>
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
        <div className="px-3 py-4 mt-auto">
          <div className="mb-4">
            <h2 className={cn(
              "px-4 text-xs font-semibold text-sidebar-foreground/60 mb-2",
              !isOpen && "md:text-center md:px-0"
            )}>
              {isOpen || !window.matchMedia('(min-width: 768px)').matches ? "Configurações" : ""}
            </h2>
            <nav className="grid gap-1">
              {bottomNavItems.map((item) => (
                <React.Fragment key={item.path}>
                  {isOpen || !window.matchMedia('(min-width: 768px)').matches ? (
                    <NavLink item={item} />
                  ) : (
                    <Link
                      to={item.path}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                        location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                      title={item.title}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-xs mt-1">{item.title.substring(0, 3)}</span>
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
