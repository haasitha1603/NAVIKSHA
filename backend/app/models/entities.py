import json
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

Base = declarative_base()

class SessionEntity(Base):
    __tablename__ = "sessions"
    
    id = Column(String, primary_key=True)
    experiment_id = Column(String, nullable=False)
    protocol_id = Column(String, nullable=False)
    model_id = Column(String, nullable=False)
    input_source = Column(String, nullable=False)
    started_at = Column(String, nullable=False)
    ended_at = Column(String, nullable=True)
    status = Column(String, default="READY")
    current_step_id = Column(String, nullable=True)
    completion_percentage = Column(Float, default=0.0)
    recording_path = Column(String, nullable=True)
    stream_destination = Column(String, nullable=True)

class EventEntity(Base):
    __tablename__ = "events"
    
    id = Column(String, primary_key=True)
    session_id = Column(String, nullable=False, index=True)
    timestamp = Column(String, nullable=False)
    video_timestamp = Column(Float, default=0.0)
    event_type = Column(String, nullable=False)  # STEP_COMPLETED, STEP_SKIPPED, etc.
    step_id = Column(String, nullable=True)
    step_name = Column(String, nullable=True)
    expected_action = Column(String, nullable=True)
    observed_action = Column(String, nullable=True)
    status = Column(String, default="INFO")
    confidence = Column(Float, default=1.0)
    severity = Column(String, default="INFO")
    message = Column(Text, nullable=False)
    recovery_instruction = Column(Text, nullable=True)

class AlertEntity(Base):
    __tablename__ = "alerts"
    
    id = Column(String, primary_key=True)
    session_id = Column(String, nullable=False, index=True)
    timestamp = Column(String, nullable=False)
    severity = Column(String, default="WARNING")
    alert_type = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    voice_message = Column(Text, nullable=False)
    acknowledged = Column(Boolean, default=False)
    resolved = Column(Boolean, default=False)
