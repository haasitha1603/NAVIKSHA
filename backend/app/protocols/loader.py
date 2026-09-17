import json
import yaml
from pathlib import Path
from typing import Dict, List, Optional
from app.config import settings
from app.schemas.protocol import ProtocolSchema, ProtocolStepSchema

def load_protocol_from_file(file_path: Path) -> ProtocolSchema:
    if not file_path.exists():
        raise FileNotFoundError(f"Protocol file not found: {file_path}")
        
    with open(file_path, "r", encoding="utf-8") as f:
        if file_path.suffix in [".yaml", ".yml"]:
            data = yaml.safe_load(f)
        else:
            data = json.load(f)
            
    return ProtocolSchema(**data)

def list_available_protocols() -> List[Dict[str, str]]:
    protocols = []
    if settings.PROTOCOLS_DIR.exists():
        for p_file in settings.PROTOCOLS_DIR.glob("*.*"):
            if p_file.suffix in [".json", ".yaml", ".yml"]:
                try:
                    proto = load_protocol_from_file(p_file)
                    protocols.append({
                        "protocol_id": proto.protocol_id,
                        "name": proto.name,
                        "description": proto.description,
                        "steps_count": len(proto.steps),
                        "file_path": str(p_file)
                    })
                except Exception:
                    pass
    return protocols
