
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Book, Users, CreditCard, GraduationCap } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ActivityType = 'member' | 'book' | 'event' | 'course' | 'finance';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  created_at: string;
}

const RecentActivityList: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Buscar membros mais recentes
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('id, name, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        // Buscar cursos mais recentes
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        // Buscar eventos mais recentes
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        if (membersError || coursesError || eventsError) {
          console.error('Erro ao buscar atividades recentes', { membersError, coursesError, eventsError });
          return;
        }

        const memberActivities = membersData?.map(member => ({
          id: `member-${member.id}`,
          type: 'member' as ActivityType,
          title: 'Novo membro cadastrado',
          description: member.name,
          created_at: member.created_at
        })) || [];

        const courseActivities = coursesData?.map(course => ({
          id: `course-${course.id}`,
          type: 'course' as ActivityType,
          title: 'Novo curso criado',
          description: course.title,
          created_at: course.created_at
        })) || [];

        const eventActivities = eventsData?.map(event => ({
          id: `event-${event.id}`,
          type: 'event' as ActivityType,
          title: 'Novo evento agendado',
          description: event.title,
          created_at: event.created_at
        })) || [];

        // Combine e ordene todas as atividades
        const allActivities = [...memberActivities, ...courseActivities, ...eventActivities]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 7); // Limitar a 7 atividades

        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'member':
        return <Users className="h-4 w-4" />;
      case 'book':
        return <Book className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'course':
        return <GraduationCap className="h-4 w-4" />;
      case 'finance':
        return <CreditCard className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'member':
        return 'bg-church-blue-light/10 text-church-blue-light';
      case 'book':
        return 'bg-green-100 text-green-600';
      case 'event':
        return 'bg-purple-100 text-purple-600';
      case 'course':
        return 'bg-church-red-light/10 text-church-red-light';
      case 'finance':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
    } catch (e) {
      return 'recentemente';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    <div className="h-3 w-40 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="h-3 w-16 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {formatTimeAgo(activity.created_at)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Nenhuma atividade recente encontrada.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityList;
