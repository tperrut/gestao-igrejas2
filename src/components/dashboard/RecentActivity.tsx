
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Book, Loan, Member, Event, Course } from '@/types/libraryTypes';

interface Activity {
  id: string;
  type: 'member' | 'book' | 'loan' | 'event' | 'course';
  title: string;
  description: string;
  timestamp: string;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  async function fetchRecentActivities() {
    setIsLoading(true);
    try {
      // Buscar membros recentes
      const { data: members } = await supabase
        .from('members')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Buscar livros recentes
      const { data: books } = await supabase
        .from('books')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Buscar empréstimos recentes
      const { data: loans } = await supabase
        .from('loans')
        .select('id, status, created_at, book_id, book:books(title), member_id, member:members(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      // Buscar eventos recentes
      const { data: events } = await supabase
        .from('events')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Buscar cursos recentes
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Mapear membros para atividades
      const memberActivities: Activity[] = (members || []).map((member: Member) => ({
        id: `member-${member.id}`,
        type: 'member',
        title: 'Novo membro cadastrado',
        description: `${member.name}`,
        timestamp: member.created_at
      }));

      // Mapear livros para atividades
      const bookActivities: Activity[] = (books || []).map((book: Book) => ({
        id: `book-${book.id}`,
        type: 'book',
        title: 'Novo livro adicionado',
        description: `${book.title}`,
        timestamp: book.created_at
      }));

      // Mapear empréstimos para atividades
      const loanActivities: Activity[] = (loans || []).map((loan: unknown) => {
        const l = loan as { id?: string; status?: string; created_at?: string; book?: { title?: string }; member?: { name?: string } };
        return {
          id: `loan-${l.id}`,
          type: 'loan' as const,
          title: l.status === 'active' ? 'Livro emprestado' : l.status === 'returned' ? 'Livro devolvido' : 'Reserva de livro',
          description: l.book?.title ? `${l.book.title} - ${l.member?.name || 'Membro desconhecido'}` : 'Livro desconhecido',
          timestamp: l.created_at || ''
        } as Activity;
      });

      // Mapear eventos para atividades
      const eventActivities: Activity[] = (events || []).map((event: Event) => ({
        id: `event-${event.id}`,
        type: 'event',
        title: 'Novo evento criado',
        description: `${event.title}`,
        timestamp: event.created_at
      }));

      // Mapear cursos para atividades
      const courseActivities: Activity[] = (courses || []).map((course: Course) => ({
        id: `course-${course.id}`,
        type: 'course',
        title: 'Novo curso adicionado',
        description: `${course.title}`,
        timestamp: course.created_at
      }));

      // Combinar todas as atividades e ordenar por timestamp
      const allActivities = [
        ...memberActivities,
        ...bookActivities,
        ...loanActivities,
        ...eventActivities,
        ...courseActivities
      ].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 10);

      setActivities(allActivities);

    } catch (error: unknown) {
      console.error("Erro ao buscar atividades recentes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const formatTimestamp = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return `Hoje às ${format(date, 'HH:mm')}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        return `Ontem às ${format(date, 'HH:mm')}`;
      } else {
        return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
      }
    } catch (error: unknown) {
      return isoString;
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>
          Últimas atividades registradas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Carregando atividades...</div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}: {activity.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Nenhuma atividade recente encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
