import uuid
from datetime import datetime
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.protocols.loader import list_available_protocols, load_protocol_from_file
from app.config import settings
from app.models.database import get_db
from app.models.entities import SessionEntity, EventEntity, AlertEntity
from app.schemas.experiment import SessionCreateSchema, SessionResponseSchema
from app.schemas.protocol import ProtocolSchema

router = APIRouter()

# Global session runner store
active_sessions: Dict[str, Any] = {}

@router.get("/protocols", response_model=List[Dict[str, Any]])
def get_protocols():
    return list_available_protocols()

@router.get("/protocols/{protocol_id}")
def get_protocol_detail(protocol_id: str):
    protocols = list_available_protocols()
    for p in protocols:
        if p["protocol_id"] == protocol_id:
            return load_protocol_from_file(settings.PROTOCOLS_DIR / f"{protocol_id}.json")
    # Fallback search
    for p_file in settings.PROTOCOLS_DIR.glob("*.*"):
        try:
            proto = load_protocol_from_file(p_file)
            if proto.protocol_id == protocol_id:
                return proto
        except Exception:
            pass
    raise HTTPException(status_code=404, detail="Protocol not found")

@router.post("/sessions", response_model=SessionResponseSchema)
def create_session(payload: SessionCreateSchema, db: Session = Depends(get_db)):
    session_id = f"sess-{uuid.uuid4().hex[:8]}"
    started_at = datetime.utcnow().isoformat() + "Z"
    
    entity = SessionEntity(
        id=session_id,
        experiment_id=payload.experiment_id,
        protocol_id=payload.protocol_id,
        model_id=payload.model_id,
        input_source=payload.input_source,
        started_at=started_at,
        status="READY",
        current_step_id="step-01",
        completion_percentage=0.0
    )
    db.add(entity)
    db.commit()
    db.refresh(entity)
    
    return SessionResponseSchema(
        id=entity.id,
        experiment_id=entity.experiment_id,
        protocol_id=entity.protocol_id,
        model_id=entity.model_id,
        input_source=entity.input_source,
        started_at=entity.started_at,
        status=entity.status,
        current_step_id=entity.current_step_id,
        completion_percentage=entity.completion_percentage
    )

@router.get("/sessions", response_model=List[SessionResponseSchema])
def list_sessions(db: Session = Depends(get_db)):
    entities = db.query(SessionEntity).all()
    return [
        SessionResponseSchema(
            id=e.id,
            experiment_id=e.experiment_id,
            protocol_id=e.protocol_id,
            model_id=e.model_id,
            input_source=e.input_source,
            started_at=e.started_at,
            ended_at=e.ended_at,
            status=e.status,
            current_step_id=e.current_step_id,
            completion_percentage=e.completion_percentage
        )
        for e in entities
    ]

@router.get("/sessions/{session_id}")
def get_session(session_id: str, db: Session = Depends(get_db)):
    entity = db.query(SessionEntity).filter(SessionEntity.id == session_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Session not found")
    return entity
