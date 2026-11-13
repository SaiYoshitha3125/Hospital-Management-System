export interface MinorProblemCategory {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  typicalDuration: string;
  urgencyLevel: 'low' | 'moderate';
  commonSymptoms: string[];
  recommendedSpecialty: string;
}

export const MINOR_PROBLEM_CATEGORIES: MinorProblemCategory[] = [
  {
    id: 'cold_flu',
    title: 'Cold, Cough & Mild Fever',
    shortDesc: 'Sore throat, runny nose, low-grade fever (<101°F), body aches',
    iconName: 'Thermometer',
    typicalDuration: '10 mins',
    urgencyLevel: 'low',
    commonSymptoms: ['Runny / Stuffy Nose', 'Dry or Productive Cough', 'Mild Fever (<101°F)', 'Scratchy / Sore Throat'],
    recommendedSpecialty: 'General Tele-Physician',
  },
  {
    id: 'skin_allergy',
    title: 'Skin Rash & Minor Allergies',
    shortDesc: 'Itching, seasonal allergies, mild hives, insect bites, contact dermatitis',
    iconName: 'Sparkles',
    typicalDuration: '10 mins',
    urgencyLevel: 'low',
    commonSymptoms: ['Localized Red Rash', 'Itching & Mild Hives', 'Insect Bite Swelling', 'Sneezing / Watery Eyes'],
    recommendedSpecialty: 'Dermatologist & Allergy Specialist',
  },
  {
    id: 'headache',
    title: 'Headache & Eyestrain',
    shortDesc: 'Tension headaches, screen fatigue, mild migraines, sinus pressure',
    iconName: 'Brain',
    typicalDuration: '10 mins',
    urgencyLevel: 'low',
    commonSymptoms: ['Forehead / Temple Tension', 'Eye Strain after Screens', 'Mild Throbbing', 'Sinus Congestion Pressure'],
    recommendedSpecialty: 'General Physician',
  },
  {
    id: 'digestive',
    title: 'Mild Stomach Upset & Acidity',
    shortDesc: 'Acid reflux, gas, mild indigestion, nausea, dietary upset',
    iconName: 'Flame',
    typicalDuration: '10 mins',
    urgencyLevel: 'low',
    commonSymptoms: ['Heartburn / Acid Regurgitation', 'Abdominal Bloating & Gas', 'Mild Nausea', 'Post-meal Discomfort'],
    recommendedSpecialty: 'Internal Medicine',
  },
  {
    id: 'prescription_refill',
    title: 'Prescription Refill & Follow-up',
    shortDesc: 'Refill routine maintenance medication or discuss recent lab test results',
    iconName: 'Pill',
    typicalDuration: '5-10 mins',
    urgencyLevel: 'low',
    commonSymptoms: ['Maintenance Med Refill', 'Dosage Clarification', 'Lab Result Discussion', 'Doctor Follow-up Query'],
    recommendedSpecialty: 'Consulting Physician',
  },
  {
    id: 'eye_ear_throat',
    title: 'Minor Eye & Ear Irritation',
    shortDesc: 'Pink eye, mild ear fullness, dry eyes, seasonal irritation',
    iconName: 'Eye',
    typicalDuration: '10 mins',
    urgencyLevel: 'low',
    commonSymptoms: ['Redness / Watery Discharge', 'Dry Itchy Eyes', 'Mild Ear Ringing/Fullness', 'Throat Tickle'],
    recommendedSpecialty: 'ENT / Primary Care',
  },
];

export interface HospitalDoctor {
  id: number;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  image: string;
  availableForVC: boolean;
  availableForInPerson: boolean;
  nextVcSlot: string;
  consultationFee: number;
  bio: string;
  languages: string[];
}

