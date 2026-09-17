import sys
from pathlib import Path

# Add parent directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.schemas.protocol import ProtocolSchema, ProtocolStepSchema
from app.services.sequence_service import ProtocolEngine

def sample_protocol():
    return ProtocolSchema(
        protocol_id="test-proto-1",
        name="Test Experiment",
        description="Test protocol",
        steps=[
            ProtocolStepSchema(
                id="step-1", order=1, name="Prep", description="Prep step", expected_activity="PREPARE",
                required_objects=[], completion_condition="ready", recovery_instruction="Reset posture"
            ),
            ProtocolStepSchema(
                id="step-2", order=2, name="Reach", description="Reach step", expected_activity="REACH",
                required_objects=[], completion_condition="near", recovery_instruction="Reach hand"
            ),
            ProtocolStepSchema(
                id="step-3", order=3, name="Grasp", description="Grasp step", expected_activity="GRASP",
                required_objects=[], completion_condition="held", recovery_instruction="Grasp item"
            )
        ]
    )

def test_normal_step_sequence():
    proto = sample_protocol()
    engine = ProtocolEngine(proto, debounce_limit=1, min_confidence=0.5)
    
    # Process Step 1
    events, alerts = engine.process_observation("sess-1", "PREPARE", 0.9)
    assert len(events) == 1
    assert events[0].event_type == "STEP_COMPLETED"
    assert events[0].step_id == "step-1"
    assert engine.completion_percentage == 33.3
    
    # Process Step 2
    events, alerts = engine.process_observation("sess-1", "REACH", 0.9)
    assert len(events) == 1
    assert events[0].event_type == "STEP_COMPLETED"
    assert events[0].step_id == "step-2"
    
    # Process Step 3
    events, alerts = engine.process_observation("sess-1", "GRASP", 0.9)
    assert len(events) == 2  # STEP_COMPLETED + EXPERIMENT_COMPLETED
    assert engine.status == "COMPLETED"
    assert engine.completion_percentage == 100.0
    print("[PASS] Normal Step Sequence Test Passed!")

def test_skipped_step_detection():
    proto = sample_protocol()
    engine = ProtocolEngine(proto, debounce_limit=1, min_confidence=0.5)
    
    # Step 1 done
    engine.process_observation("sess-1", "PREPARE", 0.9)
    
    # Jump directly to GRASP (skipping REACH)
    events, alerts = engine.process_observation("sess-1", "GRASP", 0.9)
    
    skipped_evts = [e for e in events if e.event_type == "STEP_SKIPPED"]
    assert len(skipped_evts) == 1
    assert skipped_evts[0].step_id == "step-2"
    assert len(alerts) == 1
    assert alerts[0].alert_type == "SKIPPED_STEP"
    assert engine.status == "COMPLETED"
    print("[PASS] Skipped Step Detection Test Passed!")

if __name__ == "__main__":
    test_normal_step_sequence()
    test_skipped_step_detection()
    print("\nALL NAVIKSHA PROTOCOL ENGINE TESTS PASSED PERFECTLY!")
