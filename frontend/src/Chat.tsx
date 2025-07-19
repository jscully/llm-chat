import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Send, User, Bot, Loader } from 'lucide-react';
import { 
  Message, 
  Conversation, 
  sendMessage, 
  getConversations, 
  getConversation, 
  createConversation 
} from './api';

import { Sidebar } from './components/sidebar/Sidebar';
import { ChatHeader } from './components/chat/ChatHeader';
import { Avatar, EmptyState, EmptyContent, EmptyIcon, EmptyTitle, EmptyText } from './components/common/styled';

// Chat-specific styled components
const Container = styled.div`
  height: 100vh;
  display: flex;
  background: #fafafa;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
`;

const MessageGroup = styled.div<{ $isUser?: boolean }>`
  padding: 16px 24px;
  background: ${props => props.$isUser ? '#f8f8f8' : 'white'};
  border-bottom: 1px solid #f0f0f0;
`;

const MessageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const MessageContent = styled.div`
  flex: 1;
`;

const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const MessageAuthor = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #666;
`;

const MessageTime = styled.span`
  font-size: 11px;
  color: #999;
`;

const MessageText = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #000;
  white-space: pre-wrap;
`;

const InputContainer = styled.div`
  background: white;
  border-top: 1px solid #e5e5e5;
  padding: 16px 20px;
`;

const InputWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
`;

const Input = styled.textarea`
  width: 100%;
  padding: 12px 48px 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  min-height: 44px;
  max-height: 120px;
  background: #fafafa;

  &:focus {
    border-color: #000;
    background: white;
  }

  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button<{ $disabled?: boolean }>`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: ${props => props.$disabled ? '#f5f5f5' : '#000'};
  color: ${props => props.$disabled ? '#ccc' : 'white'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #333;
  }
`;

const LoadingMessage = styled.div`
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
`;

const LoadingContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const LoadingText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 13px;
`;

// Mock conversations for fallback
const mockConversations: Conversation[] = [
  {
    id: 'mock-1',
    title: 'Chat 1',
    messages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Chat 2',
    messages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Chat 3',
    messages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const Chat: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const fetchedConversations = await getConversations();
        if (fetchedConversations.length > 0) {
          setConversations(fetchedConversations);
        }
      } catch (error) {
        console.error('Failed to load conversations, using mock data:', error);
      }
    };

    loadConversations();
  }, []);

  const handleConversationSelect = async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    
    try {
      const conversation = await getConversation(conversationId);
      setMessages(conversation.messages);
    } catch (error) {
      console.error('Failed to load conversation:', error);
      setMessages([]);
    }
  };

  const handleNewChat = async () => {
    try {
      const newConversation = await createConversation('New Chat');
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      // Fallback: create a mock conversation
      const mockId = `mock-${Date.now()}`;
      const mockConversation: Conversation = {
        id: mockId,
        title: 'New Chat',
        messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setConversations(prev => [mockConversation, ...prev]);
      setCurrentConversationId(mockId);
      setMessages([]);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    handleSendMessage(input.trim());
    setInput('');
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendMessage(content, currentConversationId || undefined);
      
      if (!currentConversationId) {
        setCurrentConversationId(response.conversation_id);
        // Refresh conversations list
        const fetchedConversations = await getConversations();
        setConversations(fetchedConversations);
      }

      setMessages(prev => [
        ...prev.slice(0, -1),
        response.message,
        response.assistant_response,
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const chatTitle = currentConversation?.title || 'Assistant';
  const emptyTitle = currentConversation 
    ? `Start chatting in ${currentConversation.title}` 
    : 'How can I help?';

  return (
    <Container>
      <Sidebar
        collapsed={sidebarCollapsed}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
        onNewChat={handleNewChat}
      />

      <ChatContainer>
        <ChatHeader
          title={chatTitle}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <MessagesContainer>
          {messages.length === 0 ? (
            <EmptyState>
              <EmptyContent>
                <EmptyIcon>
                  <Bot size={24} color="#999" />
                </EmptyIcon>
                <EmptyTitle>{emptyTitle}</EmptyTitle>
                <EmptyText>Type a message below to begin the conversation.</EmptyText>
              </EmptyContent>
            </EmptyState>
          ) : (
            <>
              {messages.map((message) => (
                <MessageGroup key={message.id} $isUser={message.role === 'user'}>
                  <MessageWrapper>
                    <Avatar $isUser={message.role === 'user'} size={28}>
                      {message.role === 'user' ? (
                        <User size={14} color="white" />
                      ) : (
                        <Bot size={14} color="white" />
                      )}
                    </Avatar>
                    <MessageContent>
                      <MessageMeta>
                        <MessageAuthor>
                          {message.role === 'user' ? 'You' : 'Assistant'}
                        </MessageAuthor>
                        <MessageTime>
                          {formatTime(message.timestamp)}
                        </MessageTime>
                      </MessageMeta>
                      <MessageText>{message.content}</MessageText>
                    </MessageContent>
                  </MessageWrapper>
                </MessageGroup>
              ))}
              
              {loading && (
                <LoadingMessage>
                  <LoadingContent>
                    <Avatar size={28}>
                      <Bot size={14} color="white" />
                    </Avatar>
                    <LoadingText>
                      <Loader size={12} className="animate-spin" />
                      Thinking...
                    </LoadingText>
                  </LoadingContent>
                </LoadingMessage>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          <InputWrapper>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              disabled={loading}
            />
            <SendButton 
              onClick={handleSend} 
              $disabled={!input.trim() || loading}
              disabled={!input.trim() || loading}
            >
              <Send size={12} />
            </SendButton>
          </InputWrapper>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
};

export default Chat;