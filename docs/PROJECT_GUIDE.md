# NAVIKSHA Project Guide

## 1. What NAVIKSHA Is

NAVIKSHA stands for **Next-generation Autonomous Vision Intelligence and Knowledge System for Human Activity Assurance**. It is an offline-first assistant for astronauts or operators performing predefined scientific procedures.

The system watches a local video source, infers the operator's current activity, compares that activity with an experiment protocol, warns about skipped or unexpected steps, and stores a structured mission record.

NAVIKSHA is designed to run without cloud API keys. It does **not** currently use an LLM or an ASR engine. Voice output is local browser speech synthesis, while the active perception model is the `baseline-perception-v1` adapter.

## 2. Main User Workflow

1. The user opens the React mission console.
2. The frontend requests available protocols and dataset videos from the FastAPI backend.
3. The user starts a session by selecting a protocol, input source, and perception model.
4. The backend creates a SQLite session record and returns a session ID.
5. The frontend connects to `/ws/sessions/{session_id}`.
6. The backend reads frames from a webcam, video file, dataset clip, or synthetic demo feed.
7. The perception adapter returns detections, keypoints, an activity label, confidence, and hand/component interaction flags.
8. The protocol engine debounces observations and compares them with the expected protocol step.
9. The backend emits live frames, telemetry, events, alerts, and progress through the WebSocket.
10. Events and alerts are saved to SQLite and can later be viewed, reported, or exported.

## 3. System Architecture

```text
Camera / Video File / Synthetic Feed
        |
        v
VideoService (OpenCV frame input)
        |
        v
PerceptionEngine (baseline color and spatial rules)
        |
        v
Activity + Interaction Observation
        |
        v
ProtocolEngine (debounce, expected-step matching,
                skipped-step and out-of-sequence detection)
        |
        +--> Alert and recovery instruction
        +--> Local browser Web Speech API voice cue
        +--> SQLite event and alert records
        |
        v
FastAPI REST + WebSocket API
        |
        v
React/Vite mission control interface
```

## 4. Repository Layout

### Root folders

- `backend/`: Python FastAPI application, database layer, services, schemas, and backend tests.
- `frontend/`: React/Vite application used as the mission control console.
- `protocols/`: Protocol definitions used by the application, including the ColorSort-Rack demo.
- `config/`: Labels, thresholds, and general configuration files.
- `data/`: Raw, processed, sample, and annotation data.
- `dataset/`: Local video dataset files used by dataset sessions.
- `ml/`: Experimental or planned training, preprocessing, and inference modules.
- `models/`: Local model storage area.
- `simulation/`: Camera, sensor, activity, event, and edge-pipeline simulators.
- `storage/`: Runtime database, recordings, logs, evidence, reports, and generated video files.
- `docs/`: Architecture, research, testing, limitations, demo, and API documentation.
- `tests/`: Integration, frontend, ML, simulation, and end-to-end tests.

## 5. Backend

The backend is a Python 3.10+ FastAPI service started from `backend/app/main.py`.

### Application entry point

`app.main` creates the FastAPI application, configures permissive CORS for the local demo, initializes the database at startup, registers API routers, exposes health/status endpoints, and owns the live session WebSocket.

Run it from `backend/`:

```bash
uvicorn app.main:app --reload --port 8000
```

### REST API areas

The experiment routes in `backend/app/api/routes_experiments.py` provide:

- `GET /api/dataset/videos`: list local dataset videos.
- `GET /api/protocols`: list available protocols.
- `GET /api/protocols/{protocol_id}`: load one protocol.
- `POST /api/sessions`: create a session.
- `GET /api/sessions`: list stored sessions.
- `GET /api/sessions/{session_id}`: retrieve one session.

The report routes in `backend/app/api/routes_reports.py` provide:

- `GET /api/sessions/{session_id}/events`: retrieve session events.
- `GET /api/sessions/{session_id}/alerts`: retrieve session alerts.
- `GET /api/sessions/{session_id}/report`: build a summary report.
- `GET /api/sessions/{session_id}/export/{format_type}`: export JSON, CSV, or TXT logs.

Additional health endpoints include:

- `GET /api/health`: service health and offline-mode status.
- `GET /api/system/status`: database, voice, and active baseline model status.

### Live WebSocket processing

The endpoint `/ws/sessions/{session_id}` performs the real-time loop:

1. Load the session and its protocol.
2. Construct a `VideoService` for the selected input source.
3. Construct a `PerceptionEngine` using the session model ID.
4. Construct a `ProtocolEngine` using the loaded protocol.
5. Read frames continuously.
6. Analyze each frame and pass the predicted activity to the protocol engine.
7. Save generated events and alerts.
8. Encode frames as base64 JPEG data and send live state to the frontend.

### Video service

`backend/app/services/video_service.py` supports:

- `sample`: generated synthetic payload-rack frames for demos.
- `camera`: a local webcam through OpenCV.
- `file`: a local video file.
- `dataset`: a video selected from the dataset directory.

The synthetic feed animates the component and hand through the same broad sequence used by the demonstration protocol, which makes the application usable without camera hardware.

### Perception service

`backend/app/services/inference_service.py` contains `PerceptionEngine`, currently identified as `baseline-perception-v1`.

