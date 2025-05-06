
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventCalendarProps {
  view: 'day' | 'week' | 'month';
}

// Mocked events data
const mockEvents = [
  {
    id: 1,
    title: 'Culto de Domingo',
    date: new Date(2023, 4, 14, 10, 0),
    endDate: new Date(2023, 4, 14, 12, 0),
    location: 'Auditório Principal',
    type: 'culto'
  },
  {
    id: 2,
    title: 'Reunião de Líderes',
    date: new Date(2023, 4, 16, 19, 0),
    endDate: new Date(2023, 4, 16, 21, 0),
    location: 'Sala 103',
    type: 'reuniao'
  },
  {
    id: 3,
    title: 'Conferência de Louvor',
    date: new Date(2023, 4, 20, 15, 0),
    endDate: new Date(2023, 4, 20, 21, 0),
    location: 'Auditório Principal',
    type: 'conferencia'
  }
];

const getEventsByDate = (date: Date) => {
  return mockEvents.filter(event => 
    event.date.getDate() === date.getDate() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getFullYear() === date.getFullYear()
  );
};

const DayView = ({ date }: { date: Date }) => {
  const events = getEventsByDate(date);
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8am to 9pm

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{format(date, 'EEEE, dd MMM yyyy', { locale: ptBR })}</h3>
      <div className="border rounded-md">
        {hours.map(hour => {
          const hourEvents = events.filter(event => event.date.getHours() === hour);
          return (
            <div key={hour} className="flex border-b last:border-0">
              <div className="w-16 p-2 border-r text-sm text-muted-foreground">
                {hour}:00
              </div>
              <div className="flex-1 min-h-[60px] p-2">
                {hourEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="bg-primary/10 text-primary rounded-md p-2 text-sm mb-1"
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WeekView = ({ date }: { date: Date }) => {
  // Get the start of the week (Sunday)
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  
  // Create an array of 7 days starting from the start of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8am to 9pm

  return (
    <div className="p-4 overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="flex border-b">
          <div className="w-16"></div>
          {weekDays.map((day, idx) => (
            <div key={idx} className="flex-1 text-center p-2 font-medium">
              <div>{format(day, 'EEE', { locale: ptBR })}</div>
              <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                day.getDate() === new Date().getDate() ? 'bg-primary text-white' : ''
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        {hours.map(hour => (
          <div key={hour} className="flex border-b last:border-0">
            <div className="w-16 p-2 border-r text-sm text-muted-foreground">
              {hour}:00
            </div>
            {weekDays.map((day, idx) => {
              const dayEvents = mockEvents.filter(event => 
                event.date.getDate() === day.getDate() &&
                event.date.getMonth() === day.getMonth() &&
                event.date.getFullYear() === day.getFullYear() &&
                event.date.getHours() === hour
              );
              
              return (
                <div key={idx} className="flex-1 min-h-[60px] p-1 border-r last:border-0">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id} 
                      className="bg-primary/10 text-primary rounded-md p-1 text-xs mb-1"
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const MonthView = ({ date }: { date: Date }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);

  // Simple implementation to highlight dates with events
  const daysWithEvents = mockEvents.map(event => ({
    date: new Date(event.date),
    title: event.title
  }));

  return (
    <div className="p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border mx-auto"
        locale={ptBR}
        modifiers={{
          event: daysWithEvents.map(e => e.date)
        }}
        modifiersStyles={{
          event: {
            fontWeight: 'bold',
            border: '2px solid var(--primary)'
          }
        }}
        footer={
          selectedDate && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium mb-2">Eventos em {format(selectedDate, 'dd/MM/yyyy')}</h4>
              <div className="space-y-2">
                {getEventsByDate(selectedDate).length > 0 ? (
                  getEventsByDate(selectedDate).map(event => (
                    <div key={event.id} className="p-2 rounded-md bg-muted text-sm">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground">{format(event.date, 'HH:mm')} - {format(event.endDate, 'HH:mm')}</div>
                      <div className="text-muted-foreground">{event.location}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum evento para este dia.</p>
                )}
              </div>
            </div>
          )
        }
      />
    </div>
  );
};

const EventCalendar: React.FC<EventCalendarProps> = ({ view }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  return (
    <div>
      {view === 'day' && <DayView date={currentDate} />}
      {view === 'week' && <WeekView date={currentDate} />}
      {view === 'month' && <MonthView date={currentDate} />}
    </div>
  );
};

export default EventCalendar;
