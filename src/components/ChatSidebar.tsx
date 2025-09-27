import React, { useRef } from 'react';
import { BsChat, BsArrowLeft } from 'react-icons/bs';
import { HiOutlineDocumentAdd } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import { SearchIcon, MoreOptionsIcon } from './WhatsAppIcons';
import { ChatParser } from '../utils/chatParser';
import { db } from '../utils/database';
import { format } from 'date-fns';
import type { Chat, SearchResult } from '../types/chat';
import {
  Sidebar,
  SidebarHeader,
  ProfileSection,
  DefaultAvatar,
  IconButton,
  SearchContainer,
  SearchBox,
  SearchInput,
  ChatList,
  ChatItem,
  ChatItemContent,
  ChatInfo,
  ChatName,
  LastMessage,
  ChatTimestamp,
  ImportButton,
  HiddenFileInput,
  LoadingSpinner
} from '../styles/styled';

export function ChatSidebar() {
  const { state, dispatch } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { chats, activeChat, searchQuery, searchResults, isLoading } = state;

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      for (const file of Array.from(files)) {
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          console.log('Importing file:', file.name, 'Size:', file.size, 'bytes');
          const content = await file.text();
          const chat = ChatParser.parseWhatsAppExport(content, file.name);
          
          console.log('Parsed chat:', {
            name: chat.name,
            messageCount: chat.messages.length,
            participants: chat.participants
          });
          
          if (chat.messages.length === 0) {
            console.warn('No messages found in file:', file.name);
            console.log('File content sample:', content.substring(0, 1000));
          }
          
          // Save to database
          await db.saveChat(chat);
          
          // Add to state
          dispatch({ type: 'ADD_CHAT', payload: chat });
        } else {
          console.warn('Skipping non-text file:', file.name);
        }
      }
      
      console.log('Import completed successfully');
    } catch (error) {
      console.error('Failed to import chats:', error);
      alert(`Failed to import some chat files. Please check the console for details.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nMake sure your files are valid WhatsApp export files (.txt format).`);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: event.target.value });
  };

  const handleChatClick = (chat: Chat) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat });
    // Clear search when selecting a chat
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  };

  const handleSearchResultClick = (result: SearchResult) => {
    const chat = chats.find(c => c.id === result.chatId);
    if (chat) {
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat });
      dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    }
  };

  const clearSearch = () => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  };

  const displayChats = searchQuery ? searchResults : chats;

  return (
    <Sidebar>
      <SidebarHeader>
        <ProfileSection>
          <DefaultAvatar>
            WA
          </DefaultAvatar>
        </ProfileSection>
        <div style={{ display: 'flex', gap: '10px' }}>
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            title="Import WhatsApp Chat"
          >
            <HiOutlineDocumentAdd size={20} />
          </IconButton>
          <IconButton>
            <BsChat size={20} />
          </IconButton>
          <IconButton>
            <MoreOptionsIcon />
          </IconButton>
        </div>
      </SidebarHeader>

      <SearchContainer>
        <SearchBox>
          {searchQuery ? (
            <IconButton onClick={clearSearch}>
              <BsArrowLeft size={16} />
            </IconButton>
          ) : (
            <SearchIcon />
          )}
          <SearchInput
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchBox>
      </SearchContainer>

      <ChatList>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <LoadingSpinner />
          </div>
        ) : displayChats.length === 0 && !searchQuery ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8696a0' }}>
            <h3>No chats imported</h3>
            <p>Import your WhatsApp chat exports to get started</p>
            <ImportButton onClick={() => fileInputRef.current?.click()}>
              Import Chat Files
            </ImportButton>
          </div>
        ) : searchQuery && searchResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#8696a0' }}>
            No results found for "{searchQuery}"
          </div>
        ) : (
          displayChats.map((item) => {
            if ('message' in item) {
              // Search result
              const result = item as SearchResult;
              return (
                <ChatItem
                  key={`${result.chatId}-${result.message.id}`}
                  onClick={() => handleSearchResultClick(result)}
                >
                  <ChatItemContent>
                    <DefaultAvatar>
                      {result.chatName.charAt(0).toUpperCase()}
                    </DefaultAvatar>
                    <ChatInfo>
                      <ChatName>{result.chatName}</ChatName>
                      <LastMessage
                        dangerouslySetInnerHTML={{ 
                          __html: `${result.message.sender}: ${result.highlightedContent}` 
                        }}
                      />
                    </ChatInfo>
                    <ChatTimestamp>
                      {format(result.message.timestamp, 'HH:mm')}
                    </ChatTimestamp>
                  </ChatItemContent>
                </ChatItem>
              );
            } else {
              // Regular chat
              const chat = item as Chat;
              return (
                <ChatItem
                  key={chat.id}
                  $isActive={activeChat?.id === chat.id}
                  onClick={() => handleChatClick(chat)}
                >
                  <ChatItemContent>
                    <DefaultAvatar>
                      {chat.name.charAt(0).toUpperCase()}
                    </DefaultAvatar>
                    <ChatInfo>
                      <ChatName>{chat.name}</ChatName>
                      <LastMessage>
                        {chat.lastMessage 
                          ? `${chat.lastMessage.sender === 'System' ? '' : chat.lastMessage.sender + ': '}${chat.lastMessage.content.substring(0, 40)}${chat.lastMessage.content.length > 40 ? '...' : ''}`
                          : 'No messages'
                        }
                      </LastMessage>
                    </ChatInfo>
                    <ChatTimestamp>
                      {chat.lastMessage 
                        ? format(chat.lastMessage.timestamp, chat.lastMessage.timestamp.getDate() === new Date().getDate() ? 'HH:mm' : 'dd/MM/yyyy')
                        : ''
                      }
                    </ChatTimestamp>
                  </ChatItemContent>
                </ChatItem>
              );
            }
          })
        )}
      </ChatList>

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept=".txt"
        multiple
        onChange={handleFileImport}
      />
    </Sidebar>
  );
}