export const HOSPITAL_DOCTORS: HospitalDoctor[] = [
  {
    id: 101,
    name: 'Dr. Sarah Jenkins',
    specialty: 'General Medicine & Tele-Triage',
    qualification: 'MD, FACP (Harvard Medical School)',
    experience: '12 years exp.',
    rating: 4.95,
    reviewsCount: 428,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    availableForVC: true,
    availableForInPerson: true,
    nextVcSlot: 'Available in 2 mins',
    consultationFee: 25,
    bio: 'Specialist in digital triage, acute ambulatory conditions, common infectious illnesses, and preventive health.',
    languages: ['English', 'Spanish'],
  },
  {
    id: 102,
    name: 'Dr. Rajesh Sharma',
    specialty: 'Internal Medicine & Cardiology',
    qualification: 'MD, DM Cardiology (AIIMS)',
    experience: '16 years exp.',
    rating: 4.92,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    availableForVC: true,
    availableForInPerson: true,
    nextVcSlot: 'Available in 5 mins',
    consultationFee: 35,
    bio: 'Senior Consultant addressing hypertension, lipid disorders, cardiovascular prevention, and complex medical queries.',
    languages: ['English', 'Hindi'],
  },
  {
    id: 103,
    name: 'Dr. Emily Chen',
    specialty: 'Pediatrics & Adolescent Care',
    qualification: 'MD Pediatrics (Johns Hopkins)',
    experience: '9 years exp.',
    rating: 4.89,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1594824813591-53690d56b060?auto=format&fit=crop&q=80&w=600',
    availableForVC: true,
    availableForInPerson: true,
    nextVcSlot: 'Available in 3 mins',
    consultationFee: 30,
    bio: 'Caring tele-pediatrician handling infant colds, rashes, dietary allergies, and childhood immunization questions.',
    languages: ['English', 'Mandarin'],
  },
  {
    id: 104,
    name: 'Dr. Marcus Vance',
    specialty: 'Dermatology & Allergic Disorders',
    qualification: 'MD, FAAD (Stanford Medicine)',
    experience: '11 years exp.',
    rating: 4.91,
    reviewsCount: 289,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    availableForVC: true,
    availableForInPerson: false,
    nextVcSlot: 'Available in 4 mins',
    consultationFee: 30,
    bio: 'Expert in teledermatology: rashes, eczema, acne, insect reactions, and allergic urticaria diagnostics.',
    languages: ['English', 'French'],
  },
  {
    id: 105,
    name: 'Dr. Priya Patel',
    specialty: 'ENT & Upper Respiratory Care',
    qualification: 'MS (ENT), DNB',
    experience: '14 years exp.',
    rating: 4.87,
    reviewsCount: 365,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=600',
    availableForVC: true,
    availableForInPerson: true,
    nextVcSlot: 'Available in 8 mins',
    consultationFee: 28,
    bio: 'Dedicated treatment of sinus headaches, seasonal allergic rhinitis, tonsillitis, and ear discomfort.',
    languages: ['English', 'Gujarati', 'Hindi'],
  },
  {
    id: 106,
    name: 'Dr. David Miller',
    specialty: 'Orthopedics & Sports Physical Care',
    qualification: 'MS Ortho, MCh (Oxford)',
    experience: '15 years exp.',
    rating: 4.88,
    reviewsCount: 440,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=600',
    availableForVC: false,
    availableForInPerson: true,
    nextVcSlot: 'Tomorrow 10:00 AM',
    consultationFee: 40,
    bio: 'Specialist in joint preservation, acute sprains, spine ergonomics, and rehabilitation medicine.',
    languages: ['English'],
  },
];

export interface PatientHistoryItem {
  id: string;
  type: 'condition' | 'surgery' | 'allergy' | 'vaccination' | 'family';
  title: string;
  subtitle: string;
  dateOrYear: string;
  severityOrStatus?: string; // e.g. "Active", "Controlled", "Resolved", "Severe", "Mild"
  notes?: string;
  doctorOrHospital?: string;
}

