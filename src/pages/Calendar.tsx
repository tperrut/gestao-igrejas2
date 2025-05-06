
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon, Grid, LayoutList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventCalendar from '@/components/calendar/EventCalendar';
import EventsCompactList from '@/components/calendar/EventsCompactList';

const CalendarPage: React.FC = () => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');

  return (
    <>
      <Helmet>
        <title>Agenda | ChurchConnect</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agenda da Igreja</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie todos os eventos da igreja.
            </p>
          </div>
          <Button className="sm:self-end">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agendar Evento
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="calendar" className="w-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <TabsList>
                      <TabsTrigger value="calendar" className="flex items-center gap-2">
                        <Grid className="h-4 w-4" />
                        <span className="hidden sm:inline">Calendário</span>
                      </TabsTrigger>
                      <TabsTrigger value="list" className="flex items-center gap-2">
                        <LayoutList className="h-4 w-4" />
                        <span className="hidden sm:inline">Lista</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex items-center">
                      <Button variant="outline" size="sm" className="mr-2">Hoje</Button>
                      <div className="border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`rounded-r-none ${view === 'day' ? 'bg-muted' : ''}`}
                          onClick={() => setView('day')}
                        >
                          Dia
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`rounded-none border-x ${view === 'week' ? 'bg-muted' : ''}`}
                          onClick={() => setView('week')}
                        >
                          Semana
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`rounded-l-none ${view === 'month' ? 'bg-muted' : ''}`}
                          onClick={() => setView('month')}
                        >
                          Mês
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <TabsContent value="calendar" className="mt-0">
                    <EventCalendar view={view} />
                  </TabsContent>
                  
                  <TabsContent value="list" className="mt-0">
                    <EventsCompactList />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-1/3">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Próximos Eventos
                    </h3>
                    <Button variant="ghost" size="sm">Ver todos</Button>
                  </div>
                  
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-start gap-3 border-b pb-3 last:border-0">
                        <div className="bg-primary/10 text-primary rounded-md p-2 text-center min-w-[60px]">
                          <div className="text-xs font-medium">MAI</div>
                          <div className="text-xl font-bold">{i + 10}</div>
                        </div>
                        <div>
                          <h4 className="font-medium">Evento {i}</h4>
                          <p className="text-sm text-muted-foreground">10:00 - 12:00</p>
                          <p className="text-sm text-muted-foreground">Auditório Principal</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
