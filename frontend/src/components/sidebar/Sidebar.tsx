import React from 'react';
import styled from 'styled-components';
import { Plus, MessageCircle } from 'lucide-react';
import { Conversation } from '../../api';
import { Button } from '../common/styled';

const SidebarContainer = styled.div<{ $collapsed: boolean }>`
  width: ${props => props.$collapsed ? '0' : '280px'};
  background: white;
  border-right: 1px solid #e5e5e5;
  transition: width 0.2s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SidebarTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

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

interface SidebarProps {
  collapsed: boolean;
  conversations: Conversation[];
  currentConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  conversations,
  currentConversationId,
  onConversationSelect,
  onNewChat,
}) => {
  return (
    <SidebarContainer $collapsed={collapsed}>
      <SidebarHeader>
        <SidebarTitle>Conversations</SidebarTitle>
        <Button onClick={onNewChat}>
          <Plus size={12} />
          New
        </Button>
      </SidebarHeader>
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
    </SidebarContainer>
  );
};