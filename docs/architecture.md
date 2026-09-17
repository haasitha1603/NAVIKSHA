# NAVIKSHA System Architecture

## Overview
**NAVIKSHA** (*Next-generation Autonomous Vision Intelligence and Knowledge System for Human Activity Assurance*) is an edge-native, offline-first AI platform engineered to assist astronauts during scientific experiments on space stations (e.g. BAS / lunar missions).

```text
Local Video / Camera / Synthetic Feed
        ↓
OpenCV & MediaPipe Baseline Perception Engine
(Object Detection, Pose Skeleton Keypoints, Hand-Object Proximity)
        ↓
Temporal Activity Inference
        ↓
Protocol State Machine Engine
(Expected Step Matching, Skipped Step Detection, Deviation Flagging)
        ↓
Local Web Speech API / TTS Voice Alert Synthesis
        ↓
Structured Event Logger & SQLite Session Storage
(JSON, JSONL, CSV, TXT Summaries)
        ↓
React + Vite Aerospace Mission Control Console
```

---

## 1. Frontend Architecture (`frontend/src/`)
- **Framework:** React 18, Vite, Tailwind CSS, Lucide React icons, Recharts, Framer Motion.
- **Key Modules:**
  - `LandingPage.jsx`: Aerospace branding, responsive monospace ASCII Art hero, system feature cards, launch console trigger.
  - `MissionConsole.jsx`: Real-time operating dashboard featuring live base64 JPEG video canvas stream with SVG keypoint overlays, protocol timeline progress bar, next recommended astronaut action card, alert center, Web Speech API local voice alert synth, and structured log export buttons.
  - `ProtocolDesigner.jsx`: Step builder for creating, customizing, reordering, and exporting protocol JSON definitions.
  - `Replay.jsx`: Historical session browser and event timeline viewer.
  - `Reports.jsx`: Summary reports and compliance audit metrics.
  - `ModelManagement.jsx`: Baseline perception indicators and custom dataset upload readiness dashboard.

---

## 2. Backend Architecture (`backend/app/`)
- **Framework:** Python 3.10+, FastAPI, Uvicorn, SQLAlchemy, Pydantic v2.
- **Core Components:**
  - `services/video_service.py`: OpenCV frame reader supporting local webcam, uploaded video files, and high-tech synthetic payload rack camera feed (for 100% out-of-the-box demo without hardware camera).
  - `services/inference_service.py`: Modular baseline perception adapter generating bounding boxes for component, astronaut hand, payload rack, and target slots alongside MediaPipe hand keypoints.
  - `services/sequence_service.py`: Standalone Protocol State Machine tracking step order, debouncing observations, detecting skipped steps or out-of-sequence actions, generating recovery guides, and outputting alerts.
  - `services/voice_service.py`: Offline voice alert queue manager with cooldown suppression.
  - `services/logging_service.py`: Export engine producing structured JSON, CSV, and formatted TXT mission logs.
  - `main.py`: FastAPI server with WebSockets endpoint (`/ws/sessions/{session_id}`) pushing live 20 FPS video frames, activity predictions, step transitions, alerts, and system telemetry to the UI.

---

## 3. Data Contracts & Database Schema
- **Database:** SQLite (`storage/naviksha.db`).
- **Tables:**
  - `sessions`: Session ID, protocol ID, model ID, started/ended timestamp, completion percentage, status.
  - `events`: Event ID, session ID, video timestamp, event type (`STEP_COMPLETED`, `STEP_SKIPPED`, `OUT_OF_SEQUENCE`, `EXPERIMENT_COMPLETED`), step name, expected/observed action, confidence, recovery instruction.
  - `alerts`: Alert ID, session ID, timestamp, severity, message, voice message, status.

---

## 4. Offline Execution Guarantee
NAVIKSHA requires **zero cloud API keys** (no OpenAI, Gemini, Supabase, or external speech APIs required at runtime). All computer vision processing, state machine validation, database writes, and voice output run 100% locally on standard PC hardware.
