import styled from 'styled-components';

export const Avatar = styled.div<{ $isUser?: boolean; size?: number }>`
  width: ${props => props.size || 28}px;
  height: ${props => props.size || 28}px;
  border-radius: 6px;
  background: ${props => props.$isUser ? '#000' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const Button = styled.button`
  background: #f8f8f8;
  color: #666;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;
  font-family: inherit;

  &:hover {
    background: #f0f0f0;
    border-color: #d0d0d0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f0f0f0;
  }
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 24px;
`;

export const EmptyContent = styled.div`
  max-width: 400px;
`;

export const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

export const EmptyTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #000;
  margin-bottom: 8px;
`;

export const EmptyText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;
