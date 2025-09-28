import React from 'react';
import styled from 'styled-components';
import { useApp } from '../context/useApp';
import { db } from '../utils/database';
import { ZipParser } from '../utils/zipParser';
import { ChatParser } from '../utils/chatParser';

const ImportContainer = styled.div`
  padding: 0.75em 1.25em;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  gap: 0.75em;
  box-shadow: 0 0.0625em 0.1875em rgba(0, 0, 0, 0.05);
  min-height: 3.75em;
  font-size: 16px;
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    padding: 1em 1.5em;
    gap: 1em;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    padding: 0.875em 1.25em;
    font-size: 17px;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ImportButton = styled.label`
  background: linear-gradient(135deg, #25d366 0%, #20b858 100%);
  color: white;
  padding: 0.5em 1em;
  border-radius: 1.125em;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.75em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0.125em 0.375em rgba(37, 211, 102, 0.25);
  border: none;
  white-space: nowrap;

  &:hover {
    transform: translateY(-0.0625em);
    background: linear-gradient(135deg, #20b858 0%, #1da750 100%);
    box-shadow: 0 0.1875em 0.625em rgba(37, 211, 102, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    padding: 0.625em 1.125em;
    font-size: 0.875em;
  }
`;

const StatusText = styled.span`
  color: #667781;
  font-size: 0.8125em;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 18.75em;
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    font-size: 0.875em;
    max-width: 50vw;
  }
`;

const ClearButton = styled.button`
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  padding: 0.375em 0.875em;
  border-radius: 0.9375em;
  cursor: pointer;
  font-size: 0.6875em;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0.125em 0.375em rgba(220, 53, 69, 0.25);
  white-space: nowrap;

  &:hover {
    transform: translateY(-0.0625em);
    background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
    box-shadow: 0 0.1875em 0.625em rgba(220, 53, 69, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 0.0625em 0.1875em rgba(220, 53, 69, 0.15);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    padding: 0.5em 1em;
    font-size: 0.75em;
  }
`;

const SwitchButton = styled.button`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  padding: 0.375em 0.875em;
  border-radius: 0.9375em;
  cursor: pointer;
  font-size: 0.6875em;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0.125em 0.375em rgba(0, 123, 255, 0.25);
  white-space: nowrap;

  &:hover {
    transform: translateY(-0.0625em);
    background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
    box-shadow: 0 0.1875em 0.625em rgba(0, 123, 255, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    padding: 0.5em 1em;
    font-size: 0.75em;
  }
`;

export function FileImportArea() {
  const { state, dispatch } = useApp();

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const file = files[0]; // Only handle first file in single chat mode
      
      if (file.name.endsWith('.zip')) {
        console.log('Importing ZIP file:', file.name, 'Size:', file.size, 'bytes');
        
        const { chat, mediaFiles } = await ZipParser.parseWhatsAppZip(file);
        
        console.log('Parsed ZIP chat:', {
          name: chat.name,
          messageCount: chat.messages.length,
          participants: chat.participants,
          mediaFileCount: mediaFiles.size
        });
        
        // Prepare media files array
        const mediaFilesArray = Array.from(mediaFiles.values()).map(mediaFile => ({
          ...mediaFile,
          id: `${chat.id}-media-${mediaFile.id}`
        }));
        
        // Save as current chat (replaces any existing chat)
        await db.saveCurrentChat(chat, mediaFilesArray);
        
        // Update state
        dispatch({ type: 'SET_CURRENT_CHAT', payload: chat });
        
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        console.log('Importing text file:', file.name, 'Size:', file.size, 'bytes');
        const content = await file.text();
        const chat = ChatParser.parseWhatsAppExport(content, file.name);
        
        console.log('Parsed text chat:', {
          name: chat.name,
          messageCount: chat.messages.length,
          participants: chat.participants
        });
        
        // Save as current chat (replaces any existing chat)
        await db.saveCurrentChat(chat, []);
        
        // Update state
        dispatch({ type: 'SET_CURRENT_CHAT', payload: chat });
      }
      
    } catch (error) {
      console.error('Failed to import file:', error);
      alert(`Failed to import file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      // Clear the input so same file can be selected again
      event.target.value = '';
    }
  };

  const handleClearChat = async () => {
    if (confirm('Are you sure you want to clear the current chat? This action cannot be undone.')) {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await db.clearCurrentChat();
        dispatch({ type: 'CLEAR_CHAT' });
      } catch (error) {
        console.error('Failed to clear chat:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  const loadCurrentChat = React.useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const currentChat = await db.getCurrentChat();
      dispatch({ type: 'SET_CURRENT_CHAT', payload: currentChat });
    } catch (error) {
      console.error('Failed to load chat:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const handleSwitchSide = () => {
    dispatch({ type: 'TOGGLE_SWITCH_SIDE' });
  };

  // Load current chat on mount
  React.useEffect(() => {
    loadCurrentChat();
  }, [loadCurrentChat]);

  return (
    <ImportContainer>
      <FileInput
        id="file-input"
        type="file"
        accept=".txt,.zip"
        onChange={handleFileImport}
        disabled={state.isLoading}
      />
      <ImportButton htmlFor="file-input">
        {state.isLoading ? 'Loading...' : 'Import WhatsApp Chat'}
      </ImportButton>
      
      <SwitchButton onClick={handleSwitchSide} disabled={state.isLoading}>
        {state.switchSide ? 'Switch to Right' : 'Switch to Left'}
      </SwitchButton>
      
      {state.currentChat && (
        <>
          <StatusText>
            Current: {state.currentChat.name} ({state.currentChat.messages.length} messages)
          </StatusText>
          <ClearButton onClick={handleClearChat} disabled={state.isLoading}>
            Clear Chat
          </ClearButton>
        </>
      )}
      
      {!state.currentChat && !state.isLoading && (
        <StatusText>
          No chat loaded. Import a WhatsApp export file (.txt or .zip) to get started.
        </StatusText>
      )}
    </ImportContainer>
  );
}