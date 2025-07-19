from typing import Dict, List, Optional
from datetime import datetime
import logging

# Import models directly to avoid circular imports
from models.chat import Conversation, Message, MessageRole

logger = logging.getLogger(__name__)

class InMemoryStorage:
    """
    In-memory storage for conversations and messages.
    Designed to be easily replaceable with database storage later.
    """
    
    def __init__(self):
        self._conversations: Dict[str, Conversation] = {}
        logger.info("Initialized in-memory storage")
    
    def create_conversation(self, title: Optional[str] = None) -> Conversation:
        """Create a new conversation"""
        conversation = Conversation(title=title)
        self._conversations[conversation.id] = conversation
        logger.info(f"Created conversation: {conversation.id}")
        return conversation
    
    def get_conversation(self, conversation_id: str) -> Optional[Conversation]:
        """Get a conversation by ID"""
        return self._conversations.get(conversation_id)
    
    def list_conversations(self, limit: int = 50, offset: int = 0) -> List[Conversation]:
        """List all conversations with pagination"""
        conversations = list(self._conversations.values())
        # Sort by updated_at desc (most recent first)
        conversations.sort(key=lambda c: c.updated_at, reverse=True)
        return conversations[offset:offset + limit]
    
    def add_message_to_conversation(self, conversation_id: str, message: Message) -> bool:
        """Add a message to a conversation"""
        conversation = self.get_conversation(conversation_id)
        if not conversation:
            logger.warning(f"Conversation not found: {conversation_id}")
            return False
        
        conversation.add_message(message)
        logger.info(f"Added message to conversation {conversation_id}")
        return True
    
    def delete_conversation(self, conversation_id: str) -> bool:
        """Delete a conversation"""
        if conversation_id in self._conversations:
            del self._conversations[conversation_id]
            logger.info(f"Deleted conversation: {conversation_id}")
            return True
        return False
    
    def get_conversation_count(self) -> int:
        """Get total number of conversations"""
        return len(self._conversations)
    
    def clear_all(self) -> None:
        """Clear all data (useful for testing)"""
        self._conversations.clear()
        logger.info("Cleared all conversations")

# Create global storage instance
storage = InMemoryStorage()

# Future database migration helper functions
def migrate_to_database():
    """
    Placeholder for future database migration.
    This function will handle migrating in-memory data to a database.
    """
    pass

def get_storage_instance():
    """
    Get the storage instance. In the future, this could return
    a database storage instance instead of in-memory storage.
    """
    return storage