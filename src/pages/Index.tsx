import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageCircle, Calendar, Shield, Clock, Zap, HeartPulse, Stethoscope,
  Video, Star, Users, TrendingUp, Award, ArrowRight, ChevronRight,
  Activity, Brain, Thermometer, Pill, Eye, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppointmentHistory from '@/components/AppointmentHistory';
import { DashboardCardSkeleton } from '@/components/SkeletonLoader';
import HealthTipBubble from '@/components/HealthTipBubble';
import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/contexts/ReportContext';
import { MINOR_PROBLEM_CATEGORIES } from '@/lib/hospitalData';

const categoryIconMap: Record<string, React.ComponentType<any>> = {
  Thermometer, Brain, Flame: Activity, Pill, Eye, Sparkles,
};

const stats = [
  { label: 'Patients Served', value: '12,500+', icon: Users, color: 'text-blue-500' },
  { label: 'Avg Rating', value: '4.9 ★', icon: Star, color: 'text-amber-500' },
  { label: 'Avg VC Wait', value: '< 2 min', icon: Clock, color: 'text-green-500' },
  { label: 'Specialties', value: '20+', icon: Award, color: 'text-purple-500' },
];

const features = [
  {
    icon: Video,
    title: 'Instant VC Consultation',
    description: 'Connect with a certified doctor in under 2 minutes for colds, rashes, headaches and more.',
    href: '/vc-appointment',
    gradient: 'from-sky-500 to-blue-600',
    badge: 'New',
  },
  {
    icon: Stethoscope,
    title: 'Doctor Consultation',
    description: 'Request a detailed in-person or text consultation with specialist doctors.',
    href: '/consultation-request',
    gradient: 'from-primary to-blue-600',
    badge: null,
  },
  {
    icon: Shield,
    title: 'Patient History',
    description: 'View your complete medical history, allergies, vaccinations, and past consultations.',
    href: '/medical-profile',
    gradient: 'from-emerald-500 to-teal-600',
    badge: 'Enhanced',
  },
  {
    icon: Zap,
    title: 'AI Health Chat',
    description: 'Get instant AI-powered health guidance and symptom analysis available 24/7.',
    href: '/chat',
    gradient: 'from-violet-500 to-purple-600',
    badge: null,
  },
];

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user, loginDemo } = useAuth();
  const { reports } = useReports();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-transition">
      <HealthTipBubble />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Gradient backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-background to-blue-50 dark:from-sky-950/20 dark:via-background dark:to-blue-950/10" />
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary/8 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-blue-400/5 blur-3xl" />

        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in border border-primary/20">
              <HeartPulse className="h-4 w-4" />
              <span>AI-Powered Hospital Management System</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.1] mb-6 animate-slide-up">
              Your Health,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-primary to-blue-600">
                Our Priority
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
              Consult doctors instantly via video call for minor issues, track your complete
              medical history, and get AI-powered health guidance — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button
                asChild
                size="xl"
                className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-xl shadow-sky-500/25 rounded-2xl"
              >
                <Link to="/vc-appointment" className="gap-2">
                  <Video className="h-5 w-5" />
                  Start VC Consultation
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="gap-2 rounded-2xl border-2">
                <Link to="/appointments" className="gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Link>
              </Button>
            </div>

            {/* Minor Problem Categories quick links */}
            <div className="mt-10 flex flex-wrap gap-2 justify-center animate-fade-in" style={{ animationDelay: '350ms' }}>
              <span className="text-xs text-muted-foreground">Quick VC for:</span>
              {MINOR_PROBLEM_CATEGORIES.slice(0, 4).map(cat => (
                <Link
                  key={cat.id}
                  to="/vc-appointment"
                  className="text-xs px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors"
                >
                  {cat.title.split(' ')[0]}
                </Link>
              ))}
              <Link to="/vc-appointment" className="text-xs px-3 py-1 bg-muted text-muted-foreground rounded-full hover:bg-muted/80">
                +more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-10 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="text-center">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
                <p className="text-2xl font-black text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete hospital management suite — from instant telehealth to comprehensive patient records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map(({ icon: Icon, title, description, href, gradient, badge }) => (
              <Link
                key={title}
                to={href}
                className="group p-6 rounded-3xl bg-card border border-border hover:border-primary/30 shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shrink-0`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-lg">{title}</h3>
                      {badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold bg-gradient-to-r ${gradient} text-white`}>
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD WIDGETS ── */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Appointment History */}
            {isLoading ? <DashboardCardSkeleton /> : <AppointmentHistory />}

            {/* VC Card */}
            {isLoading ? <DashboardCardSkeleton /> : (
              <Card className="p-6 rounded-3xl bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20 border border-sky-200 dark:border-sky-800 shadow-card">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Video Consultation</h3>
                    <p className="text-xs text-muted-foreground">Instant VC for minor problems</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">Doctors Online</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {MINOR_PROBLEM_CATEGORIES.slice(0, 4).map(cat => (
                    <Link key={cat.id} to="/vc-appointment" className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-sky-100 dark:border-sky-900 hover:border-sky-300 hover:shadow-sm transition-all group">
                      <p className="text-xs font-semibold text-foreground leading-tight group-hover:text-sky-600 transition-colors">{cat.title.split(' ')[0]}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.typicalDuration}</p>
                    </Link>
                  ))}
                </div>

                <Button
                  asChild
                  className="w-full gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl shadow-lg"
                >
                  <Link to="/vc-appointment">
                    <Video className="h-4 w-4" /> Start Instant Consultation
                  </Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-sky-500 p-10 md:p-16 shadow-2xl">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white/5 blur-3xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="text-center lg:text-left text-white max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  Take control of your health today
                </h2>
                <p className="text-blue-100 text-lg">
                  Join 12,500+ patients who trust MediCare for instant video consultations,
                  comprehensive medical records, and expert care.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                {!isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => loginDemo('patient')}
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 font-bold rounded-2xl gap-2 shadow-lg"
                    >
                      Try Demo <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-white/40 text-white hover:bg-white/10 rounded-2xl"
                    >
                      <Link to="/signup">Create Account</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold rounded-2xl gap-2">
                      <Link to="/vc-appointment">
                        <Video className="h-5 w-5" /> Start VC Now
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 rounded-2xl">
                      <Link to="/medical-profile">View My Records</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
