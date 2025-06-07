
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Calendar, CreditCard, MessageSquare, Settings, Users } from 'lucide-react';
import BirthdayCard from '@/components/dashboard/BirthdayCard';
import { useAuth } from '@/contexts/AuthContext';

const MenuCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass?: string;
}> = ({ title, description, icon, onClick, colorClass = "bg-church-blue" }) => (
  <Card className="card-hover cursor-pointer transition-all hover:shadow-lg" onClick={onClick}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="flex-1">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </div>
      <div className={`${colorClass} text-white p-3 rounded-full`}>
        {icon}
      </div>
    </CardHeader>
  </Card>
);

const UpcomingEvent: React.FC<{
  title: string;
  date: string;
  time: string;
  type: string;
}> = ({ title, date, time, type }) => (
  <div className="flex items-center gap-4 rounded-lg border p-3">
    <div className="flex-1">
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground">{date} às {time}</p>
    </div>
    <div className="text-xs font-medium">
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold 
        ${type === 'Culto' ? 'bg-church-blue-light/10 text-church-blue-light' : 
          type === 'Curso' ? 'bg-church-red-light/10 text-church-red-light' : 
          'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    </div>
  </div>
);

const MemberDashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Biblioteca",
      description: "Explore nosso acervo de livros",
      icon: <Book className="h-5 w-5" />,
      path: "/library",
      colorClass: "bg-church-blue"
    },
    {
      title: "Calendário",
      description: "Veja eventos e programações",
      icon: <Calendar className="h-5 w-5" />,
      path: "/calendar",
      colorClass: "bg-church-red"
    },
    {
      title: "Cursos",
      description: "Participe dos nossos cursos",
      icon: <Users className="h-5 w-5" />,
      path: "/courses",
      colorClass: "bg-green-600"
    },
    {
      title: "Ofertar",
      description: "Contribua com a igreja",
      icon: <CreditCard className="h-5 w-5" />,
      path: "/finance",
      colorClass: "bg-amber-500"
    },
    {
      title: "Contato",
      description: "Entre em contato conosco",
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/contact",
      colorClass: "bg-purple-600"
    },
    {
      title: "Consulta Pastoral",
      description: "Agende uma conversa",
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/pastoral-appointment",
      colorClass: "bg-indigo-600"
    },
    {
      title: "Configurações",
      description: "Gerencie sua conta",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings",
      colorClass: "bg-gray-600"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mensagem de boas-vindas */}
      <div className="bg-gradient-to-r from-church-blue to-church-blue-light text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          Olá <strong>{profile?.name || 'Membro'}</strong>, seja bem-vindo!
        </h1>
        <p className="text-lg opacity-90">Deus te abençoe!</p>
      </div>

      {/* Cards de menu */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <MenuCard
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onClick={() => navigate(item.path)}
              colorClass={item.colorClass}
            />
          ))}
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="grid gap-4 md:grid-cols-2">
        <BirthdayCard />
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-church-blue" />
              Próximos Eventos
            </CardTitle>
            <CardDescription>
              Eventos agendados para os próximos dias.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <UpcomingEvent
              title="Culto de Adoração"
              date="Domingo, 12 de Maio"
              time="10:00"
              type="Culto"
            />
            <UpcomingEvent
              title="Curso de Liderança"
              date="Terça, 14 de Maio"
              time="19:30"
              type="Curso"
            />
            <UpcomingEvent
              title="Reunião de Oração"
              date="Quarta, 15 de Maio"
              time="19:00"
              type="Reunião"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
