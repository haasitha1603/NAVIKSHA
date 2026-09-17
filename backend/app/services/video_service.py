import cv2
import time
import os
import numpy as np
from pathlib import Path
from typing import Optional, Generator, Tuple
from app.config import settings

class VideoService:
    def __init__(self, source_type: str = "sample", file_path: Optional[str] = None, camera_id: int = 0):
        self.source_type = source_type
        self.file_path = file_path
        self.camera_id = camera_id
        self.cap: Optional[cv2.VideoCapture] = None
        self.frame_count = 0
        self.is_running = False

    def start(self):
        if self.source_type == "camera":
            self.cap = cv2.VideoCapture(self.camera_id)
        elif self.source_type in ["file", "dataset"] or (self.file_path and os.path.exists(self.file_path)):
            target_path = self.file_path
            if not target_path or not os.path.exists(target_path):
                # Fallback to first video in dataset directory if available
                ds_dir = settings.BASE_DIR / "dataset"
                vids = [f for f in ds_dir.iterdir() if f.suffix.lower() == ".mp4"]
                if vids:
                    target_path = str(vids[0])

            if target_path:
                self.cap = cv2.VideoCapture(target_path)
                self.source_type = "file"

        self.is_running = True
        self.frame_count = 0

    def stop(self):
        self.is_running = False
        if self.cap and self.cap.isOpened():
            self.cap.release()
        self.cap = None

    def generate_synthetic_frame(self, frame_num: int) -> np.ndarray:
        """Generates an animated high-tech NASA payload rack synthetic camera feed for instant demo."""
        img = np.zeros((480, 640, 3), dtype=np.uint8)
        img[:] = (15, 20, 28)
        
        cv2.rectangle(img, (80, 60), (560, 420), (60, 80, 110), 3)
        cv2.rectangle(img, (85, 65), (555, 415), (30, 40, 55), -1)
        
        cv2.rectangle(img, (360, 140), (500, 260), (0, 180, 220), 2)
        cv2.putText(img, "RACK TARGET SLOT A-1", (365, 130), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 220, 255), 1)

        cv2.rectangle(img, (120, 280), (260, 380), (120, 100, 40), 2)
        cv2.putText(img, "SOURCE TRAY", (125, 270), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (160, 140, 60), 1)

        cycle = (frame_num // 20) % 9
        
        if cycle in [0, 1]:
            comp_pos = (190, 330)
            hand_pos = (190, 410)
        elif cycle == 2:
            comp_pos = (190, 330)
            hand_pos = (190, 360)
        elif cycle == 3:
            comp_pos = (190, 330)
            hand_pos = (190, 330)
        elif cycle == 4:
            progress = ((frame_num % 20) / 20.0)
            cx = int(190 + (430 - 190) * progress)
            cy = int(330 + (200 - 330) * progress)
            comp_pos = (cx, cy)
            hand_pos = (cx, cy)
        elif cycle in [5, 6]:
            comp_pos = (430, 200)
            hand_pos = (430, 200)
        else:
            comp_pos = (430, 200)
            hand_pos = (300, 420)

        cv2.rectangle(img, (comp_pos[0]-25, comp_pos[1]-25), (comp_pos[0]+25, comp_pos[1]+25), (0, 200, 100), -1)
        cv2.rectangle(img, (comp_pos[0]-25, comp_pos[1]-25), (comp_pos[0]+25, comp_pos[1]+25), (255, 255, 255), 1)
        cv2.putText(img, "BOX-CYAN", (comp_pos[0]-22, comp_pos[1]+5), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 0), 1)

        cv2.circle(img, hand_pos, 12, (255, 120, 0), -1)
        cv2.circle(img, hand_pos, 18, (255, 200, 50), 2)
        cv2.line(img, (hand_pos[0], hand_pos[1]+18), (hand_pos[0], 480), (255, 120, 0), 2)

        cv2.putText(img, f"NAVIKSHA EDGE CAM - FRAME {frame_num:05d}", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 200), 1)
        return img

    def get_frame(self) -> Tuple[bool, Optional[np.ndarray], float]:
        self.frame_count += 1
        video_time = self.frame_count * 0.05

        if self.source_type == "sample":
            time.sleep(0.05)
            frame = self.generate_synthetic_frame(self.frame_count)
            return True, frame, video_time

        if self.cap and self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                # Loop dataset video file if ended
                if self.source_type == "file":
                    self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    ret, frame = self.cap.read()
            if ret and frame is not None:
                # Resize large HD/4K WhatsApp dataset videos for fast 20 FPS real-time web streaming
                h, w = frame.shape[:2]
                if w > 640 or h > 480:
                    frame = cv2.resize(frame, (640, 480))
            return ret, frame, video_time

        return False, None, 0.0
