import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "NAVIKSHA"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Storage Paths
    BASE_DIR: Path = BASE_DIR
    STORAGE_DIR: Path = BASE_DIR / "storage"
    RECORDINGS_DIR: Path = STORAGE_DIR / "recordings"
    LOGS_DIR: Path = STORAGE_DIR / "logs"
    REPORTS_DIR: Path = STORAGE_DIR / "reports"
    PROTOCOLS_DIR: Path = BASE_DIR / "protocols"
    MODELS_DIR: Path = BASE_DIR / "models"
    DATASET_DIR: Path = BASE_DIR / "dataset"
    
    # SQLite DB Path
    DATABASE_URL: str = f"sqlite:///{STORAGE_DIR}/naviksha.db"
    
    # Inference defaults
    DEFAULT_CONFIDENCE_THRESHOLD: float = 0.65
    DEBOUNCE_FRAMES: int = 5
    
    # Stream defaults
    DEFAULT_STREAM_HOST: str = "127.0.0.1"
    DEFAULT_STREAM_PORT: int = 8554

    class Config:
        case_sensitive = True

settings = Settings()

# Ensure directories exist
for folder in [settings.STORAGE_DIR, settings.RECORDINGS_DIR, settings.LOGS_DIR, settings.REPORTS_DIR, settings.PROTOCOLS_DIR, settings.MODELS_DIR, settings.DATASET_DIR]:
    folder.mkdir(parents=True, exist_ok=True)
