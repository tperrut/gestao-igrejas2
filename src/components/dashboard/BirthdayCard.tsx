
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cake } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BirthdayMember {
  id: string;
  name: string;
  birth_date: string;
}

const BirthdayCard: React.FC = () => {
  const [birthdays, setBirthdays] = useState<BirthdayMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBirthdays() {
      try {
        const currentMonth = new Date().getMonth() + 1; // Janeiro é 0
        
        const { data, error } = await supabase
          .from('members')
          .select('id, name, birth_date')
          .not('birth_date', 'is', null)
          .filter('birth_date', 'ilike', `%-${currentMonth.toString().padStart(2, '0')}-%`)
          .order('birth_date');

        if (error) throw error;
        
        setBirthdays(data || []);
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
      // Analisar a data
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      // Formatar apenas o dia e mês
      return format(date, 'dd/MM', { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dateString;
    }
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
            <div key={member.id} className="flex justify-between items-center border-b pb-2 last:border-0">
              <span className="font-medium">{member.name}</span>
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
