from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: MessageRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Conversation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: Optional[str] = None
    messages: List[Message] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
    
    def add_message(self, message: Message) -> None:
        """Add a message to the conversation and update timestamp"""
        self.messages.append(message)
        self.updated_at = datetime.utcnow()
        
        # Auto-generate title from first user message if not set
        if not self.title and message.role == MessageRole.USER and len(self.messages) <= 2:
            self.title = message.content[:50] + "..." if len(message.content) > 50 else message.content

# Request/Response Models for API
class SendMessageRequest(BaseModel):
    content: str
    conversation_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class SendMessageResponse(BaseModel):
    message: Message
    conversation_id: str
    assistant_response: Message

class GetConversationResponse(BaseModel):
    conversation: Conversation

class ListConversationsResponse(BaseModel):
    conversations: List[Conversation]
    total: int
