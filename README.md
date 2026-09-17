# NAVIKSHA

> **NAVIKSHA — Next-generation Autonomous Vision Intelligence and Knowledge System for Human Activity Assurance**

Offline AI-powered Human Activity Recognition and Experiment Protocol Validation System for On-Board BAS & Space Experiments (SIH26174).

---

## Executive Summary
NAVIKSHA is an offline edge-native AI platform engineered for astronauts performing predefined scientific experiments in bandwidth-constrained space environments. By continuously observing experiment video feeds locally, NAVIKSHA tracks physical activities and hand-object interactions, validates procedural steps against configurable experiment protocols, alerts astronauts about skipped or out-of-sequence actions, provides local voice guidance, and logs structured mission records without requiring cloud connectivity.

---

## Key System Features
- **Monospace Responsive ASCII Art Hero Landing Page:** Visually stunning aerospace mission console aesthetics with dark space theme.
- **Real-Time Video Perception Engine:** Frame ingestion from local webcams, uploaded videos, or an animated high-tech synthetic payload rack feed (for instant demo without camera hardware).
- **Modular Perception Adapters:** Object bounding box tracking for hands, components, payload racks, and target slots alongside MediaPipe hand keypoints.
- **Protocol State Machine Engine:** Tracks expected procedure steps (`ColorSort-Rack Experiment`), detects skipped steps or out-of-order actions, generates recovery guides, and calculates progress percentages.
- **Local Voice Alert Synthesis:** Offline text-to-speech voice alerts using Web Speech API with alert suppression and cooldown logic.
- **Structured Mission Records & Logs:** Local SQLite database persistence and multi-format export (JSON, JSONL, CSV, and structured TXT log summaries).
- **Protocol Designer:** Visual builder to create, edit, import, and export custom experiment protocol JSON files.
- **Model & Dataset Manager:** Clear baseline indicators and dataset upload readiness dashboard.

---

## Tech Stack

### Backend (Python)
- **Framework:** Python 3.10+, FastAPI, Uvicorn, SQLAlchemy, Pydantic v2
- **Computer Vision:** OpenCV, NumPy, MediaPipe
- **Database:** SQLite (`storage/naviksha.db`)

### Frontend (React)
- **Framework:** React 18, Vite, Tailwind CSS
- **UI Components:** Lucide React icons, Recharts, Framer Motion

---

## Project Directory Structure

```text
NAVIKSHA/
├── backend/
│   ├── app/
│   │   ├── api/             # REST endpoints (experiments, reports)
│   │   ├── models/          # SQLite database entities
│   │   ├── protocols/       # Protocol JSON loader & samples
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Video, perception, state machine, logging, voice
│   │   ├── config.py        # Settings & storage paths
│   │   └── main.py          # FastAPI server & WebSocket endpoint
│   ├── tests/               # Standalone unit test suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # AsciiMissionArt, Header, overlays
│   │   ├── pages/           # LandingPage, MissionConsole, ProtocolDesigner, etc.
│   │   ├── App.jsx          # React Router setup
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── protocols/
│   └── color-sort-rack.json # Demonstration protocol
├── storage/
│   ├── recordings/
│   ├── logs/
│   └── reports/
├── docs/
│   ├── architecture.md      # Full technical architecture breakdown
│   └── demo_script.md       # Hackathon judge presentation guide
└── README.md
```

---

## Quick Start & Running Locally

### 1. Prerequisites
- Python 3.10 or higher
- Node.js 18+ & npm

### 2. Backend Setup & Startup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI Uvicorn Server (Port 8000)
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup & Startup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server (Port 5173)
npm run dev
```

### 4. Access the Application
Open your browser and navigate to:
**`http://localhost:5173`**

---

## Running Automated Tests
To run the Protocol State Machine unit test suite:
```bash
python backend/tests/test_sequence_service.py
```

---

## License
Developed for Smart India Hackathon (SIH26174) by Team NAVIKSHA.