The implementation currently uses OpenCV HSV color masks, contour detection, fixed rack/slot geometry, and a frame-cycle activity map. It produces:

- Component, hand, rack, and target-slot detections.
- Basic wrist and index-tip keypoints for detected hand regions.
- Activity labels such as `PREPARE`, `IDENTIFY`, `REACH`, `GRASP`, `MOVE`, `PLACE`, `VERIFY`, `RETURN`, and `COMPLETE`.
- Confidence scores.
- Interaction flags such as hand-near-component, holding-component, and component-in-target.

The architecture and UI refer to MediaPipe and modular model adapters, but the current baseline code path is primarily OpenCV and deterministic spatial logic. The `ml/` and `models/` folders provide room for trained models and future adapters.

### Protocol engine

`backend/app/services/sequence_service.py` contains `ProtocolEngine`. It is the main decision-making component for procedure compliance.

It tracks the current step, completed steps, skipped steps, status, and completion percentage. It also:

- Ignores observations below the configured confidence threshold.
- Debounces repeated activity labels before accepting them.
- Completes a step when the observed activity matches the expected activity.
- Marks intermediate steps as skipped when a future step is observed.
- Creates warning alerts for skipped steps.
- Creates informational alerts for unexpected out-of-sequence activities.
- Produces recovery instructions from the protocol definition.

### Voice service

`backend/app/services/voice_service.py` handles cooldown and duplicate suppression for voice alerts. The actual speech synthesis is performed by the frontend using the browser's local Web Speech API. There is no speech-to-text or ASR integration.

### Data and database layer

`backend/app/models/entities.py` defines the SQLite entities:

- `sessions`: experiment, protocol, model, input source, status, and progress.
- `events`: completed, skipped, unexpected, and completed-experiment events.
- `alerts`: warning or informational messages, voice text, and acknowledgement state.

`backend/app/config.py` defines runtime paths and creates required storage directories. The default database is `storage/naviksha.db`.

## 6. Protocols

Protocols are structured JSON files. The demo protocol is `protocols/color-sort-rack.json`.

Each step includes:

- A stable step ID and order.
- Human-readable name and description.
- Expected activity.
- Required objects and target region.
- Completion condition.
- Recovery instruction.
- Timeout and severity.

The demo contains nine stages:

1. Prepare workspace.
2. Identify the component.
3. Reach for it.
4. Pick it up.
5. Move it to the rack.
6. Place it in the target slot.
7. Verify placement.
8. Return to neutral.
9. Complete the experiment.

Protocol loading and validation are handled by `backend/app/protocols/loader.py` and the protocol schemas under `backend/app/schemas/`.

## 7. Frontend

The frontend is a React 18 and Vite application. Start it from `frontend/`:

```bash
npm install
npm run dev
```

The development server normally runs at `http://localhost:5173` and calls the backend at port `8000`.

Routes are registered in `frontend/src/App.jsx`:

- `/`: landing page and entry point.
- `/console`: live mission console.
- `/protocols`: protocol designer.
- `/replay`: historical session and event replay.
- `/reports`: reports and compliance summaries.
- `/models`: model and dataset status.
- `/settings`: application settings.

The frontend uses React Router, Tailwind CSS, Lucide icons, Recharts, and Framer Motion. The live console displays the video stream, detection overlays, protocol progress, next recommended action, alerts, and local voice cues.

## 8. ML, Simulation, and Data Folders

The `ml/` directory contains preprocessing, training, evaluation, metrics, visualization, and model inference modules. These modules support the intended evolution from deterministic baselines to trained perception and temporal models, but the currently wired demo path uses the backend baseline perception adapter.

The `simulation/` directory can generate activity streams, sensor data, camera feeds, events, and edge-processing pipeline behavior for development and testing.

The `data/` and `dataset/` directories hold sample data, annotations, processed assets, and local video clips. Large or runtime-generated files should remain outside source-code modules.

## 9. Testing

Backend tests are under `backend/tests/`. Repository-level tests are under `tests/`, organized by backend, frontend, integration, ML, and simulation concerns.

The protocol state machine can be exercised directly with:

```bash
python backend/tests/test_sequence_service.py
```

For the frontend, available package scripts include:

```bash
npm run build
npm run lint
```

Run frontend commands from `frontend/`.

## 10. Local Development Checklist

1. Install Python 3.10+ and Node.js 18+.
2. Install backend packages with `pip install -r backend/requirements.txt`.
3. Install frontend packages with `npm install` from `frontend/`.
4. Start FastAPI on port `8000`.
5. Start Vite on port `5173`.
6. Open `http://localhost:5173`.
7. Use the sample input first to verify the complete demo without a camera.
8. Inspect `/api/health` and `/api/system/status` when diagnosing startup problems.
9. Check `storage/naviksha.db`, `storage/logs/`, and `storage/reports/` for generated runtime output.

## 11. Current Scope and Limitations

- There is no LLM integration.
- There is no ASR or speech-to-text integration.
- The active perception implementation is a deterministic baseline, not a production-trained detector.
- Some architecture and UI language describes MediaPipe, TensorRT, or neural models that are not the active backend execution path.
- The system is intended for local demonstrations and protocol-validation workflows; production deployment would require stronger perception models, camera calibration, authentication, authorization, secure CORS, and operational monitoring.
