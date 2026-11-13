import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, User, Phone, FileText, CheckCircle2, Video,
  Stethoscope, Zap, Shield, Sparkles, AlertCircle, ChevronRight, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { consultationApi, doctorApi } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { MINOR_PROBLEM_CATEGORIES, HOSPITAL_DOCTORS } from '@/lib/hospitalData';

const timeSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
];

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'vc' | 'clinic'>('vc');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);

  // Selected minor problem for VC
  const [selectedMinorProblem, setSelectedMinorProblem] = useState<string>('cold_flu');

  // In-clinic & scheduled appointment form data
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    phone: '',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reason: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.full_name && !formData.name) {
      setFormData(prev => ({ ...prev, name: user.full_name || '' }));
    }
  }, [user]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorApi.getDoctors();
        setDoctorsList(response.data || HOSPITAL_DOCTORS);
        if (response.data?.length > 0 && !formData.doctor) {
          setFormData(prev => ({
            ...prev,
            doctor: response.data[0].full_name || response.data[0].name
          }));
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
        setDoctorsList(HOSPITAL_DOCTORS);
      } finally {
        setFetchingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.doctor) {
      newErrors.doctor = 'Please select a healthcare professional';
    }
    if (!formData.date) {
      newErrors.date = 'Please select an appointment date';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a preferred time slot';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const isVc = activeTab === 'vc';
        const problemObj = MINOR_PROBLEM_CATEGORIES.find(p => p.id === selectedMinorProblem);

        await consultationApi.request({
          patient_name: formData.name,
          doctor_name: formData.doctor,
          date: formData.date,
          time: formData.time,
          reason: isVc ? `[VC Minor Issue: ${problemObj?.title}] ${formData.reason || 'General inquiry'}` : formData.reason,
          consultation_type: isVc ? 'vc_minor' : 'in_person',
          problem_category: isVc ? problemObj?.id : undefined,
          duration: isVc ? '15 mins (VC)' : '30 mins (In-Clinic)',
          status: 'confirmed'
        });

        setShowConfirmation(true);
        toast.success(isVc ? 'VC Appointment Scheduled Successfully!' : 'In-Clinic Appointment Confirmed!');
      } catch (error: any) {
        console.error('Booking failed:', error);
        toast.error(error.response?.data?.detail || 'Failed to book appointment. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: user?.full_name || '',
      phone: '',
      doctor: doctorsList[0]?.full_name || doctorsList[0]?.name || '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      reason: '',
    });
    setErrors({});
    setShowConfirmation(false);
  };

  return (
    <div className="page-transition min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/20 to-background py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
            <Calendar className="h-4 w-4" />
            <span>MediCare Consultation Booking</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            Schedule Your Consultation
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Choose instant Video Consultation (VC) for minor ailments, or reserve an in-person hospital appointment with our specialist doctors.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1.5 bg-muted rounded-2xl mb-8 max-w-xl mx-auto shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('vc')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'vc'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Video className="h-4 w-4" />
            <span>VC Video Consult (Quick Care)</span>
            <span className="hidden sm:inline text-xs bg-white/20 px-2 py-0.5 rounded-full font-normal">2 min wait</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('clinic')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'clinic'
                ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Stethoscope className="h-4 w-4" />
            <span>In-Clinic Hospital Visit</span>
          </button>
        </div>

        {/* VC Instant Banner */}
        {activeTab === 'vc' && (
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-primary/10 border border-sky-500/20 shadow-soft animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                    Doctors On Standby • Immediate Care
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-foreground">
                  Need quick care for mild symptoms right now?
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Skip the line entirely! Launch our interactive telehealth room with camera, in-call chat, and automatic e-prescription delivery in under 5 minutes.
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-2xl px-6 shadow-lg shadow-sky-500/20 shrink-0 gap-2 h-13"
              >
                <Link to="/vc-appointment">
                  <Video className="h-5 w-5" />
                  Launch Instant VC Room
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-3xl bg-card border border-border/50 shadow-card p-6 md:p-8 space-y-6">

            {/* If VC tab, show Minor Problem Category Picker */}
            {activeTab === 'vc' && (
              <div className="space-y-3 pb-4 border-b border-border">
                <Label className="flex items-center gap-2 text-base font-bold">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  Select Minor Problem Category
                </Label>
                <p className="text-xs text-muted-foreground">
                  Choose the common condition that best describes your current concern:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {MINOR_PROBLEM_CATEGORIES.map((cat) => {
                    const isSelected = selectedMinorProblem === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedMinorProblem(cat.id)}
                        className={`text-left p-3.5 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 shadow-sm'
                            : 'border-border/60 bg-muted/20 hover:border-sky-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-foreground">{cat.title}</span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{cat.shortDesc}</p>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground font-medium">
                          <span>⏱ {cat.typicalDuration}</span>
                          <span className="text-primary">{cat.recommendedSpecialty.split(' ')[0]}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Patient Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 font-semibold">
                  <User className="h-4 w-4 text-primary" />
                  Patient Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className={`h-12 rounded-xl bg-muted/20 ${errors.name ? 'border-destructive' : ''}`}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 font-semibold">
                  <Phone className="h-4 w-4 text-primary" />
                  Contact Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. (555) 123-4567"
                  className={`h-12 rounded-xl bg-muted/20 ${errors.phone ? 'border-destructive' : ''}`}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-semibold">
                <Stethoscope className="h-4 w-4 text-primary" />
                Select Healthcare Professional
              </Label>
              <Select
                value={formData.doctor}
                onValueChange={(value) => setFormData({ ...formData, doctor: value })}
                disabled={fetchingDoctors}
              >
                <SelectTrigger className={`h-12 rounded-xl bg-muted/20 ${errors.doctor ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder={fetchingDoctors ? "Loading doctor roster..." : "Choose a doctor"} />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {doctorsList.map((doc: any) => {
                    const docName = doc.full_name || doc.name || doc.email;
                    const docSpec = doc.specialty || 'General Physician';
                    return (
                      <SelectItem key={doc.id || docName} value={docName}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{docName}</span>
                          <span className="text-xs text-muted-foreground">({docSpec})</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.doctor && <p className="text-xs text-destructive">{errors.doctor}</p>}
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2 font-semibold">
                  <Calendar className="h-4 w-4 text-primary" />
                  Consultation Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className={`h-12 rounded-xl bg-muted/20 ${errors.date ? 'border-destructive' : ''}`}
                />
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4 text-primary" />
                  Preferred Time Slot
                </Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => setFormData({ ...formData, time: value })}
                >
                  <SelectTrigger className={`h-12 rounded-xl bg-muted/20 ${errors.time ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select appointment time" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
              </div>
            </div>

            {/* Symptoms / Reason Description */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Symptoms Description & Notes (Optional)
              </Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder={
                  activeTab === 'vc'
                    ? "Briefly describe your symptoms (e.g. scratchy throat for 2 days, mild dry cough)..."
                    : "Detail the medical concern, prior diagnoses, or test reports you are bringing..."
                }
                className="min-h-[100px] rounded-xl bg-muted/20 resize-none"
              />
            </div>

            {/* Safety Alert */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-start gap-3 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                All medical information submitted is encrypted and protected under health privacy standards. In case of life-threatening emergencies, use the Emergency button immediately.
              </span>
            </div>
          </div>

          <Button
            type="submit"
            size="xl"
            disabled={loading}
            className={`w-full rounded-2xl h-14 font-black text-base shadow-xl transition-all ${
              activeTab === 'vc'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sky-500/25'
                : 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white shadow-primary/25'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scheduling Appointment...
              </span>
            ) : activeTab === 'vc' ? (
              <span className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Confirm VC Video Appointment
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Book In-Clinic Hospital Visit
              </span>
            )}
          </Button>
        </form>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <DialogTitle className="text-2xl font-black">
                {activeTab === 'vc' ? 'VC Appointment Booked!' : 'In-Clinic Visit Booked!'}
              </DialogTitle>
              <DialogDescription className="text-center">
                Your consultation has been confirmed with MediCare Healthcare.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Mode</span>
                <span className="font-bold text-foreground">
                  {activeTab === 'vc' ? '📹 VC Video Consultation' : '🏥 In-Clinic Hospital Visit'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Patient</span>
                <span className="font-medium text-foreground">{formData.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Doctor</span>
                <span className="font-medium text-foreground">{formData.doctor}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-medium text-foreground">{formData.date} at {formData.time}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {activeTab === 'vc' && (
                <Button
                  asChild
                  className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold h-11"
                >
                  <Link to="/vc-appointment">
                    <Video className="h-4 w-4 mr-2" />
                    Enter Virtual VC Waiting Room
                  </Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl h-11"
              >
                <Link to="/my-consultations">
                  View in My Consultations
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={handleReset}
                className="w-full rounded-xl text-muted-foreground"
              >
                Schedule Another
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Appointments;
