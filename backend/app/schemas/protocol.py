from pydantic import BaseModel, Field
from typing import List, Optional

class ProtocolStepSchema(BaseModel):
    id: str = Field(..., example="step-01")
    order: int = Field(..., example=1)
    name: str = Field(..., example="Prepare workspace")
    description: str = Field(..., example="Position yourself and verify rack visibility.")
    expected_activity: str = Field(..., example="PREPARE")
    required_objects: List[str] = Field(default_factory=list, example=["rack"])
    target_region: Optional[str] = Field(None, example="zone_left")
    completion_condition: str = Field(..., example="workspace_ready")
    failure_condition: Optional[str] = Field(None)
    recovery_instruction: str = Field(..., example="Clear the rack area and stay neutral.")
    timeout_seconds: Optional[int] = Field(default=60)
    severity: str = Field(default="INFO")

class ProtocolSchema(BaseModel):
    protocol_id: str = Field(..., example="color-sort-rack-v1")
    name: str = Field(..., example="ColorSort-Rack Experiment")
    version: str = Field(default="1.0.0")
    description: str = Field(..., example="Standard experiment for sorting colored boxes on rack.")
    steps: List[ProtocolStepSchema]
