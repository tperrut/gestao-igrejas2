
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Calendar, CreditCard, Users } from 'lucide-react';
import BirthdayCard from '@/components/dashboard/BirthdayCard';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import { useAuth } from '@/contexts/AuthContext';

const StatCard: React.FC<{
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  colorClass?: string;
}> = ({ title, value, description, icon, colorClass = "bg-church-blue" }) => (
  <Card className="card-hover">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`${colorClass} text-white p-2 rounded-full`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const UpcomingEvent: React.FC<{
  title: string;
  date: string;
  time: string;
  type: string;
}> = ({ title, date, time, type }) => (
  <div className="flex items-center gap-4 rounded-lg border p-4">
    <div className="flex-1">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{date} às {time}</p>
    </div>
    <div className="text-sm font-medium">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
        ${type === 'Culto' ? 'bg-church-blue-light/10 text-church-blue-light' : 
          type === 'Curso' ? 'bg-church-red-light/10 text-church-red-light' : 
          'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { profile, loading } = useAuth();

  // Wait for loading to complete
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not admin
  if (profile && profile.role !== 'admin') {
    return <Navigate to="/member-dashboard" replace />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome message for admin */}
      <div className="bg-gradient-to-r from-church-blue to-church-blue-light text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          Olá <strong>{profile?.name || 'Administrador'}</strong>, seja bem-vindo!
        </h1>
        <p className="text-lg opacity-90">Deus te abençoe!</p>
        <p className="text-sm opacity-75 mt-1">Painel de Controle da Igreja</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Membros Ativos"
          value="356"
          description="↗︎ 12% em relação ao mês anterior"
          icon={<Users className="h-4 w-4" />}
          colorClass="bg-church-blue"
        />
        <StatCard
          title="Empréstimos Biblioteca"
          value="28"
          description="↗︎ 4% em relação ao mês anterior"
          icon={<Book className="h-4 w-4" />}
          colorClass="bg-church-red"
        />
        <StatCard
          title="Eventos este Mês"
          value="12"
          description="↘︎ 2% em relação ao mês anterior"
          icon={<Calendar className="h-4 w-4" />}
          colorClass="bg-green-600"
        />
        <StatCard
          title="Dízimos e Ofertas"
          value="R$ 12.540"
          description="↗︎ 8% em relação ao mês anterior"
          icon={<CreditCard className="h-4 w-4" />}
          colorClass="bg-amber-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>
              Eventos agendados para os próximos 7 dias.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <UpcomingEvent
              title="Ensaio do Coral"
              date="Quinta, 16 de Maio"
              time="20:00"
              type="Ensaio"
            />
          </CardContent>
        </Card>

        <div className="grid grid-rows-2 gap-4">
          <BirthdayCard />
          <RecentActivityList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
