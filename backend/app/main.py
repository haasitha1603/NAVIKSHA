import asyncio
import json
import base64
import cv2
import uuid
import time
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.models.database import init_db, get_db, SessionLocal
from app.models.entities import SessionEntity, EventEntity, AlertEntity
from app.api import routes_experiments, routes_reports
from app.protocols.loader import load_protocol_from_file
from app.services.video_service import VideoService
from app.services.inference_service import PerceptionEngine
from app.services.sequence_service import ProtocolEngine
from app.services.voice_service import voice_service

app = FastAPI(
    title="NAVIKSHA API",
    description="Next-generation Autonomous Vision Intelligence and Knowledge System for Human Activity Assurance",
    version=settings.VERSION
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(routes_experiments.router, prefix="/api", tags=["Experiments"])
app.include_router(routes_reports.router, prefix="/api", tags=["Reports"])

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "offline_mode": True
    }

@app.get("/api/system/status")
def system_status():
    return {
        "status": "OPERATIONAL",
        "storage": "HEALTHY",
        "database": "CONNECTED",
        "voice_engine": "READY (WebSpeech / Local TTS)",
        "active_models": [
            {
                "id": "baseline-perception-v1",
                "name": "Baseline Perception Adapter (OpenCV + MediaPipe + Spatial Rules)",
                "status": "LOADED",
                "type": "BASELINE"
            }
        ]
    }

@app.websocket("/ws/sessions/{session_id}")
async def websocket_session_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    
    db = SessionLocal()
    try:
        sess_entity = db.query(SessionEntity).filter(SessionEntity.id == session_id).first()
        if not sess_entity:
            # Fallback mock entity for direct UI test
            protocol_id = "color-sort-rack-v1"
            input_source = "sample"
        else:
            protocol_id = sess_entity.protocol_id
            input_source = sess_entity.input_source

        # Load Protocol
        proto_file = settings.PROTOCOLS_DIR / f"{protocol_id}.json"
        if not proto_file.exists():
            proto_file = settings.PROTOCOLS_DIR / "color-sort-rack.json"
        
        protocol = load_protocol_from_file(proto_file)
        
        # Initialize Engines
        video_svc = VideoService(source_type=input_source)
        perception_eng = PerceptionEngine(model_id=sess_entity.model_id if sess_entity else "baseline-perception-v1")
        protocol_eng = ProtocolEngine(protocol=protocol, debounce_limit=2, min_confidence=0.55)

        video_svc.start()
        
        frame_idx = 0
        last_time = time.time()

        while True:
            ret, frame, video_time = video_svc.get_frame()
            if not ret or frame is None:
                await asyncio.sleep(0.05)
                continue

            frame_idx += 1
            now = time.time()
            fps = round(1.0 / max(0.001, (now - last_time)), 1)
            last_time = now

            # Perception Inference
            perception_result = perception_eng.analyze_frame(frame, frame_idx)
            act_name = perception_result["predicted_activity"]
            conf = perception_result["confidence"]

            # Protocol Engine Update
            events, alerts = protocol_eng.process_observation(
                session_id=session_id,
                observed_activity=act_name,
                confidence=conf,
                video_timestamp=video_time
            )

            # Save events to DB
            for evt in events:
                evt_db = EventEntity(
                    id=evt.id or f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    timestamp=evt.timestamp,
                    video_timestamp=evt.video_timestamp,
                    event_type=evt.event_type,
                    step_id=evt.step_id,
                    step_name=evt.step_name,
                    expected_action=evt.expected_action,
                    observed_action=evt.observed_action,
                    status=evt.status,
                    confidence=evt.confidence,
                    severity=evt.severity,
                    message=evt.message,
                    recovery_instruction=evt.recovery_instruction
                )
                db.add(evt_db)

            # Save alerts to DB
            voice_alerts_to_send = []
            for alt in alerts:
                alt_db = AlertEntity(
                    id=alt.id or f"alt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    timestamp=alt.timestamp,
                    severity=alt.severity,
                    alert_type=alt.alert_type,
                    message=alt.message,
                    voice_message=alt.voice_message,
                    acknowledged=alt.acknowledged,
                    resolved=alt.resolved
                )
                db.add(alt_db)

                if voice_service.should_speak(alt.voice_message):
                    voice_alerts_to_send.append(alt.voice_message)

            db.commit()

            # Encode frame to JPEG base64 for live video canvas streaming
            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
            frame_b64 = base64.b64encode(buffer).decode('utf-8')

            curr_step = protocol_eng.current_step
            next_step = protocol_eng.next_recommended_step

            payload = {
                "session_id": session_id,
                "frame_num": frame_idx,
                "fps": fps,
                "video_timestamp": video_time,
                "frame_b64": f"data:image/jpeg;base64,{frame_b64}",
                "perception": perception_result,
                "protocol": {
                    "status": protocol_eng.status,
                    "completion_percentage": protocol_eng.completion_percentage,
                    "current_step": curr_step.dict() if curr_step else None,
                    "next_recommended_step": next_step.dict() if next_step else None,
                    "completed_step_ids": protocol_eng.completed_step_ids,
                    "skipped_step_ids": protocol_eng.skipped_step_ids
                },
                "new_events": [e.dict() for e in events],
                "new_alerts": [a.dict() for a in alerts],
                "voice_alerts": voice_alerts_to_send
            }

            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(0.04)

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        if 'video_svc' in locals():
            video_svc.stop()
        db.close()
