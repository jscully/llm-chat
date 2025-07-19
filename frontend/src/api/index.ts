const API_URL = 'http://localhost:8000';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface SendMessageResponse {
  message: Message;
  conversation_id: string;
  assistant_response: Message;
}

export const sendMessage = async (content: string, conversationId?: string): Promise<SendMessageResponse> => {
  const response = await fetch(`${API_URL}/api/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      conversation_id: conversationId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
};

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await fetch(`${API_URL}/api/chat/conversations`);
  
  if (!response.ok) {
    throw new Error('Failed to get conversations');
  }

  const data = await response.json();
  return data.conversations;
};

export const getConversation = async (conversationId: string): Promise<Conversation> => {
  const response = await fetch(`${API_URL}/api/chat/conversations/${conversationId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get conversation');
  }

  const data = await response.json();
  return data.conversation;
};

export const createConversation = async (title?: string): Promise<Conversation> => {
  const response = await fetch(`${API_URL}/api/chat/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }

  const data = await response.json();
  return data.conversation;
};

export const healthCheck = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error('Health check failed');
  }
};