import json
import csv
from pathlib import Path
from typing import List, Dict, Any
from app.config import settings

class LoggingService:
    """Manages lightweight structured logging to JSON, JSONL, CSV, and TXT files."""

    @staticmethod
    def get_session_log_path(session_id: str, extension: str) -> Path:
        return settings.LOGS_DIR / f"{session_id}.{extension}"

    def export_json(self, session_id: str, events: List[Dict[str, Any]]) -> str:
        path = self.get_session_log_path(session_id, "json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(events, f, indent=2)
        return str(path)

    def export_csv(self, session_id: str, events: List[Dict[str, Any]]) -> str:
        path = self.get_session_log_path(session_id, "csv")
        if not events:
            with open(path, "w", encoding="utf-8") as f:
                f.write("event_id,session_id,timestamp,event_type,step_name,status,message\n")
            return str(path)

        fieldnames = ["id", "session_id", "timestamp", "video_timestamp", "event_type", "step_id", "step_name", "expected_action", "observed_action", "status", "confidence", "severity", "message", "recovery_instruction"]
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(events)
        return str(path)

    def export_txt(self, session_id: str, session_data: Dict[str, Any], events: List[Dict[str, Any]]) -> str:
        path = self.get_session_log_path(session_id, "txt")
        lines = [
            "========================================================================",
            "        NAVIKSHA — EXPERIMENT EXECUTION & ASSURANCE MISSION LOG         ",
            "========================================================================",
            f"Session ID       : {session_id}",
            f"Experiment ID    : {session_data.get('experiment_id', 'N/A')}",
            f"Protocol ID      : {session_data.get('protocol_id', 'N/A')}",
            f"Started At       : {session_data.get('started_at', 'N/A')}",
            f"Ended At         : {session_data.get('ended_at', 'N/A')}",
            f"Status           : {session_data.get('status', 'N/A')}",
            f"Completion       : {session_data.get('completion_percentage', 0.0)}%",
            "========================================================================",
            "CHRONOLOGICAL EVENT STREAM:",
            "------------------------------------------------------------------------"
        ]

        for e in events:
            ts = e.get("timestamp", "")
            evt_type = e.get("event_type", "")
            msg = e.get("message", "")
            rec = e.get("recovery_instruction", None)
            lines.append(f"[{ts}] [{evt_type:<20}] {msg}")
            if rec:
                lines.append(f"   └─ RECOVERY GUIDE: {rec}")

        lines.append("========================================================================")
        lines.append("END OF NAVIKSHA MISSION RECORD")

        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        return str(path)

logging_service = LoggingService()
