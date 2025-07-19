import React, { useState } from 'react';
import styled from 'styled-components';
import { Send } from 'lucide-react';

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

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Message...',
}) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <InputContainer>
      <InputWrapper>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <SendButton 
          onClick={handleSend} 
          $disabled={!input.trim() || disabled}
          disabled={!input.trim() || disabled}
        >
          <Send size={12} />
        </SendButton>
      </InputWrapper>
    </InputContainer>
  );
};

export default MessageInput;