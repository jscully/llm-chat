import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { User, Bot, Loader } from 'lucide-react';
import { Message } from '../../api';
import { Avatar, EmptyState, EmptyContent, EmptyIcon, EmptyTitle, EmptyText }  from '../common/styled';

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

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  emptyTitle?: string;
  emptyText?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  emptyTitle = 'How can I help?',
  emptyText = 'Type a message below to begin the conversation.',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (messages.length === 0 && !loading) {
    return (
      <MessagesContainer>
        <EmptyState>
          <EmptyContent>
            <EmptyIcon>
              <Bot size={24} color="#999" />
            </EmptyIcon>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyText>{emptyText}</EmptyText>
          </EmptyContent>
        </EmptyState>
      </MessagesContainer>
    );
  }

  return (
    <MessagesContainer>
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
      <div ref={messagesEndRef} />
    </MessagesContainer>
  );
};

export default MessageList;