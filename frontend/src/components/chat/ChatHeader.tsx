import React from 'react';
import styled from 'styled-components';
import { Menu, Bot } from 'lucide-react';
import { Avatar, IconButton } from '../common/styled';

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e5e5e5;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 15px;
  font-weight: 500;
  color: #000;
`;

interface ChatHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ title, onMenuClick }) => {
  return (
    <Header>
      <IconButton onClick={onMenuClick}>
        <Menu size={16} />
      </IconButton>
      <Avatar size={28}>
        <Bot size={14} color="white" />
      </Avatar>
      <Title>{title}</Title>
    </Header>
  );
};