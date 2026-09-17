# NAVIKSHA Hackathon Presentation & Demonstration Script

## Objective
Demonstrate NAVIKSHA as an offline AI experiment assurance assistant for space missions, proving real-time activity recognition, protocol validation, skipped-step detection, local voice guidance, and structured mission logging.

---

## Step-by-Step Presentation Guide

### 1. Introduction & Problem Context (1 Minute)
1. Open http://localhost:5173 on browser.
2. Present the **Landing Page**:
   - Highlight the official title: **NAVIKSHA — Next-generation Autonomous Vision Intelligence and Knowledge System for Human Activity Assurance**.
   - Point out the **Monospace Responsive ASCII Art Hero Component** illustrating an on-board space payload rack.
   - Explain the core space problem: Space missions operate with communication delays and bandwidth constraints to ground control. NAVIKSHA provides standalone edge intelligence for astronauts.

### 2. Launching Mission Console (2 Minutes)
1. Click **"Launch Mission Console"**.
2. Select **"Synthetic Rack Feed (Demo)"** or **"Local Webcam"**.
3. Click **"Start Experiment Session"**.
4. Point out the live elements on screen:
   - **Live Camera Feed Panel:** Base64 video stream with detection overlays (Cyan Box component, Astronaut Hand keypoint, BAS Payload Rack, Rack Target Slot A-1) and live FPS telemetry.
   - **Next Recommended Action Card:** Highlights current step (e.g., *Step 1: Prepare Workspace*), expected action (`PREPARE`), target region, and recovery instructions.
   - **Protocol Progress Timeline:** Live completion percentage bar (e.g. 11.1% → 22.2% → 33.3%).

### 3. Demonstrating Skipped-Step Deviation & Local Voice Alert (2 Minutes)
1. As the synthetic feed or webcam moves through the experiment, observe when an unexpected or skipped action occurs.
2. Observe the **Alert Center**:
   - Amber warning banner pops up: `Procedure violation! Step 3 (Reach for Component) was skipped.`
   - Browser Web Speech API speaks voice guidance: *"Warning: Step 3, Reach for Component, was skipped. Reach your primary hand toward the target component in tray."*
3. Show that NAVIKSHA automatically updates the protocol state to `RECOVERY_REQUIRED` and provides clear astronaut instructions.

### 4. Exporting Structured Mission Records (1 Minute)
1. Click **"Stop Session"** or wait for experiment completion.
2. Click **"JSON"**, **"CSV"**, or **"TXT Log"** export buttons.
3. Open the downloaded `.txt` mission log and show the judges the timestamped event timeline:
   ```text
   ========================================================================
           NAVIKSHA — EXPERIMENT EXECUTION & ASSURANCE MISSION LOG         
   ========================================================================
   Session ID       : sess-a1b2c3d4
   Protocol ID      : color-sort-rack-v1
   Completion       : 100.0%
   ========================================================================
   CHRONOLOGICAL EVENT STREAM:
   [2026-09-17T19:20:00Z] [STEP_COMPLETED       ] Completed Step 1: Prepare Workspace.
   [2026-09-17T19:20:05Z] [STEP_SKIPPED         ] Skipped Step 2: Identify Component.
      └─ RECOVERY GUIDE: Position yourself and face source tray.
   ```

### 5. Custom Protocol Designer & Model Registry (1 Minute)
1. Navigate to **Protocol Designer**: Show how space experiment administrators can create custom steps, edit recovery guides, and export JSON definitions for any scientific experiment.
2. Navigate to **Models & Data**: Point out the loaded Baseline Perception Adapter and explain that once custom dataset videos are uploaded tonight, custom model weights can be registered seamlessly.
