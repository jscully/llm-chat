from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import logging

# Import from models package
from models import (
    Message, 
    Conversation, 
    MessageRole, 
    SendMessageRequest,
    SendMessageResponse,
    GetConversationResponse,
    ListConversationsResponse
)
# Import from services package
from services import get_storage_instance, get_llm_service

logger = logging.getLogger(__name__)

# Create router for chat endpoints
router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/send", response_model=SendMessageResponse)
async def send_message(request: SendMessageRequest):
    """
    Send a message and get an AI response.
    Creates a new conversation if conversation_id is not provided.
    """
    try:
        storage = get_storage_instance()
        llm_service = get_llm_service()
        
        # Get or create conversation
        if request.conversation_id:
            conversation = storage.get_conversation(request.conversation_id)
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            conversation = storage.create_conversation()
        
        # Create user message
        user_message = Message(
            role=MessageRole.USER,
            content=request.content,
            metadata=request.metadata
        )
        
        # Add user message to conversation
        storage.add_message_to_conversation(conversation.id, user_message)
        
        # Generate AI response
        ai_response_content = await llm_service.generate_response(conversation, user_message)
        
        # Create AI message
        ai_message = Message(
            role=MessageRole.ASSISTANT,
            content=ai_response_content
        )
        
        # Add AI message to conversation
        storage.add_message_to_conversation(conversation.id, ai_message)
        
        logger.info(f"Processed message exchange in conversation {conversation.id}")
        
        return SendMessageResponse(
            message=user_message,
            conversation_id=conversation.id,
            assistant_response=ai_message
        )
        
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/conversations", response_model=ListConversationsResponse)
async def list_conversations(limit: int = 50, offset: int = 0):
    """
    List all conversations with pagination.
    """
    try:
        storage = get_storage_instance()
        conversations = storage.list_conversations(limit=limit, offset=offset)
        total = storage.get_conversation_count()
        
        return ListConversationsResponse(
            conversations=conversations,
            total=total
        )
        
    except Exception as e:
        logger.error(f"Error listing conversations: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/conversations/{conversation_id}", response_model=GetConversationResponse)
async def get_conversation(conversation_id: str):
    """
    Get a specific conversation by ID.
    """
    try:
        storage = get_storage_instance()
        conversation = storage.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return GetConversationResponse(conversation=conversation)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversation: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """
    Delete a conversation.
    """
    try:
        storage = get_storage_instance()
        success = storage.delete_conversation(conversation_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {"message": "Conversation deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting conversation: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/conversations", response_model=GetConversationResponse)
async def create_conversation(title: Optional[str] = None):
    """
    Create a new conversation.
    """
    try:
        storage = get_storage_instance()
        conversation = storage.create_conversation(title=title)
        
        return GetConversationResponse(conversation=conversation)
        
    except Exception as e:
        logger.error(f"Error creating conversation: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(conversation_id: str):
    """
    Get all messages from a conversation.
    """
    try:
        storage = get_storage_instance()
        conversation = storage.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {"messages": conversation.messages}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversation messages: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")