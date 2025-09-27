import React from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { db } from '../utils/database';
import { ZipParser } from '../utils/zipParser';
import { ChatParser } from '../utils/chatParser';

const ImportContainer = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const FileInput = styled.input`
  display: none;
`;

const ImportButton = styled.label`
  background-color: #25d366;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #20b858;
  }
`;

const StatusText = styled.span`
  color: #667781;
  font-size: 14px;
`;

const ClearButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c82333;
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

  const loadCurrentChat = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const currentChat = await db.getCurrentChat();
      dispatch({ type: 'SET_CURRENT_CHAT', payload: currentChat });
    } catch (error) {
      console.error('Failed to load chat:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load current chat on mount
  React.useEffect(() => {
    loadCurrentChat();
  }, []);

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