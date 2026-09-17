import numpy as np
import cv2
from typing import Dict, List, Any, Tuple, Optional

class PerceptionEngine:
    """Modular Baseline Perception Engine combining Object Detection, Pose Tracking, and Hand-Object Interaction."""

    def __init__(self, model_id: str = "baseline-perception-v1"):
        self.model_id = model_id
        self.classes = ["person", "hand", "rack", "component", "target_slot"]

    def analyze_frame(self, frame: np.ndarray, frame_num: int) -> Dict[str, Any]:
        """Analyzes video frame and returns detections, pose keypoints, hand-object interaction, and predicted activity."""
        h, w, _ = frame.shape
        
        # Synthetic / Baseline heuristic extraction based on color analysis & spatial rules
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        
        # Detections list
        detections = []
        keypoints = []
        
        # Detect Component (Green/Cyan object)
        lower_green = np.array([35, 50, 50])
        upper_green = np.array([90, 255, 255])
        mask_comp = cv2.inRange(hsv, lower_green, upper_green)
        contours_comp, _ = cv2.findContours(mask_comp, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        comp_bbox = None
        if contours_comp:
            c = max(contours_comp, key=cv2.contourArea)
            if cv2.contourArea(c) > 100:
                x, y, bw, bh = cv2.boundingRect(c)
                comp_bbox = [int(x), int(y), int(bw), int(bh)]
                detections.append({
                    "id": "obj-comp-1",
                    "class_name": "component",
                    "label": "BOX-CYAN",
                    "confidence": 0.94,
                    "bbox": comp_bbox
                })

        # Detect Hand (Orange/Yellow keypoint or color mask)
        lower_hand = np.array([5, 100, 100])
        upper_hand = np.array([25, 255, 255])
        mask_hand = cv2.inRange(hsv, lower_hand, upper_hand)
        contours_hand, _ = cv2.findContours(mask_hand, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        hand_bbox = None
        if contours_hand:
            c = max(contours_hand, key=cv2.contourArea)
            if cv2.contourArea(c) > 50:
                x, y, bw, bh = cv2.boundingRect(c)
                hand_bbox = [int(x), int(y), int(bw), int(bh)]
                detections.append({
                    "id": "obj-hand-1",
                    "class_name": "hand",
                    "label": "Astronaut Hand (Right)",
                    "confidence": 0.89,
                    "bbox": hand_bbox
                })
                keypoints.append({"name": "wrist", "x": int(x + bw/2), "y": int(y + bh/2), "confidence": 0.92})
                keypoints.append({"name": "index_tip", "x": int(x + bw/2), "y": int(y), "confidence": 0.88})

        # Static Rack Detections for UI overlay
        detections.append({
            "id": "obj-rack-1",
            "class_name": "rack",
            "label": "BAS Payload Rack",
            "confidence": 0.99,
            "bbox": [80, 60, 480, 360]
        })
        detections.append({
            "id": "obj-slot-1",
            "class_name": "target_slot",
            "label": "Rack Target Slot A-1",
            "confidence": 0.95,
            "bbox": [360, 140, 140, 120]
        })

        # Activity inference rule mapping based on frame cycle
        cycle = (frame_num // 20) % 9
        activity_map = {
            0: ("PREPARE", 0.92),
            1: ("IDENTIFY", 0.88),
            2: ("REACH", 0.91),
            3: ("GRASP", 0.95),
            4: ("MOVE", 0.89),
            5: ("PLACE", 0.93),
            6: ("VERIFY", 0.87),
            7: ("RETURN", 0.90),
            8: ("COMPLETE", 0.96),
        }
        activity, confidence = activity_map.get(cycle, ("IDLE", 0.70))

        return {
            "model_id": self.model_id,
            "frame_num": frame_num,
            "predicted_activity": activity,
            "confidence": confidence,
            "detections": detections,
            "keypoints": keypoints,
            "interaction": {
                "hand_near_component": (cycle in [2, 3, 4]),
                "holding_component": (cycle in [3, 4, 5]),
                "component_in_target": (cycle in [5, 6, 7, 8])
            }
        }
