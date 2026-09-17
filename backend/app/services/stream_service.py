import time
from typing import Optional

class StreamService:
    """Optional local network IP video streaming service (MJPEG/RTSP output)."""

    def __init__(self):
        self.is_streaming = False
        self.destination_ip = "127.0.0.1"
        self.destination_port = 8554

    def start_stream(self, ip: str, port: int) -> bool:
        self.destination_ip = ip
        self.destination_port = port
        self.is_streaming = True
        return True

    def stop_stream(self) -> bool:
        self.is_streaming = False
        return True

stream_service = StreamService()
