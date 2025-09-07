import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Plus, 
  Clock, 
  MapPin,
  Users,
  Bell
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location?: string;
  attendees?: string[];
  color: string;
}

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: new Date(2024, 0, 15, 10, 0),
    time: '10:00 AM',
    location: 'Conference Room A',
    attendees: ['John', 'Jane', 'Mike'],
    color: 'bg-primary',
  },
  {
    id: '2',
    title: 'Project Review',
    date: new Date(2024, 0, 16, 14, 0),
    time: '2:00 PM',
    location: 'Virtual',
    color: 'bg-accent',
  },
  {
    id: '3',
    title: 'Client Call',
    date: new Date(2024, 0, 18, 9, 0),
    time: '9:00 AM',
    color: 'bg-secondary',
  },
];

export const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [events] = useState<Event[]>(sampleEvents);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex h-full bg-surface/20">
      {/* Sidebar */}
      <div className="w-64 glass-strong border-r border-glass-border p-4">
        {/* Mini Calendar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-muted-foreground p-1">
                {day}
              </div>
            ))}
            {days.slice(0, 35).map((day, index) => (
              <div
                key={index}
                className={`text-center p-1 rounded cursor-pointer hover:bg-white/10 ${
                  isToday(day) ? 'bg-primary text-primary-foreground' : ''
                } ${
                  !isCurrentMonth(day) ? 'text-muted-foreground/50' : 'text-foreground'
                }`}
              >
                {day.getDate()}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 mb-6">
          <Button className="w-full gradient-primary hover:glow-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>

        {/* Calendars */}
        <div>
          <h3 className="font-medium text-foreground mb-3">My Calendars</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded" defaultChecked />
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-sm text-foreground">Work</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded" defaultChecked />
              <div className="w-3 h-3 bg-accent rounded"></div>
              <span className="text-sm text-foreground">Personal</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded" defaultChecked />
              <div className="w-3 h-3 bg-secondary rounded"></div>
              <span className="text-sm text-foreground">Meetings</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-glass-border glass-strong">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
              <Button variant="ghost" size="sm">
                Today
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex rounded-lg glass border border-glass-border overflow-hidden">
                <Button
                  variant={viewMode === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode('month')}
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode('week')}
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode('day')}
                >
                  Day
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'month' && (
            <div className="h-full">
              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-glass-border">
                {daysOfWeek.map(day => (
                  <div key={day} className="p-4 text-center font-medium text-muted-foreground border-r border-glass-border last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 grid-rows-6 h-full">
                {days.map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  return (
                    <div
                      key={index}
                      className={`border-r border-b border-glass-border last:border-r-0 p-2 hover:bg-white/5 transition-smooth min-h-24 ${
                        !isCurrentMonth(day) ? 'bg-muted/10' : ''
                      } ${
                        isToday(day) ? 'bg-primary/10' : ''
                      }`}
                    >
                      <div className={`text-sm mb-1 ${
                        isToday(day) ? 'font-bold text-primary' : 
                        !isCurrentMonth(day) ? 'text-muted-foreground/50' : 'text-foreground'
                      }`}>
                        {day.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate ${event.color} text-white`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Sidebar */}
      <div className="w-80 glass-strong border-l border-glass-border p-4">
        <h3 className="font-medium text-foreground mb-4">Upcoming Events</h3>
        
        <div className="space-y-3">
          {events.slice(0, 5).map(event => (
            <div key={event.id} className="glass rounded-lg p-3 hover:bg-white/5 transition-smooth">
              <div className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full ${event.color} mt-1.5`}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm">
                    {event.title}
                  </h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {event.time}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {event.location}
                    </div>
                  )}
                  {event.attendees && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Users className="w-3 h-3 mr-1" />
                      {event.attendees.length} attendees
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};