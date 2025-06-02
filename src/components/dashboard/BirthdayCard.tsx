
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cake } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BirthdayMember {
  id: string;
  name: string;
  birth_date: string;
  avatar_url?: string;
}

const BirthdayCard: React.FC = () => {
  const [birthdays, setBirthdays] = useState<BirthdayMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBirthdays() {
      try {
        const currentMonth = new Date().getMonth() + 1;
        
        const { data, error } = await supabase
          .from('members')
          .select('id, name, birth_date, avatar_url')
          .not('birth_date', 'is', null)
          .order('birth_date');

        if (error) throw error;
        
        // Filtrar aniversariantes do mês atual no lado do cliente
        const currentMonthBirthdays = (data || []).filter(member => {
          if (!member.birth_date) return false;
          try {
            const birthDate = new Date(member.birth_date);
            return birthDate.getMonth() + 1 === currentMonth;
          } catch (error) {
            return false;
          }
        });
        
        setBirthdays(currentMonthBirthdays);
      } catch (error) {
        console.error("Erro ao buscar aniversariantes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBirthdays();
  }, []);

  const formatBirthDate = (dateString: string) => {
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      return format(date, 'dd/MM', { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dateString;
    }
  };

  const getInitials = (name: string): string => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cake className="mr-2 h-5 w-5 text-church-red" />
          Aniversariantes do Mês
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : birthdays.length > 0 ? (
          birthdays.map((member) => (
            <div key={member.id} className="flex items-center justify-between border-b pb-2 last:border-0">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {member.avatar_url ? (
                    <AvatarImage src={member.avatar_url} alt={member.name} />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="font-medium">{member.name}</span>
              </div>
              <span className="text-sm bg-church-red/10 text-church-red px-2 py-1 rounded-full">
                {formatBirthDate(member.birth_date)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Nenhum aniversariante este mês
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BirthdayCard;
