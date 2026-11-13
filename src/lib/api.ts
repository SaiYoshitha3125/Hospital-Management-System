import axios from 'axios';
import { HOSPITAL_DOCTORS, getStoredPrescriptions } from './hospitalData';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 4000,
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authApi = {
    signup: (data: any) => api.post('/auth/signup', data),
    verifyOtp: (data: { email: string; otp: string }) => api.post('/auth/verify-otp', data),
    login: (data: any) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
};

export const reportApi = {
    createReport: (data: any) => api.post('/reports/create', data),
    getMyReports: () => api.get('/reports/my-reports'),
};

export const aiApi = {
    chat: (userId: number, message: string) => api.post('/ai/chat', { user_id: userId, message }),
    getHistory: () => api.get('/ai/history'),
};

export const consultationApi = {
    request: async (data: {
        doctor_name?: string;
        patient_name?: string;
        age?: number;
        symptoms?: string;
        duration?: string;
        date?: string;
        time?: string;
        reason?: string;
        consultation_type?: string;
        problem_category?: string;
        medical_report_path?: string | null;
        doctor_advice?: string | null;
        status?: string;
    }) => {
        try {
            return await api.post('/consultation/request', data);
        } catch (error) {
            // Offline fallback: save to localStorage
            const localList = JSON.parse(localStorage.getItem('local_consultations') || '[]');
            const newItem = {
                id: Date.now(),
                patient_name: data.patient_name || 'Patient',
                age: data.age || 30,
                symptoms: data.symptoms || data.reason || 'Medical consultation',
                duration: data.duration || '15 mins',
                doctor_advice: data.doctor_advice || null,
                notes: `Mode: ${data.consultation_type === 'vc_minor' ? 'VC Appointment (Minor Problems)' : 'In-Person Clinic Visit'} | Doctor: ${data.doctor_name || 'General Physician'} | Slot: ${data.date || 'Immediate'} ${data.time || ''}`,
                status: data.status || 'confirmed',
                created_at: new Date().toISOString()
            };
            localList.unshift(newItem);
            localStorage.setItem('local_consultations', JSON.stringify(localList));
            return { data: newItem };
        }
    },
    getMyRequests: async () => {
        try {
            const res = await api.get('/consultation/my-requests');
            // If backend returned items, merge with local consultations
            const localList = JSON.parse(localStorage.getItem('local_consultations') || '[]');
            return { data: [...(res.data || []), ...localList] };
        } catch (error) {
            // Fallback to local storage or demo data
            const localList = JSON.parse(localStorage.getItem('local_consultations') || '[]');
            if (localList.length > 0) {
                return { data: localList };
            }
            // Sample fallback consultations
            const samples = [
                {
                    id: 991,
                    patient_name: 'Alex Johnson',
                    age: 29,
                    symptoms: 'Mild throat scratchiness, slight dry cough for 2 days',
                    duration: '10 mins',
                    doctor_advice: 'Advised saline gargles 3x daily, stay hydrated, Cetirizine 10mg at bedtime if allergy persists.',
                    notes: 'Mode: VC Appointment (Minor Problems) | Category: Cold, Cough & Mild Fever | Doctor: Dr. Sarah Jenkins | Slot: Completed',
                    status: 'completed',
                    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
                },
                {
                    id: 992,
                    patient_name: 'Alex Johnson',
                    age: 29,
                    symptoms: 'Routine cardiovascular follow-up & BP review',
                    duration: '20 mins',
                    doctor_advice: 'Blood pressure stable at 122/80 mmHg. Maintain current medication dosage and routine daily walks.',
                    notes: 'Mode: In-Person Clinic Visit | Doctor: Dr. Rajesh Sharma | Slot: Confirmed',
                    status: 'confirmed',
                    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
                }
            ];
            return { data: samples };
        }
    },
    respond: (data: { consultation_id: number; advice: string }) => api.post('/consultation/respond', data),
};

