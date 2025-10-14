
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Calendar, CreditCard, Users } from 'lucide-react';
import BirthdayCard from '@/components/dashboard/BirthdayCard';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';

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
  const { profile, loading, isAdmin } = useAuth();
  const { stats, upcomingEvents, loading: statsLoading } = useDashboardStats();

  // Wait for loading to complete
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not admin
  if (profile && !isAdmin()) {
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
          value={statsLoading ? "..." : stats.totalMembers.toString()}
          description="Total de membros cadastrados"
          icon={<Users className="h-4 w-4" />}
          colorClass="bg-church-blue"
        />
        <StatCard
          title="Total de Livros"
          value={statsLoading ? "..." : stats.totalBooks.toString()}
          description="Livros disponíveis na biblioteca"
          icon={<Book className="h-4 w-4" />}
          colorClass="bg-church-red"
        />
        <StatCard
          title="Empréstimos Ativos"
          value={statsLoading ? "..." : stats.activeLoans.toString()}
          description="Livros emprestados atualmente"
          icon={<Book className="h-4 w-4" />}
          colorClass="bg-green-600"
        />
        <StatCard
          title="Visitantes EBD"
          value={statsLoading ? "..." : (stats.sundaySchoolStats?.visitorsThisMonth || 0).toString()}
          description="Visitantes este mês"
          icon={<Users className="h-4 w-4" />}
          colorClass="bg-purple-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximos Eventos
            </CardTitle>
            <CardDescription>
              Eventos agendados para os próximos 7 dias.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statsLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-church-blue"></div>
              </div>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <UpcomingEvent
                  key={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  type={event.type}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhum evento encontrado para os próximos dias.
              </p>
            )}
          </CardContent>
        </Card>

        <BirthdayCard />
        <RecentActivityList />
      </div>
    </div>
  );
};

export default Dashboard;
