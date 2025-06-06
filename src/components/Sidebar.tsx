import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Users, 
  DollarSign,
  MessageCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  const menuItems = [
    { 
      to: "/dashboard", 
      label: "Dashboard", 
      icon: Home,
      adminOnly: true
    },
    { 
      to: "/library", 
      label: "Biblioteca", 
      icon: BookOpen,
      adminOnly: false
    },
    { 
      to: "/courses", 
      label: "Cursos", 
      icon: GraduationCap,
      adminOnly: false
    },
    { 
      to: "/calendar", 
      label: "Agenda", 
      icon: Calendar,
      adminOnly: false
    },
    { 
      to: "/members", 
      label: "Membros", 
      icon: Users,
      adminOnly: true
    },
    { 
      to: "/finance", 
      label: "Financeiro", 
      icon: DollarSign,
      adminOnly: false // Liberado para todos os membros
    },
    { 
      to: "/events", 
      label: "Eventos", 
      icon: Calendar,
      adminOnly: true
    },
    { 
      to: "/pastoral-appointment", 
      label: "Fale com o Pastor", 
      icon: MessageCircle,
      adminOnly: false
    },
    { 
      to: "/pastoral-management", 
      label: "Gerenc. Pastoral", 
      icon: Users,
      adminOnly: true
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && !isAdmin()) {
      return false;
    }
    return true;
  });

  const handleItemClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-10 bg-black/80 md:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={onClose}
      />
      <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <nav className="p-4 space-y-2 h-full overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={handleItemClick}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