export const doctorApi = {
    getDoctors: async () => {
        try {
            const res = await api.get('/doctors');
            if (res.data && res.data.length > 0) {
                return res;
            }
            return {
                data: HOSPITAL_DOCTORS.map(d => ({
                    id: d.id,
                    full_name: d.name,
                    email: `${d.name.toLowerCase().replace(/[^a-z]/g, '')}@medicare.org`,
                    specialty: d.specialty,
                    rating: d.rating,
                    experience: d.experience,
                    image: d.image,
                    availableForVC: d.availableForVC,
                    availableForInPerson: d.availableForInPerson,
                    nextVcSlot: d.nextVcSlot,
                    consultationFee: d.consultationFee,
                    bio: d.bio,
                    languages: d.languages,
                }))
            };
        } catch (error) {
            return {
                data: HOSPITAL_DOCTORS.map(d => ({
                    id: d.id,
                    full_name: d.name,
                    email: `${d.name.toLowerCase().replace(/[^a-z]/g, '')}@medicare.org`,
                    specialty: d.specialty,
                    rating: d.rating,
                    experience: d.experience,
                    image: d.image,
                    availableForVC: d.availableForVC,
                    availableForInPerson: d.availableForInPerson,
                    nextVcSlot: d.nextVcSlot,
                    consultationFee: d.consultationFee,
                    bio: d.bio,
                    languages: d.languages,
                }))
            };
        }
    },
    getReports: () => api.get('/doctor/reports'),
};

export const healthApi = {
    getDietPlan: (data: any) => api.post('/health/diet-plan', data),
};

export const diseaseApi = {
    search: (query: string) => api.get(`/diseases/search?q=${query}`),
};

export const medicineApi = {
    search: (query: string) => api.get(`/medicines/search?q=${query}`),
};

export const profileApi = {
    create: async (data: any) => {
        try {
            return await api.post('/patient/profile', data);
        } catch (e) {
            localStorage.setItem('medicare_patient_profile', JSON.stringify(data));
            return { data };
        }
    },
    get: async () => {
        try {
            const res = await api.get('/patient/profile');
            return res.data;
        } catch (error) {
            const local = localStorage.getItem('medicare_patient_profile');
            if (local) {
                return JSON.parse(local);
            }
            // Return comprehensive default profile
            return {
                name: 'Alex Johnson',
                age: 29,
                gender: 'male',
                height: 178,
                weight: 72,
                blood_group: 'O+',
                symptoms: 'Mild intermittent seasonal allergies and screen eyestrain',
                existing_diseases: 'Controlled Bronchial Asthma, Mild Essential Hypertension',
                medications: 'Amlodipine 5mg (daily morning), Salbutamol Inhaler (SOS)',
                emergency_contact: '+1 (555) 349-2810 (Spouse: Emily Johnson)',
                address: '742 Evergreen Terrace, Springfield, OR 97477',
                medical_history: 'Diagnosed with mild asthma in 2021. Well-controlled with rescue inhaler. Stage 1 hypertension managed since 2023.',
                allergies: 'Penicillin (Severe: Anaphylaxis/Urticaria), Peanuts (Moderate: Oral pruritus), Pollen (Mild)',
                lifestyle: 'Non-smoker, Social wine drinker (1 glass/week), Cardio running 3x weekly, 7.5 hrs sleep',
                surgeries: 'Laparoscopic Appendectomy (2019, City Hospital)',
                family_history: 'Father: Type 2 Diabetes (age 52); Mother: Hypertension; Grandfather: CAD',
                vaccinations: 'COVID-19 Bivalent (2024), Tdap Booster (2022), Influenza (Annual)'
            };
        }
    },
    update: async (data: any) => {
        try {
            return await api.put('/patient/profile', data);
        } catch (e) {
            localStorage.setItem('medicare_patient_profile', JSON.stringify(data));
            return { data };
        }
    },
};

export default api;