export const DEFAULT_PATIENT_HISTORY: PatientHistoryItem[] = [
  {
    id: 'hist-1',
    type: 'condition',
    title: 'Mild Bronchial Asthma',
    subtitle: 'Respiratory condition triggered by seasonal pollen & sudden cold air',
    dateOrYear: 'Diagnosed: 2021',
    severityOrStatus: 'Controlled',
    notes: 'Managed with SOS Salbutamol inhaler; symptoms minimal during spring.',
    doctorOrHospital: 'Dr. Sarah Jenkins (MediCare Center)',
  },
  {
    id: 'hist-2',
    type: 'condition',
    title: 'Mild Essential Hypertension',
    subtitle: 'Stage 1 blood pressure regulation',
    dateOrYear: 'Diagnosed: Aug 2023',
    severityOrStatus: 'Controlled',
    notes: 'Baseline BP maintained at 122/80 mmHg with daily low-dose Amlodipine.',
    doctorOrHospital: 'Dr. Rajesh Sharma',
  },
  {
    id: 'hist-3',
    type: 'allergy',
    title: 'Penicillin / Amoxicillin',
    subtitle: 'Beta-lactam antibiotic allergy',
    dateOrYear: 'Identified: 2018',
    severityOrStatus: 'Severe / Anaphylaxis Risk',
    notes: 'Developed urticarial rash, lip swelling, and facial edema within 45 mins. Substitute with Azithromycin or Fluoroquinolones.',
    doctorOrHospital: 'Memorial Hospital ER',
  },
  {
    id: 'hist-4',
    type: 'allergy',
    title: 'Peanuts & Tree Nuts',
    subtitle: 'Food allergy',
    dateOrYear: 'Childhood onset',
    severityOrStatus: 'Moderate',
    notes: 'Oral itching and mild hives. Patient avoids all nut products.',
    doctorOrHospital: 'Dr. Marcus Vance',
  },
  {
    id: 'hist-5',
    type: 'surgery',
    title: 'Laparoscopic Appendectomy',
    subtitle: 'Acute appendicitis surgical resection',
    dateOrYear: 'June 14, 2019',
    severityOrStatus: 'Fully Recovered',
    notes: 'Uncomplicated laparoscopic procedure. 3 small abdominal puncture scars healed cleanly.',
    doctorOrHospital: 'City General Surgical Center - Dr. K. Wilson',
  },
  {
    id: 'hist-6',
    type: 'family',
    title: 'Type 2 Diabetes Mellitus',
    subtitle: 'Paternal history',
    dateOrYear: 'Father (Diagnosed at age 52)',
    severityOrStatus: 'Hereditary Risk',
    notes: 'Annual HbA1c screening recommended. Patient current HbA1c: 5.4% (Normal).',
    doctorOrHospital: 'Family History Audit',
  },
  {
    id: 'hist-7',
    type: 'family',
    title: 'Early Coronary Artery Disease',
    subtitle: 'Maternal grandfather history',
    dateOrYear: 'Grandfather (MI at age 58)',
    severityOrStatus: 'Hereditary Risk',
    notes: 'Regular lipid profile monitoring recommended.',
    doctorOrHospital: 'Family History Audit',
  },
  {
    id: 'hist-8',
    type: 'vaccination',
    title: 'COVID-19 Bivalent Booster',
    subtitle: 'mRNA Vaccine (Spikevax)',
    dateOrYear: 'Oct 12, 2024',
    severityOrStatus: 'Up to date',
    notes: 'Batch #EL9241, administered left deltoid.',
    doctorOrHospital: 'MediCare Public Health Clinic',
  },
  {
    id: 'hist-9',
    type: 'vaccination',
    title: 'Tetanus Toxoid (Tdap) Booster',
    subtitle: 'Tetanus, Diphtheria, Pertussis',
    dateOrYear: 'May 2022',
    severityOrStatus: 'Valid until 2032',
    notes: '10-year booster coverage.',
    doctorOrHospital: 'MediCare Occupational Center',
  },
];

export interface VCPrescription {
  id: string;
  consultationId?: number;
  consultationDate: string;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  patientAge: number;
  chiefComplaint: string;
  diagnosis: string;
  vitalsObserved: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  lifestyleAdvice: string[];
  followUp: string;
  isUrgentCareNeeded: boolean;
}

export const getStoredPatientHistory = (): PatientHistoryItem[] => {
  try {
    const raw = localStorage.getItem('medicare_patient_history');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse patient history from local storage', e);
  }
  return DEFAULT_PATIENT_HISTORY;
};

export const savePatientHistoryItem = (item: PatientHistoryItem): PatientHistoryItem[] => {
  const current = getStoredPatientHistory();
  const updated = [item, ...current];
  localStorage.setItem('medicare_patient_history', JSON.stringify(updated));
  return updated;
};

export const deletePatientHistoryItem = (id: string): PatientHistoryItem[] => {
  const current = getStoredPatientHistory();
  const updated = current.filter((x) => x.id !== id);
  localStorage.setItem('medicare_patient_history', JSON.stringify(updated));
  return updated;
};

export const getStoredPrescriptions = (): VCPrescription[] => {
  try {
    const raw = localStorage.getItem('medicare_vc_prescriptions');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse prescriptions from local storage', e);
  }
  return [];
};

export const saveVCPrescription = (rx: VCPrescription): VCPrescription[] => {
  const current = getStoredPrescriptions();
  const updated = [rx, ...current];
  localStorage.setItem('medicare_vc_prescriptions', JSON.stringify(updated));
  return updated;
};
