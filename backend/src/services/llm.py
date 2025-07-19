from typing import List, Dict, Any
import random
import asyncio
import logging

# Import models directly to avoid circular imports
from models.chat import Message, MessageRole, Conversation

logger = logging.getLogger(__name__)

class MockLLMService:
    """
    Mock LLM service that generates fake responses.
    This will be replaced with actual LLM integration later.
    """
    
    def __init__(self):
        self.mock_responses = [
            "That's an interesting question! Let me think about that.",
            "I understand what you're asking. Here's my perspective on that topic.",
            "That's a great point. I'd be happy to help you with that.",
            "I can definitely assist you with that. Let me provide some information.",
            "That's a thoughtful question. Here's what I think about it.",
            "I appreciate you asking that. Let me share some insights.",
            "That's something I can help with. Here's my response.",
            "Thanks for the question! I'll do my best to provide a helpful answer.",
            "I see what you're getting at. Let me elaborate on that topic.",
            "That's an excellent question. Here's how I would approach it.",
        ]
        
        # Context-aware responses
        self.context_responses = {
            "hello": "Hello! How can I help you today?",
            "hi": "Hi there! What can I assist you with?",
            "how are you": "I'm doing well, thank you for asking! How can I help you?",
            "what is your name": "I'm a helpful AI assistant. What would you like to know?",
            "thanks": "You're welcome! Is there anything else I can help you with?",
            "thank you": "You're very welcome! Feel free to ask if you need more help.",
            "bye": "Goodbye! Have a great day!",
            "goodbye": "Goodbye! Feel free to come back anytime.",
        }
    
    async def generate_response(self, conversation: Conversation, user_message: Message) -> str:
        """
        Generate a mock response based on the user's message and conversation history.
        This simulates an LLM processing time and response generation.
        """
        logger.info(f"Generating response for message: {user_message.content[:50]}...")
        
        # Simulate processing time
        await asyncio.sleep(random.uniform(0.5, 2.0))
        
        user_content = user_message.content.lower().strip()
        
        # Check for context-aware responses
        for key, response in self.context_responses.items():
            if key in user_content:
                return response
        
        # Special responses based on content
        if "?" in user_message.content:
            response = random.choice([
                "That's a great question! " + random.choice(self.mock_responses),
                "Let me think about that question. " + random.choice(self.mock_responses),
                "I'd be happy to answer that. " + random.choice(self.mock_responses),
            ])
        elif len(user_message.content) > 100:
            response = "I can see you've provided a lot of detail. " + random.choice(self.mock_responses)
        elif len(conversation.messages) > 5:
            response = "I notice we've been chatting for a while. " + random.choice(self.mock_responses)
        else:
            response = random.choice(self.mock_responses)
        
        logger.info(f"Generated response: {response[:50]}...")
        return response
    
    async def generate_conversation_title(self, first_message: str) -> str:
        """Generate a title for the conversation based on the first message"""
        # Simple title generation logic
        if len(first_message) <= 30:
            return first_message
        else:
            return first_message[:30] + "..."

# Create global LLM service instance
llm_service = MockLLMService()

# Future LLM integration helper functions
def get_llm_service():
    """
    Get the LLM service instance. In the future, this could return
    a real LLM service instance instead of the mock service.
    """
    return llm_service

async def integrate_real_llm():
    """
    Placeholder for future LLM integration.
    This function will handle setting up connection to DeepSeek, Ollama, etc.
    """
    pass