import uuid
from typing import List, Tuple, Dict, Any, Optional
from datetime import datetime
from app.schemas.protocol import ProtocolSchema, ProtocolStepSchema
from app.schemas.event import ProtocolEventSchema
from app.schemas.alert import AlertSchema

class ProtocolEngine:
    def __init__(self, protocol: ProtocolSchema, debounce_limit: int = 3, min_confidence: float = 0.55):
        self.protocol = protocol
        self.steps = protocol.steps
        self.current_step_index = 0
        self.debounce_limit = debounce_limit
        self.min_confidence = min_confidence
        
        self.active_activity: Optional[str] = None
        self.active_activity_count: int = 0
        
        self.completed_step_ids: List[str] = []
        self.skipped_step_ids: List[str] = []
        self.status = "READY"  # READY, IN_PROGRESS, COMPLETED, RECOVERY_REQUIRED
        
    @property
    def current_step(self) -> Optional[ProtocolStepSchema]:
        if 0 <= self.current_step_index < len(self.steps):
            return self.steps[self.current_step_index]
        return None

    @property
    def next_recommended_step(self) -> Optional[ProtocolStepSchema]:
        return self.current_step

    @property
    def completion_percentage(self) -> float:
        if not self.steps:
            return 100.0
        return round((len(self.completed_step_ids) / len(self.steps)) * 100.0, 1)

    def process_observation(
        self,
        session_id: str,
        observed_activity: str,
        confidence: float,
        video_timestamp: float = 0.0
    ) -> Tuple[List[ProtocolEventSchema], List[AlertSchema]]:
        events: List[ProtocolEventSchema] = []
        alerts: List[AlertSchema] = []

        if confidence < self.min_confidence or self.status == "COMPLETED":
            return events, alerts

        if self.status == "READY":
            self.status = "IN_PROGRESS"

        # Debounce filter
        if observed_activity == self.active_activity:
            self.active_activity_count += 1
        else:
            self.active_activity = observed_activity
            self.active_activity_count = 1

        if self.active_activity_count < self.debounce_limit:
            return events, alerts

        # Debounce confirmed activity
        confirmed_activity = observed_activity
        curr_step = self.current_step
        if not curr_step:
            return events, alerts

        # Case A: Activity matches current expected step
        if confirmed_activity == curr_step.expected_activity:
            # Complete current step
            self.completed_step_ids.append(curr_step.id)
            evt = ProtocolEventSchema(
                id=f"evt-{uuid.uuid4().hex[:8]}",
                session_id=session_id,
                video_timestamp=video_timestamp,
                event_type="STEP_COMPLETED",
                step_id=curr_step.id,
                step_name=curr_step.name,
                expected_action=curr_step.expected_activity,
                observed_action=confirmed_activity,
                status="SUCCESS",
                confidence=confidence,
                severity="INFO",
                message=f"Completed Step {curr_step.order}: {curr_step.name}.",
                recovery_instruction=None
            )
            events.append(evt)

            # Reset debounce & advance step
            self.active_activity_count = 0
            self.current_step_index += 1

            if self.current_step_index >= len(self.steps):
                self.status = "COMPLETED"
                events.append(ProtocolEventSchema(
                    id=f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    video_timestamp=video_timestamp,
                    event_type="EXPERIMENT_COMPLETED",
                    step_id="complete",
                    step_name="Experiment Completed",
                    expected_action="NONE",
                    observed_action="NONE",
                    status="SUCCESS",
                    confidence=1.0,
                    severity="INFO",
                    message=f"All {len(self.steps)} steps in protocol '{self.protocol.name}' finished successfully.",
                    recovery_instruction=None
                ))
            else:
                self.status = "IN_PROGRESS"

            return events, alerts

        # Case B: Activity matches a FUTURE step (Skipped step detected!)
        future_match_idx = None
        for i in range(self.current_step_index + 1, len(self.steps)):
            if confirmed_activity == self.steps[i].expected_activity:
                future_match_idx = i
                break

        if future_match_idx is not None:
            # Mark all intermediate steps as skipped
            skipped_range = self.steps[self.current_step_index:future_match_idx]
            for s_step in skipped_range:
                self.skipped_step_ids.append(s_step.id)
                events.append(ProtocolEventSchema(
                    id=f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    video_timestamp=video_timestamp,
                    event_type="STEP_SKIPPED",
                    step_id=s_step.id,
                    step_name=s_step.name,
                    expected_action=s_step.expected_activity,
                    observed_action=confirmed_activity,
                    status="SKIPPED",
                    confidence=confidence,
                    severity="WARNING",
                    message=f"Skipped Step {s_step.order}: '{s_step.name}'. Observed future action '{confirmed_activity}'.",
                    recovery_instruction=s_step.recovery_instruction
                ))

            # Also trigger alert for the first skipped step
            first_skipped = skipped_range[0]
            alerts.append(AlertSchema(
                id=f"alt-{uuid.uuid4().hex[:8]}",
                session_id=session_id,
                severity="WARNING",
                alert_type="SKIPPED_STEP",
                message=f"Procedure violation! Step '{first_skipped.name}' was skipped.",
                voice_message=f"Warning. Step {first_skipped.order}, {first_skipped.name}, was skipped. {first_skipped.recovery_instruction}",
                acknowledged=False,
                resolved=False
            ))

            # Complete the future matched step
            target_step = self.steps[future_match_idx]
            self.completed_step_ids.append(target_step.id)
            events.append(ProtocolEventSchema(
                id=f"evt-{uuid.uuid4().hex[:8]}",
                session_id=session_id,
                video_timestamp=video_timestamp,
                event_type="STEP_COMPLETED",
                step_id=target_step.id,
                step_name=target_step.name,
                expected_action=target_step.expected_activity,
                observed_action=confirmed_activity,
                status="SUCCESS",
                confidence=confidence,
                severity="INFO",
                message=f"Completed Step {target_step.order}: {target_step.name}.",
                recovery_instruction=None
            ))

            self.current_step_index = future_match_idx + 1
            self.active_activity_count = 0

            if self.current_step_index >= len(self.steps):
                self.status = "COMPLETED"
            else:
                self.status = "IN_PROGRESS"

            return events, alerts

        # Case C: Out of Sequence / Unexpected Action
        if confirmed_activity not in ["IDLE", "PREPARE"]:
            alerts.append(AlertSchema(
                id=f"alt-{uuid.uuid4().hex[:8]}",
                session_id=session_id,
                severity="INFO",
                alert_type="OUT_OF_SEQUENCE",
                message=f"Out of sequence action '{confirmed_activity}' detected. Expected '{curr_step.expected_activity}' ({curr_step.name}).",
                voice_message=f"Out of sequence action detected. Please {curr_step.recovery_instruction}",
                acknowledged=False,
                resolved=False
            ))

        return events, alerts
