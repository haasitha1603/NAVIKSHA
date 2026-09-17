from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AlertSchema(BaseModel):
    id: Optional[str] = None
    session_id: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    severity: str = "WARNING"  # INFO, WARNING, ERROR, CRITICAL
    alert_type: str  # SKIPPED_STEP, OUT_OF_SEQUENCE, LOW_CONFIDENCE, TIMEOUT
    message: str
    voice_message: str
    acknowledged: bool = False
    resolved: bool = False
