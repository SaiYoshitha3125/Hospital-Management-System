from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from database import get_db
from models.consultation import Consultation, ConsultationStatus
from models.user import User, UserRole
from models.profile import PatientProfile
from utils.security import get_current_user
from pydantic import BaseModel
from typing import List, Optional
import datetime

router = APIRouter(prefix="/consultation", tags=["consultation"])

class ConsultationRequest(BaseModel):
    doctor_name: Optional[str] = "General Physician"
    patient_name: Optional[str] = None
    age: Optional[int] = None
    symptoms: Optional[str] = None
    duration: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    reason: Optional[str] = None
    consultation_type: Optional[str] = "in_person" # 'in_person' | 'vc_minor'
    problem_category: Optional[str] = None
    medical_report_path: Optional[str] = None
    doctor_advice: Optional[str] = None
    status: Optional[str] = None

@router.post("/request", status_code=status.HTTP_201_CREATED)
def request_consultation(request_data: ConsultationRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Determine patient name
    p_name = request_data.patient_name or current_user.full_name or current_user.email
    
    # Determine age
    p_age = request_data.age
    if not p_age:
        # Check profile if available
        profile = db.query(PatientProfile).filter(PatientProfile.user_id == current_user.id).first()
        p_age = profile.age if profile and profile.age else 30
        
    symptoms_text = request_data.symptoms or request_data.reason or "Routine Medical Consultation"
    duration_text = request_data.duration or "15 mins"
    
    # Format notes to capture doctor, consultation type, category, date, and slot
    slot_info = f"{request_data.date} {request_data.time}".strip() if (request_data.date or request_data.time) else "Immediate"
    consult_type_label = "VC Appointment (Minor Problems)" if request_data.consultation_type == "vc_minor" else "In-Person Clinic Visit"
    category_label = f" | Category: {request_data.problem_category}" if request_data.problem_category else ""
    
    note_details = f"Mode: {consult_type_label}{category_label} | Doctor: {request_data.doctor_name} | Slot: {slot_info}"
    
    consult_status = ConsultationStatus.PENDING
    if request_data.status == "completed":
        consult_status = ConsultationStatus.COMPLETED
    elif request_data.status == "confirmed":
        consult_status = ConsultationStatus.CONFIRMED

    new_request = Consultation(
        patient_id=current_user.id,
        patient_name=p_name,
        age=p_age,
        symptoms=symptoms_text,
        duration=duration_text,
        medical_report_path=request_data.medical_report_path,
        doctor_advice=request_data.doctor_advice,
        notes=note_details,
        status=consult_status
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

class ConsultationResponse(BaseModel):
    consultation_id: int
    advice: str

@router.get("/my-requests")
def get_my_consultations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.PATIENT:
        return db.query(Consultation).filter(Consultation.patient_id == current_user.id).order_by(Consultation.id.desc()).all()
    elif current_user.role == UserRole.DOCTOR:
        return db.query(Consultation).filter(or_(Consultation.doctor_id == current_user.id, Consultation.status == ConsultationStatus.PENDING)).order_by(Consultation.id.desc()).all()
    return []

@router.post("/respond")
def respond_to_consultation(response_data: ConsultationResponse, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Only doctors can provide advice")
    
    consultation = db.query(Consultation).filter(Consultation.id == response_data.consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    
    consultation.doctor_id = current_user.id
    consultation.doctor_advice = response_data.advice
    consultation.status = ConsultationStatus.COMPLETED
    
    db.commit()
    db.refresh(consultation)
    return consultation
