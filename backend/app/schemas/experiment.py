from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SessionCreateSchema(BaseModel):
    experiment_id: str = "exp-default"
    protocol_id: str = "color-sort-rack-v1"
    input_source: str = "sample"  # sample, camera, upload
    model_id: str = "baseline-perception-v1"

class SessionResponseSchema(BaseModel):
    id: str
    experiment_id: str
    protocol_id: str
    model_id: str
    input_source: str
    started_at: str
    ended_at: Optional[str] = None
    status: str  # READY, IN_PROGRESS, PAUSED, COMPLETED, ABORTED
    current_step_id: Optional[str] = None
    completion_percentage: float = 0.0
    recording_path: Optional[str] = None
    stream_destination: Optional[str] = None
