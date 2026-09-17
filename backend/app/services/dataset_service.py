import os
import cv2
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.config import settings, BASE_DIR

class DatasetService:
    """Service to scan, index, and manage user-uploaded experiment dataset videos."""

    def __init__(self, dataset_dir: Optional[Path] = None):
        if dataset_dir is not None:
            self.dataset_dir = Path(dataset_dir)
        elif hasattr(settings, "DATASET_DIR") and settings.DATASET_DIR:
            self.dataset_dir = Path(settings.DATASET_DIR)
        elif hasattr(settings, "BASE_DIR") and settings.BASE_DIR:
            self.dataset_dir = Path(settings.BASE_DIR) / "dataset"
        else:
            self.dataset_dir = BASE_DIR / "dataset"

    def list_dataset_videos(self) -> List[Dict[str, Any]]:
        if not self.dataset_dir.exists():
            return []

        video_files = sorted([
            f for f in self.dataset_dir.iterdir()
            if f.is_file() and f.suffix.lower() in [".mp4", ".avi", ".mov", ".mkv"]
        ])

        results = []
        for idx, fpath in enumerate(video_files):
            size_mb = round(fpath.stat().st_size / (1024 * 1024), 2)
            results.append({
                "id": f"ds-vid-{idx+1:03d}",
                "filename": fpath.name,
                "path": str(fpath),
                "size_mb": size_mb,
                "label": f"Experiment Video #{idx+1} ({fpath.name[:25]}... - {size_mb} MB)"
            })
        return results

dataset_service = DatasetService()
