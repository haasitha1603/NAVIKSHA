from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.entities import SessionEntity, EventEntity, AlertEntity
from app.services.logging_service import logging_service
from app.services.report_service import report_service

router = APIRouter()

@router.get("/sessions/{session_id}/events")
def get_session_events(session_id: str, db: Session = Depends(get_db)):
    events = db.query(EventEntity).filter(EventEntity.session_id == session_id).all()
    return [
        {
            "id": e.id,
            "session_id": e.session_id,
            "timestamp": e.timestamp,
            "video_timestamp": e.video_timestamp,
            "event_type": e.event_type,
            "step_id": e.step_id,
            "step_name": e.step_name,
            "expected_action": e.expected_action,
            "observed_action": e.observed_action,
            "status": e.status,
            "confidence": e.confidence,
            "severity": e.severity,
            "message": e.message,
            "recovery_instruction": e.recovery_instruction
        }
        for e in events
    ]

@router.get("/sessions/{session_id}/alerts")
def get_session_alerts(session_id: str, db: Session = Depends(get_db)):
    alerts = db.query(AlertEntity).filter(AlertEntity.session_id == session_id).all()
    return [
        {
            "id": a.id,
            "session_id": a.session_id,
            "timestamp": a.timestamp,
            "severity": a.severity,
            "alert_type": a.alert_type,
            "message": a.message,
            "voice_message": a.voice_message,
            "acknowledged": a.acknowledged,
            "resolved": a.resolved
        }
        for a in alerts
    ]

@router.get("/sessions/{session_id}/report")
def get_session_report(session_id: str, db: Session = Depends(get_db)):
    sess = db.query(SessionEntity).filter(SessionEntity.id == session_id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    
    events_raw = db.query(EventEntity).filter(EventEntity.session_id == session_id).all()
    alerts_raw = db.query(AlertEntity).filter(AlertEntity.session_id == session_id).all()

    events = [e.__dict__ for e in events_raw]
    alerts = [a.__dict__ for a in alerts_raw]

    session_data = {
        "id": sess.id,
        "experiment_id": sess.experiment_id,
        "protocol_id": sess.protocol_id,
        "started_at": sess.started_at,
        "ended_at": sess.ended_at,
        "status": sess.status,
        "completion_percentage": sess.completion_percentage
    }

    return report_service.generate_report(session_data, events, alerts)

@router.get("/sessions/{session_id}/export/{format_type}")
def export_session_log(session_id: str, format_type: str, db: Session = Depends(get_db)):
    sess = db.query(SessionEntity).filter(SessionEntity.id == session_id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")

    events_raw = db.query(EventEntity).filter(EventEntity.session_id == session_id).all()
    events = [
        {
            "id": e.id,
            "session_id": e.session_id,
            "timestamp": e.timestamp,
            "video_timestamp": e.video_timestamp,
            "event_type": e.event_type,
            "step_id": e.step_id,
            "step_name": e.step_name,
            "expected_action": e.expected_action,
            "observed_action": e.observed_action,
            "status": e.status,
            "confidence": e.confidence,
            "severity": e.severity,
            "message": e.message,
            "recovery_instruction": e.recovery_instruction
        }
        for e in events_raw
    ]

    session_data = {
        "id": sess.id,
        "experiment_id": sess.experiment_id,
        "protocol_id": sess.protocol_id,
        "started_at": sess.started_at,
        "ended_at": sess.ended_at,
        "status": sess.status,
        "completion_percentage": sess.completion_percentage
    }

    if format_type.lower() == "json":
        file_path = logging_service.export_json(session_id, events)
        return FileResponse(file_path, filename=f"naviksha_{session_id}.json", media_type="application/json")
    elif format_type.lower() == "csv":
        file_path = logging_service.export_csv(session_id, events)
        return FileResponse(file_path, filename=f"naviksha_{session_id}.csv", media_type="text/csv")
    elif format_type.lower() in ["txt", "log"]:
        file_path = logging_service.export_txt(session_id, session_data, events)
        return FileResponse(file_path, filename=f"naviksha_{session_id}.txt", media_type="text/plain")
    else:
        raise HTTPException(status_code=400, detail="Invalid export format (supported: json, csv, txt)")
