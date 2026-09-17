from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class ActivityEventSchema(BaseModel):
    id: Optional[str] = None
    session_id: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    video_timestamp: float = 0.0
    activity: str
    confidence: float
    source: str = "BASELINE_ADAPTER"
    metadata: Optional[Dict[str, Any]] = None

class ProtocolEventSchema(BaseModel):
    id: Optional[str] = None
    session_id: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    video_timestamp: float = 0.0
    event_type: str  # STEP_COMPLETED, STEP_SKIPPED, OUT_OF_SEQUENCE, RECOVERY_REQUIRED
    step_id: Optional[str] = None
    step_name: Optional[str] = None
    expected_action: Optional[str] = None
    observed_action: Optional[str] = None
    status: str = "INFO"
    confidence: float = 1.0
    severity: str = "INFO"
    message: str
    recovery_instruction: Optional[str] = None
