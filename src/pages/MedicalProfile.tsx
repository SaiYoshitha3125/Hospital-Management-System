import React, { useEffect, useState } from 'react';
import { profileApi, consultationApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  User, ActivitySquare, ClipboardList, MapPin, Phone, Heart,
  Plus, Trash2, Edit3, Shield, Syringe, Users, Scissors, AlertCircle,
  History, ChevronDown, ChevronRight, Download, FileText, Calendar
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  getStoredPatientHistory,
  savePatientHistoryItem,
  deletePatientHistoryItem,
  type PatientHistoryItem,
} from '@/lib/hospitalData';
import yoshithaAvatar from '@/assets/yoshitha-avatar.svg';

const statusColors: Record<string, string> = {
  'Active': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Controlled': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Resolved': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Fully Recovered': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Severe / Anaphylaxis Risk': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Moderate': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Mild': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Hereditary Risk': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Up to date': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Valid until 2032': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

const typeConfig: Record<PatientHistoryItem['type'], { label: string; icon: React.ComponentType<any>; color: string }> = {
  condition:  { label: 'Medical Conditions',  icon: ActivitySquare, color: 'text-blue-500' },
  surgery:    { label: 'Surgeries & Procedures', icon: Scissors,    color: 'text-orange-500' },
  allergy:    { label: 'Allergies',            icon: AlertCircle,   color: 'text-red-500' },
  family:     { label: 'Family History',       icon: Users,         color: 'text-purple-500' },
  vaccination:{ label: 'Vaccinations',         icon: Syringe,       color: 'text-green-500' },
};

const MedicalProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [historyItems, setHistoryItems] = useState<PatientHistoryItem[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>('condition');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PatientHistoryItem>>({ type: 'condition' });
  const [activeTab, setActiveTab] = useState<'vitals' | 'history' | 'consultations'>('vitals');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await profileApi.get();
        setProfile(data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.info('No medical profile found. Please create one.');
        } else {
          toast.error('Failed to fetch medical profile');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchConsultations = async () => {
      try {
        const res = await consultationApi.getMyRequests();
        setConsultations(res.data || []);
      } catch (e) {
        console.warn('Could not load consultations:', e);
      }
    };

    fetchAll();
    fetchConsultations();
    setHistoryItems(getStoredPatientHistory());
  }, []);

  const bmi = profile && profile.height && profile.weight
    ? parseFloat((profile.weight / ((profile.height / 100) ** 2)).toFixed(1))
    : null;

  const bmiCategory = bmi
    ? bmi < 18.5 ? { label: 'Underweight', color: 'text-blue-500' }
    : bmi < 25 ? { label: 'Normal', color: 'text-green-500' }
    : bmi < 30 ? { label: 'Overweight', color: 'text-amber-500' }
    : { label: 'Obese', color: 'text-red-500' }
    : null;

  const handleAddHistoryItem = () => {
    if (!newItem.title || !newItem.dateOrYear) {
      toast.error('Title and Date are required.');
      return;
    }
    const item: PatientHistoryItem = {
      id: 'hist-' + Date.now(),
      type: (newItem.type as PatientHistoryItem['type']) || 'condition',
      title: newItem.title!,
      subtitle: newItem.subtitle || '',
      dateOrYear: newItem.dateOrYear!,
      severityOrStatus: newItem.severityOrStatus || 'Active',
      notes: newItem.notes || '',
      doctorOrHospital: newItem.doctorOrHospital || '',
    };
    const updated = savePatientHistoryItem(item);
    setHistoryItems(updated);
    setShowAddModal(false);
    setNewItem({ type: 'condition' });
    toast.success('History entry added!');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deletePatientHistoryItem(id);
    setHistoryItems(updated);
    toast.success('Entry removed.');
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto max-w-2xl py-20 px-4 text-center">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
          <ClipboardList className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">No Profile Found</h1>
        <p className="text-muted-foreground mb-8">
          You haven't created a medical profile yet. Create one to help us provide better care.
        </p>
        <Button asChild className="rounded-xl h-12 px-8 bg-gradient-to-r from-primary to-blue-600">
          <Link to="/medical-form">Create Medical Profile</Link>
        </Button>
      </div>
    );
  }

  const groupedHistory: Record<PatientHistoryItem['type'], PatientHistoryItem[]> = {
    condition: historyItems.filter(h => h.type === 'condition'),
    surgery: historyItems.filter(h => h.type === 'surgery'),
    allergy: historyItems.filter(h => h.type === 'allergy'),
    family: historyItems.filter(h => h.type === 'family'),
    vaccination: historyItems.filter(h => h.type === 'vaccination'),
  };

  return (
    <div className="page-transition min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/30 to-background py-10 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-600 p-8 mb-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/50 shadow-2xl bg-white/10 backdrop-blur shrink-0 ring-4 ring-white/20">
              <img
                src={yoshithaAvatar}
                alt={profile.name || "Yoshitha"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black">{profile.name}</h1>
              <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full capitalize">{profile.gender}, {profile.age} yrs</span>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">{profile.blood_group} Blood</span>
                {bmi && <span className={`text-sm font-medium bg-white/20 px-3 py-1 rounded-full`}>BMI {bmi} — {bmiCategory?.label}</span>}
              </div>
              <p className="text-sm text-blue-100 mt-3 max-w-xl">{profile.address}</p>
            </div>
            <div className="md:ml-auto flex flex-col gap-2">
              <div className="flex gap-2">
                <Button asChild variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl text-sm">
                  <Link to="/medical-form">
                    <Edit3 className="h-4 w-4 mr-1.5" /> Edit Profile
                  </Link>
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl text-sm"
                  title="Print or Export Patient Record"
                >
                  <Download className="h-4 w-4 mr-1.5" /> Export Record
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <Phone className="h-3.5 w-3.5" />
                <span>{profile.emergency_contact}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Allergy & Risk Banner */}
        {profile.allergies && profile.allergies.toLowerCase().includes('penicillin') && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-700 dark:text-red-300 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Clinical Alert — Severe Allergy Warning: </span>
              <span>Patient has documented anaphylaxis/urticarial sensitivity to Penicillin/Beta-lactam antibiotics. Cross-reactivity precautions apply.</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-2xl mb-8">
          {(['vitals', 'history', 'consultations'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${
                activeTab === tab
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'vitals' ? '🩺 Vitals & Medical Info' : tab === 'history' ? '📋 Patient History' : '💬 Consultations'}
            </button>
          ))}
        </div>

        {/* ── VITALS TAB ── */}
        {activeTab === 'vitals' && (
          <div className="space-y-6 animate-fade-in">
            {/* Vitals Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Height', value: `${profile.height} cm`, icon: '📏' },
                { label: 'Weight', value: `${profile.weight} kg`, icon: '⚖️' },
                { label: 'BMI', value: bmi || 'N/A', sub: bmiCategory?.label, icon: '📊', color: bmiCategory?.color },
                { label: 'Blood Group', value: profile.blood_group, icon: '🩸' },
              ].map(item => (
                <Card key={item.label} className="rounded-2xl border-border/50 shadow-card text-center p-5">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                  <p className={`text-xl font-black ${item.color || 'text-foreground'}`}>{item.value}</p>
                  {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
                </Card>
              ))}
            </div>

            {/* Clinical Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: ActivitySquare, title: 'Current Symptoms', content: profile.symptoms || 'None reported' },
                { icon: Heart, title: 'Existing Conditions', content: profile.existing_diseases || 'None reported' },
                { icon: ClipboardList, title: 'Current Medications', content: profile.medications || 'None reported' },
                { icon: Shield, title: 'Known Allergies', content: profile.allergies || 'None reported' },
                { icon: History, title: 'Medical History', content: profile.medical_history || 'No prior conditions reported' },
                { icon: User, title: 'Lifestyle', content: profile.lifestyle || 'Not specified' },
              ].map(({ icon: Icon, title, content }) => (
                <Card key={title} className="rounded-2xl border-border/50 shadow-card">
                  <CardHeader className="pb-2 flex-row items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-bold">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Family & Surgical History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.surgeries && (
                <Card className="rounded-2xl border-border/50 shadow-card">
                  <CardHeader className="pb-2 flex-row items-center gap-2">
                    <Scissors className="h-4 w-4 text-orange-500" />
                    <CardTitle className="text-sm font-bold">Past Surgeries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{profile.surgeries}</p>
                  </CardContent>
                </Card>
              )}
              {profile.family_history && (
                <Card className="rounded-2xl border-border/50 shadow-card">
                  <CardHeader className="pb-2 flex-row items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <CardTitle className="text-sm font-bold">Family Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{profile.family_history}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ── PATIENT HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Complete Medical History</h2>
              <Button
                size="sm"
                className="gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 shadow-soft"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-4 w-4" /> Add Entry
              </Button>
            </div>

            {(Object.keys(typeConfig) as PatientHistoryItem['type'][]).map(type => {
              const { label, icon: Icon, color } = typeConfig[type];
              const items = groupedHistory[type];
              const isExpanded = expandedSection === type;

              return (
                <Card key={type} className="rounded-2xl border-border/50 shadow-card overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : type)}
                    className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-muted`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{items.length} {items.length === 1 ? 'entry' : 'entries'}</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border">
                      {items.length === 0 ? (
                        <div className="p-6 text-center">
                          <p className="text-sm text-muted-foreground">No {label.toLowerCase()} recorded.</p>
                          <button
                            onClick={() => { setNewItem({ type }); setShowAddModal(true); }}
                            className="text-sm text-primary font-medium hover:underline mt-1"
                          >
                            + Add entry
                          </button>
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {items.map(item => (
                            <div key={item.id} className="p-5 hover:bg-muted/20 transition-colors">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                                    {item.severityOrStatus && (
                                      <Badge className={`text-xs rounded-full ${statusColors[item.severityOrStatus] || 'bg-muted text-muted-foreground'}`}>
                                        {item.severityOrStatus}
                                      </Badge>
                                    )}
                                  </div>
                                  {item.subtitle && <p className="text-xs text-muted-foreground mb-1">{item.subtitle}</p>}
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{item.dateOrYear}</span>
                                    {item.doctorOrHospital && <span>· {item.doctorOrHospital}</span>}
                                  </div>
                                  {item.notes && (
                                    <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 leading-relaxed">{item.notes}</p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleDeleteHistoryItem(item.id)}
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ── CONSULTATIONS TAB ── */}
        {activeTab === 'consultations' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-foreground">Consultation History</h2>
              <Button asChild size="sm" className="gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 shadow-soft">
                <Link to="/consultation-request">
                  <Plus className="h-4 w-4" /> New Consultation
                </Link>
              </Button>
            </div>

            {consultations.length === 0 ? (
              <Card className="rounded-2xl border-border/50 shadow-card p-10 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-foreground">No consultations yet</p>
                <p className="text-sm text-muted-foreground mt-1">Your past consultations and advice will appear here.</p>
                <Button asChild className="mt-5 rounded-xl" size="sm">
                  <Link to="/consultation-request">Start a Consultation</Link>
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {consultations.map((c: any) => (
                  <Card key={c.id} className="rounded-2xl border-border/50 shadow-card overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-muted/20 border-b border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(c.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <Badge className={`rounded-full px-3 ${
                        c.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        c.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {c.status === 'completed' ? '✓ Completed' : c.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                      </Badge>
                    </div>
                    <div className="p-4 space-y-3">
                      {c.notes && (
                        <p className="text-xs font-medium text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">{c.notes}</p>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Symptoms / Reason</p>
                        <p className="text-sm font-medium italic text-foreground">"{c.symptoms}"</p>
                      </div>
                      {c.doctor_advice && (
                        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900">
                          <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1.5">
                            <Shield className="h-3.5 w-3.5" /> Doctor's Advice
                          </p>
                          <p className="text-sm text-green-800 dark:text-green-300">{c.doctor_advice}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add History Item Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add Medical History Entry</DialogTitle>
              <DialogDescription>Add a new record to your patient history.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newItem.type}
                  onValueChange={v => setNewItem(p => ({ ...p, type: v as PatientHistoryItem['type'] }))}
                >
                  <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(typeConfig) as PatientHistoryItem['type'][]).map(t => (
                      <SelectItem key={t} value={t}>{typeConfig[t].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  placeholder="e.g. Type 2 Diabetes"
                  value={newItem.title || ''}
                  onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle / Details</Label>
                <Input
                  placeholder="Brief description"
                  value={newItem.subtitle || ''}
                  onChange={e => setNewItem(p => ({ ...p, subtitle: e.target.value }))}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Date / Year *</Label>
                  <Input
                    placeholder="e.g. March 2022"
                    value={newItem.dateOrYear || ''}
                    onChange={e => setNewItem(p => ({ ...p, dateOrYear: e.target.value }))}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status / Severity</Label>
                  <Input
                    placeholder="e.g. Controlled"
                    value={newItem.severityOrStatus || ''}
                    onChange={e => setNewItem(p => ({ ...p, severityOrStatus: e.target.value }))}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Doctor / Hospital</Label>
                <Input
                  placeholder="e.g. Dr. Smith, City Hospital"
                  value={newItem.doctorOrHospital || ''}
                  onChange={e => setNewItem(p => ({ ...p, doctorOrHospital: e.target.value }))}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional clinical notes..."
                  value={newItem.notes || ''}
                  onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))}
                  className="rounded-xl"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="flex-1 rounded-xl bg-gradient-to-r from-primary to-blue-600" onClick={handleAddHistoryItem}>Add Entry</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MedicalProfile;
