import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Video, Wifi, Mic, Camera, Monitor, CheckCircle2, ChevronRight,
  Thermometer, Brain, Flame, Pill, Eye, Sparkles, Clock, Shield, ArrowRight,
  Star, AlertTriangle, Stethoscope, FileText, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MINOR_PROBLEM_CATEGORIES, HOSPITAL_DOCTORS, type MinorProblemCategory } from '@/lib/hospitalData';
import { consultationApi } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const categoryIcons: Record<string, React.ComponentType<any>> = {
  Thermometer, Brain, Flame, Pill, Eye, Sparkles,
};

type Step = 'select_problem' | 'select_doctor' | 'readiness_check' | 'vc_room';

interface ReadinessState {
  camera: boolean | null;
  mic: boolean | null;
  network: boolean | null;
  display: boolean | null;
}

const VCAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>('select_problem');
  const [selectedCategory, setSelectedCategory] = useState<MinorProblemCategory | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof HOSPITAL_DOCTORS[0] | null>(null);
  const [readiness, setReadiness] = useState<ReadinessState>({
    camera: null,
    mic: null,
    network: null,
    display: null,
  });
  const [checkingDevices, setCheckingDevices] = useState(false);
  const [allReady, setAllReady] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{role:'patient'|'doctor', text:string}[]>([]);
  const [prescriptionReady, setPrescriptionReady] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // VC doctors only
  const vcDoctors = HOSPITAL_DOCTORS.filter(d => d.availableForVC);
  const recommendedDoctors = selectedCategory
    ? vcDoctors.filter(d => d.specialty.toLowerCase().includes(selectedCategory.recommendedSpecialty.split(' ')[0].toLowerCase()))
    : vcDoctors;
  const displayDoctors = recommendedDoctors.length > 0 ? recommendedDoctors : vcDoctors;

  // Call timer
  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => setCallSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  // Auto simulate doctor activities during call
  useEffect(() => {
    if (!callActive) return;

    // After 8s: doctor types
    const t1 = setTimeout(() => {
      setChatHistory(h => [...h, {
        role: 'doctor',
        text: `Hello! I'm ${selectedDoctor?.name}. Please describe how long you've been experiencing these symptoms.`
      }]);
    }, 8000);

    // After 20s: doctor notes observation
    const t2 = setTimeout(() => {
      setDoctorNotes(`Patient presents with: ${selectedCategory?.title}. Vitals appear stable via visual observation. Alert and responsive.`);
    }, 20000);

    // After 40s: prescription ready
    const t3 = setTimeout(() => {
      setPrescriptionReady(true);
      setChatHistory(h => [...h, {
        role: 'doctor',
        text: `I've reviewed your symptoms. I'm preparing your e-prescription now. This appears to be a manageable case. I'll also include some lifestyle recommendations.`
      }]);
    }, 45000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [callActive, selectedDoctor, selectedCategory]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const runReadinessCheck = async () => {
    setCheckingDevices(true);
    setReadiness({ camera: null, mic: null, network: null, display: null });

    // Simulate async checks
    await new Promise(r => setTimeout(r, 600));
    setReadiness(prev => ({ ...prev, network: true }));
    await new Promise(r => setTimeout(r, 600));
    setReadiness(prev => ({ ...prev, display: true }));
    await new Promise(r => setTimeout(r, 600));
    setReadiness(prev => ({ ...prev, mic: true }));
    await new Promise(r => setTimeout(r, 700));
    setReadiness(prev => ({ ...prev, camera: true }));

    setAllReady(true);
    setCheckingDevices(false);
  };

  const handleJoinCall = async () => {
    if (!selectedDoctor || !selectedCategory) return;
    setConnecting(true);
    await new Promise(r => setTimeout(r, 2500));
    setConnecting(false);
    setCallActive(true);
    setStep('vc_room');
  };

  const handleEndCall = async () => {
    setCallActive(false);
    setBookingLoading(true);

    // Save consultation record
    try {
      await consultationApi.request({
        consultation_type: 'vc_minor',
        problem_category: selectedCategory?.id,
        doctor_name: selectedDoctor?.name,
        symptoms: selectedCategory?.title,
        duration: formatTime(callSeconds),
        status: prescriptionReady ? 'completed' : 'confirmed',
        doctor_advice: prescriptionReady
          ? `VC Consultation for ${selectedCategory?.title}. ${doctorNotes}. E-Prescription issued. Follow up in 5 days if symptoms persist.`
          : undefined,
      });
      toast.success('VC consultation record saved!');
    } catch (e) {
      console.warn('Could not save VC consultation to backend:', e);
    } finally {
      setBookingLoading(false);
    }

    // Navigate to My Consultations
    navigate('/my-consultations');
  };

  const sendChatMessage = () => {
    if (!chatMsg.trim()) return;
    setChatHistory(h => [...h, { role: 'patient', text: chatMsg }]);
    setChatMsg('');
    // Simulate doctor reply after 3s
    setTimeout(() => {
      const replies = [
        'I understand. How long has this been going on?',
        'Thank you for letting me know. Any other symptoms?',
        'Got it. Have you tried any over-the-counter remedies?',
        'I see. Does the pain worsen at any specific time of day?',
      ];
      setChatHistory(h => [...h, { role: 'doctor', text: replies[Math.floor(Math.random() * replies.length)] }]);
    }, 3000);
  };

  // ── STEP 1: Select Problem ──
  if (step === 'select_problem') {
    return (
      <div className="page-transition min-h-[calc(100vh-4rem)] bg-gradient-to-b from-sky-50/60 to-background dark:from-sky-950/20">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 text-sm font-semibold mb-5">
              <Video className="h-4 w-4" />
              Instant Video Consultation
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
              Quick VC for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                Minor Problems
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with a certified doctor in under 5 minutes for common, non-emergency health issues.
              No waiting room. No commute. Just care.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {[
              { icon: Zap, text: 'Avg wait: &lt;2 mins' },
              { icon: Shield, text: 'HIPAA Secure' },
              { icon: Star, text: 'Board-certified doctors' },
              { icon: Clock, text: 'Available 24/7' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm text-sm text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span dangerouslySetInnerHTML={{ __html: text }} />
              </div>
            ))}
          </div>

          {/* Problem Categories */}
          <h2 className="text-xl font-bold text-foreground mb-5">What's bothering you today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {MINOR_PROBLEM_CATEGORIES.map(cat => {
              const Icon = categoryIcons[cat.iconName] || Stethoscope;
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30 shadow-lg shadow-sky-500/10'
                      : 'border-border bg-card hover:border-sky-300 hover:bg-sky-50/50 dark:hover:bg-sky-950/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-sky-500 text-white' : 'bg-muted group-hover:bg-sky-100 dark:group-hover:bg-sky-900/30'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-foreground text-sm">{cat.title}</h3>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-sky-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{cat.shortDesc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.commonSymptoms.slice(0, 2).map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cat.typicalDuration}</span>
                    <span className="font-medium text-primary">{cat.recommendedSpecialty.split(' ')[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Emergency note */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800 mb-8">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Not for emergencies</p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                For chest pain, difficulty breathing, stroke symptoms, or severe bleeding — call emergency services (911) immediately.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl px-8 shadow-lg shadow-sky-500/25"
              disabled={!selectedCategory}
              onClick={() => setStep('select_doctor')}
            >
              Continue <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2: Select Doctor ──
  if (step === 'select_doctor') {
    return (
      <div className="page-transition min-h-[calc(100vh-4rem)] bg-gradient-to-b from-sky-50/60 to-background dark:from-sky-950/20">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <button onClick={() => setStep('select_problem')} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-6 transition-colors">
            ← Back to symptoms
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-900/30">
              {React.createElement(categoryIcons[selectedCategory!.iconName] || Stethoscope, { className: 'h-5 w-5 text-sky-600 dark:text-sky-400' })}
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">Choose Your Doctor</h1>
              <p className="text-sm text-muted-foreground">For: <strong className="text-sky-600">{selectedCategory?.title}</strong></p>
            </div>
          </div>

          <p className="text-muted-foreground mb-8 mt-2">
            Showing doctors available for <strong>{selectedCategory?.recommendedSpecialty}</strong> consultations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {displayDoctors.map(doctor => {
              const isSelected = selectedDoctor?.id === doctor.id;
              return (
                <button
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg group ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30 shadow-sky-500/10 shadow-lg'
                      : 'border-border bg-card hover:border-sky-300'
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-xl object-cover object-top shrink-0"
                      onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-foreground">{doctor.name}</h3>
                          <p className="text-xs text-primary font-medium">{doctor.specialty}</p>
                          <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-sky-500 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <span className="font-semibold">{doctor.rating}</span>
                          <span className="text-muted-foreground">({doctor.reviewsCount})</span>
                        </div>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{doctor.experience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">{doctor.nextVcSlot}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">\${doctor.consultationFee} <span className="text-xs font-normal text-muted-foreground">/ session</span></span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('select_problem')} className="rounded-xl">Back</Button>
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl px-8 shadow-lg shadow-sky-500/25"
              disabled={!selectedDoctor}
              onClick={() => { setStep('readiness_check'); runReadinessCheck(); }}
            >
              Check Device Readiness <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 3: Readiness Check ──
  if (step === 'readiness_check') {
    const checks: { key: keyof ReadinessState; label: string; icon: React.ComponentType<any> }[] = [
      { key: 'network', label: 'Network Connection', icon: Wifi },
      { key: 'display', label: 'Display', icon: Monitor },
      { key: 'mic', label: 'Microphone', icon: Mic },
      { key: 'camera', label: 'Camera', icon: Camera },
    ];

    return (
      <div className="page-transition min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-sky-50/60 to-background dark:from-sky-950/20 p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-900/40 mb-4">
                <Video className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              </div>
              <h2 className="text-2xl font-black text-foreground">Device Check</h2>
              <p className="text-muted-foreground text-sm mt-1">Ensuring everything is ready for your call</p>
            </div>

            {/* Doctor preview */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl mb-6">
              <img
                src={selectedDoctor?.image}
                alt={selectedDoctor?.name}
                className="w-10 h-10 rounded-lg object-cover object-top"
                onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoctor?.name}`; }}
              />
              <div>
                <p className="text-xs text-muted-foreground">Connecting to</p>
                <p className="text-sm font-bold text-foreground">{selectedDoctor?.name}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Online
              </div>
            </div>

            {/* Readiness items */}
            <div className="space-y-3 mb-8">
              {checks.map(({ key, label, icon: Icon }) => (
                <div key={key} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  readiness[key] === true ? 'bg-green-50 dark:bg-green-950/20' :
                  readiness[key] === false ? 'bg-red-50 dark:bg-red-950/20' :
                  'bg-muted/30'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    readiness[key] === true ? 'bg-green-100 dark:bg-green-900/30' :
                    readiness[key] === false ? 'bg-red-100 dark:bg-red-900/30' :
                    'bg-muted'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      readiness[key] === true ? 'text-green-600 dark:text-green-400' :
                      readiness[key] === false ? 'text-red-500' :
                      'text-muted-foreground'
                    }`} />
                  </div>
                  <span className="text-sm font-medium text-foreground flex-1">{label}</span>
                  {readiness[key] === null && checkingDevices && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                  {readiness[key] === true && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {readiness[key] === false && <span className="text-xs text-red-500">Failed</span>}
                </div>
              ))}
            </div>

            {allReady && (
              <div className="text-center mb-6 p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> All systems ready!
                </p>
              </div>
            )}

            <Button
              className="w-full gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl h-13 text-base font-bold shadow-lg shadow-sky-500/25"
              disabled={!allReady || connecting}
              onClick={handleJoinCall}
            >
              {connecting ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Connecting...</>
              ) : (
                <><Video className="h-5 w-5" /> Join Video Consultation</>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 4: VC Room ──
  return (
    <div className="page-transition min-h-[calc(100vh-4rem)] bg-slate-900 text-white flex flex-col">
      {/* Call Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-mono font-bold">{formatTime(callSeconds)}</span>
          <span className="text-xs text-slate-400">· LIVE</span>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Consultation with</p>
          <p className="text-sm font-bold">{selectedDoctor?.name}</p>
        </div>
        {prescriptionReady ? (
          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">Rx Ready</Badge>
        ) : (
          <Badge className="bg-sky-500/20 text-sky-400 border border-sky-500/30">In Progress</Badge>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main video area */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          {/* Doctor video */}
          <div className="relative flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center min-h-[200px]">
            <img
              src={selectedDoctor?.image}
              alt={selectedDoctor?.name}
              className="w-full h-full object-cover object-top opacity-90"
              onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoctor?.name}`; }}
              style={{ maxHeight: '340px' }}
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <p className="text-sm font-bold">{selectedDoctor?.name}</p>
              <p className="text-xs text-slate-300">{selectedDoctor?.specialty}</p>
            </div>
          </div>

          {/* Patient self-view */}
          <div className="relative h-32 w-48 self-end rounded-xl overflow-hidden bg-slate-700 flex items-center justify-center border-2 border-slate-600">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-sky-600 flex items-center justify-center mx-auto mb-1">
                <span className="text-lg font-bold">{(user?.full_name || 'P')[0]}</span>
              </div>
              <p className="text-xs text-slate-300">{user?.full_name || 'You'}</p>
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 rounded px-1.5 py-0.5">
              <Camera className="h-3 w-3" />
            </div>
          </div>

          {/* Doctor notes */}
          {doctorNotes && (
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-400 mb-1 flex items-center gap-1.5"><FileText className="h-3 w-3" />Doctor's Observations (Live)</p>
              <p className="text-sm text-slate-200">{doctorNotes}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors"><Mic className="h-5 w-5" /></button>
            <button className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors"><Camera className="h-5 w-5" /></button>
            <button
              onClick={handleEndCall}
              disabled={bookingLoading}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {bookingLoading ? 'Saving...' : 'End Call'}
            </button>
            {prescriptionReady && (
              <button
                className="px-5 py-3 bg-green-500 hover:bg-green-600 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
                onClick={handleEndCall}
              >
                <FileText className="h-4 w-4" /> Get Prescription
              </button>
            )}
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="w-72 border-l border-slate-700 flex flex-col bg-slate-850">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-sm font-bold">In-Call Chat</h3>
            <p className="text-xs text-slate-400">For: {selectedCategory?.title}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatHistory.length === 0 && (
              <div className="text-center text-slate-500 text-xs py-8">
                <Mic className="h-6 w-6 mx-auto mb-2 opacity-40" />
                <p>Waiting for the doctor to join...</p>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'patient' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === 'patient'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-400 border border-slate-600 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={sendChatMessage}
              className="p-2 bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors"
            >
              <ArrowRight className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCAppointment;

