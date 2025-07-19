import React from 'react';
import styled from 'styled-components';
import { MessageCircle } from 'lucide-react';
import { Conversation } from '../../api';

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const ConversationItem = styled.div<{ $active: boolean }>`
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 2px;
  background: ${props => props.$active ? '#f0f0f0' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#e0e0e0' : 'transparent'};
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f8f8f8;
  }
`;

const ConversationIcon = styled.div`
  width: 20px;
  height: 20px;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ConversationTitle = styled.span`
  font-size: 13px;
  color: #333;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onConversationSelect: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversationId,
  onConversationSelect,
}) => {
  return (
    <ConversationsList>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          $active={conversation.id === currentConversationId}
          onClick={() => onConversationSelect(conversation.id)}
        >
          <ConversationIcon>
            <MessageCircle size={12} color="#666" />
          </ConversationIcon>
          <ConversationTitle>
            {conversation.title || 'Untitled Chat'}
          </ConversationTitle>
        </ConversationItem>
      ))}
    </ConversationsList>
  );
};

export default ConversationList;