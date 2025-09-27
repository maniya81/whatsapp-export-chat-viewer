import React, { useState } from 'react';
import styled from 'styled-components';
import { AttachIcon, EmojiIcon, MicrophoneIcon, SendIcon } from './WhatsAppIcons';

const MessageInputContainer = styled.div`
  padding: 10px 16px;
  background: #f0f2f5;
  border-top: 1px solid #e9edef;
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  background: #ffffff;
  border-radius: 24px;
  padding: 9px 12px;
  min-height: 20px;
  max-height: 100px;
  border: 1px solid transparent;
  
  &:focus-within {
    border-color: #4a9eff;
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  line-height: 20px;
  color: #111b21;
  resize: none;
  max-height: 100px;
  overflow-y: auto;
  font-family: inherit;
  
  &::placeholder {
    color: #8696a0;
  }
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(11, 20, 26, 0.2);
    border-radius: 2px;
  }
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s ease-out;
  background: ${props => props.$primary ? '#00a884' : 'transparent'};
  color: ${props => props.$primary ? '#ffffff' : '#54656f'};
  
  &:hover {
    background: ${props => props.$primary ? '#008069' : 'rgba(11, 20, 26, 0.05)'};
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const EmojiButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #54656f;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  
  &:hover {
    color: #00a884;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

interface MessageComposerProps {
  onSendMessage?: (message: string) => void;
  onAttachFile?: () => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  onAttachFile
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = Math.min(element.scrollHeight, 100) + 'px';
  };

  return (
    <MessageInputContainer>
      <ActionButton onClick={onAttachFile} title="Attach">
        <AttachIcon />
      </ActionButton>
      
      <InputWrapper>
        <EmojiButton title="Emoji">
          <EmojiIcon />
        </EmojiButton>
        <MessageInput
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            adjustTextareaHeight(e.target);
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          rows={1}
        />
      </InputWrapper>
      
      {message.trim() ? (
        <ActionButton $primary onClick={handleSend} title="Send">
          <SendIcon />
        </ActionButton>
      ) : (
        <ActionButton title="Voice message">
          <MicrophoneIcon />
        </ActionButton>
      )}
    </MessageInputContainer>
  );
};