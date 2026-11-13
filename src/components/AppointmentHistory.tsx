/* Appointment History Dashboard Card */
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, Video, Stethoscope, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { consultationApi } from '@/lib/api';
import { Link } from 'react-router-dom';

type FilterType = 'upcoming' | 'past';

interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  isVC: boolean;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  type: 'upcoming' | 'past';
}

const AppointmentHistory: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await consultationApi.getMyRequests();
        if (response.data) {
          const mapped = response.data.map((apt: any) => {
            let doctorName = 'Dr. Sarah Jenkins';
            let date = 'Today';
            let time = '10:30 AM';
            const isVC = (apt.notes && apt.notes.includes('VC')) || (apt.symptoms && apt.symptoms.includes('[VC'));

            if (apt.notes) {
              const docMatch = apt.notes.match(/Doctor:\s*([^|,\n]+)/);
              if (docMatch) doctorName = docMatch[1].trim();

              const slotMatch = apt.notes.match(/Slot:\s*([^|,\n]+)/);
              if (slotMatch) {
                const parts = slotMatch[1].trim().split(' ');
                if (parts[0]) date = parts[0];
                if (parts.length > 1) time = parts.slice(1).join(' ');
              }
            } else if (apt.created_at) {
              date = new Date(apt.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }

            return {
              id: apt.id,
              doctorName,
              specialty: isVC ? 'VC Tele-Physician' : 'Specialist Consultation',
              date,
              time,
              isVC: !!isVC,
              status: apt.status || 'confirmed',
              type: apt.status === 'completed' || apt.status === 'cancelled' ? 'past' : 'upcoming'
            };
          });
          setAppointments(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((apt) => apt.type === filter);

  return (
    <Card className="p-6 bg-card border border-border/50 rounded-3xl shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-soft">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">My Appointments</h3>
            <p className="text-xs text-muted-foreground">In-clinic & telehealth sessions</p>
          </div>
        </div>

        <Button asChild variant="ghost" size="sm" className="text-xs rounded-xl h-8 text-primary">
          <Link to="/appointments">
            Book <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </div>

      {/* Filter Toggle */}
      <div className="flex gap-2 mb-4 p-1 bg-muted rounded-xl">
        <button
          onClick={() => setFilter('upcoming')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-300 ${
            filter === 'upcoming'
              ? 'bg-card text-foreground shadow-soft'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-300 ${
            filter === 'past'
              ? 'bg-card text-foreground shadow-soft'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Completed / Past
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-muted-foreground">No {filter} appointments found.</p>
            <Button asChild size="sm" variant="link" className="text-xs text-primary mt-1">
              <Link to="/vc-appointment">Start an instant VC now</Link>
            </Button>
          </div>
        ) : (
          filteredAppointments.slice(0, 3).map((apt) => (
            <div
              key={apt.id}
              className="p-3.5 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-all border border-border/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    apt.isVC ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'bg-primary/10 text-primary'
                  }`}>
                    {apt.isVC ? <Video className="h-4.5 w-4.5" /> : <Stethoscope className="h-4.5 w-4.5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm text-foreground truncate">{apt.doctorName}</p>
                      {apt.isVC && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                          VC
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{apt.specialty}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {apt.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {apt.time}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  apt.status === 'confirmed' || apt.status === 'pending'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : apt.status === 'completed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {apt.status === 'completed' ? '✓ Completed' : 'Confirmed'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default AppointmentHistory;
