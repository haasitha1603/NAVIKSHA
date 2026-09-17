import time
from typing import Optional, Dict

class VoiceService:
    """Voice alert manager handling local TTS speech synthesis queuing and cooldown suppression."""

    def __init__(self, cooldown_seconds: float = 3.0):
        self.cooldown_seconds = cooldown_seconds
        self.last_speech_time = 0.0
        self.last_speech_text: Optional[str] = None

    def should_speak(self, text: str) -> bool:
        now = time.time()
        if text == self.last_speech_text and (now - self.last_speech_time) < self.cooldown_seconds * 2:
            return False
        if (now - self.last_speech_time) < self.cooldown_seconds:
            return False
        self.last_speech_time = now
        self.last_speech_text = text
        return True

voice_service = VoiceService()
