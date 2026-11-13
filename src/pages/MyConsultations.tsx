import React, { useEffect, useState } from 'react';
import { consultationApi } from '@/lib/api';
import { toast } from 'sonner';
import {
    MessageSquare, Clock, CheckCircle2, AlertCircle, Calendar, User,
    ChevronRight, Video, FileText, Stethoscope, Download, Plus, ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MyConsultations: React.FC = () => {
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const response = await consultationApi.getMyRequests();
                setConsultations(response.data || []);
            } catch (error) {
                toast.error('Failed to fetch consultations');
            } finally {
                setLoading(false);
            }
        };
        fetchConsultations();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="page-transition min-h-[calc(100vh-4rem)] py-12 px-4 bg-gradient-to-b from-muted/30 to-background">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                            <Stethoscope className="h-3.5 w-3.5" />
                            <span>Clinical Consultations</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-foreground">My Consultations</h1>
                        <p className="text-muted-foreground mt-1">
                            Track your video consultations (VC), in-clinic visits, and prescriptions
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button asChild size="sm" className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-soft">
                            <Link to="/vc-appointment" className="flex items-center gap-1.5">
                                <Video className="h-4 w-4" />
                                Instant VC
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="rounded-xl">
                            <Link to="/appointments" className="flex items-center gap-1.5">
                                <Plus className="h-4 w-4" />
                                Book Visit
                            </Link>
                        </Button>
                    </div>
                </div>

                {consultations.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-3xl border border-border shadow-soft p-8">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-6">
                            <MessageSquare className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No Consultations Yet</h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            You haven't requested any medical consultations yet. Choose an instant VC for small problems or an in-clinic appointment.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button asChild className="rounded-xl h-11 px-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold">
                                <Link to="/vc-appointment">Start Instant VC</Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-xl h-11 px-6">
                                <Link to="/appointments">Book In-Clinic</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {consultations.map((consultation) => {
                            const isVC = consultation.notes?.includes('VC') || consultation.symptoms?.includes('[VC');
                            const isCompleted = consultation.status === 'completed';

                            return (
                                <Card key={consultation.id} className="rounded-3xl border-border/50 shadow-card overflow-hidden bg-card hover:shadow-hover transition-all">
                                    <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/20 border-b border-border/40 px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {isVC ? (
                                                <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 gap-1.5 py-1 px-3 rounded-full font-bold">
                                                    <Video className="h-3.5 w-3.5" />
                                                    VC Video Call
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 py-1 px-3 rounded-full font-bold">
                                                    <Stethoscope className="h-3.5 w-3.5" />
                                                    In-Clinic Visit
                                                </Badge>
                                            )}

                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>
                                                    {new Date(consultation.created_at).toLocaleDateString('en-US', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <Badge
                                            className={`rounded-full px-3 py-1 font-semibold ${
                                                isCompleted
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}
                                        >
                                            {isCompleted ? '✓ Completed & Advised' : '⏳ Pending Doctor Review'}
                                        </Badge>
                                    </CardHeader>

                                    <CardContent className="p-6">
                                        {/* Notes Header Info */}
                                        {consultation.notes && (
                                            <div className="mb-4 text-xs font-medium text-muted-foreground bg-muted/30 rounded-xl px-4 py-2 border border-border/40">
                                                {consultation.notes}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Patient Details</p>
                                                    <p className="text-base font-bold flex items-center gap-2">
                                                        <User className="h-4 w-4 text-primary" />
                                                        {consultation.patient_name} <span className="text-sm font-normal text-muted-foreground">({consultation.age} yrs)</span>
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Reported Symptoms</p>
                                                    <p className="text-sm text-foreground bg-muted/20 p-3.5 rounded-xl italic leading-relaxed">
                                                        "{consultation.symptoms}"
                                                    </p>
                                                </div>
                                            </div>

                                            <div className={`rounded-2xl p-5 border ${
                                                consultation.doctor_advice
                                                    ? 'bg-green-50/60 dark:bg-green-950/20 border-green-200 dark:border-green-900/40'
                                                    : 'bg-muted/30 border-border'
                                            }`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-foreground">Doctor Prescription & Advice</p>
                                                    {consultation.doctor_advice && (
                                                        <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                                                            <CheckCircle2 className="h-3.5 w-3.5" /> Valid Rx
                                                        </span>
                                                    )}
                                                </div>

                                                {consultation.doctor_advice ? (
                                                    <div className="space-y-3">
                                                        <p className="text-sm text-foreground leading-relaxed">
                                                            {consultation.doctor_advice}
                                                        </p>
                                                        <div className="pt-2 flex gap-2">
                                                            {isVC && (
                                                                <Button asChild size="sm" variant="outline" className="rounded-xl text-xs h-8">
                                                                    <Link to="/vc-appointment">
                                                                        <Video className="h-3.5 w-3.5 mr-1" /> Re-enter VC Room
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                            <Button asChild size="sm" variant="ghost" className="rounded-xl text-xs h-8 text-primary">
                                                                <Link to="/medical-profile">
                                                                    View in Profile <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2 py-4 text-center">
                                                        <Clock className="h-7 w-7 mx-auto text-amber-500 animate-pulse mb-1" />
                                                        <p className="text-xs text-muted-foreground">Waiting for physician review & advice...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyConsultations;
