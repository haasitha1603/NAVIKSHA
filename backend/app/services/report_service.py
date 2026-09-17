from typing import Dict, Any, List
from app.config import settings

class ReportService:
    """Generates structured experiment report metrics."""

    def generate_report(self, session_data: Dict[str, Any], events: List[Dict[str, Any]], alerts: List[Dict[str, Any]]) -> Dict[str, Any]:
        completed_count = sum(1 for e in events if e.get("event_type") == "STEP_COMPLETED")
        skipped_count = sum(1 for e in events if e.get("event_type") == "STEP_SKIPPED")
        warning_count = len(alerts)

        confidences = [e.get("confidence", 0.0) for e in events if "confidence" in e]
        avg_confidence = round(sum(confidences) / len(confidences), 2) if confidences else 1.0

        return {
            "session_id": session_data.get("id"),
            "experiment_id": session_data.get("experiment_id"),
            "protocol_id": session_data.get("protocol_id"),
            "started_at": session_data.get("started_at"),
            "ended_at": session_data.get("ended_at"),
            "status": session_data.get("status"),
            "completion_percentage": session_data.get("completion_percentage", 0.0),
            "summary_metrics": {
                "total_events": len(events),
                "steps_completed": completed_count,
                "steps_skipped": skipped_count,
                "alerts_triggered": warning_count,
                "average_confidence": avg_confidence
            },
            "events_timeline": events,
            "alerts": alerts
        }

report_service = ReportService()
