from pydantic import BaseSettings
from typing import List

class Settings(BaseSettings):
    api_title: str = "LLM Chat API"
    api_version: str = "1.0.0"
    
    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = True
    
    allowed_origins: List[str] = ["http://localhost:3000"]
    
    llm_model: str = "mock"  # Will be changed to actual model later
    max_tokens: int = 1000
    temperature: float = 0.7
    
    class Config:
        env_file = ".env"

settings = Settings()