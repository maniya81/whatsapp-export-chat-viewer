import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import type { Message } from '../types/chat';
import { DoubleCheckIcon } from './MessageIcons';
import { SearchIcon, MoreOptionsIcon, VideoCallIcon, PhoneCallIcon } from './WhatsAppIcons';
import { MessageComposer } from './MessageComposer';
import { groupConsecutiveMessages, shouldShowSenderName } from '../utils/messageGrouping';
import {
  ChatArea,
  ChatHeader,
  ChatHeaderInfo,
  ChatHeaderName,
  ChatHeaderStatus,
  DefaultAvatar,
  IconButton,
  MessagesContainer,
  MessageBubble,
  MessageSender,
  MessageContent,
  MessageTimestamp,
  MessageStatus,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText
} from '../styles/styled';

export function MainChatArea() {
  const { state } = useApp();
  const { activeChat } = state;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when chat changes or new messages
  useEffect(() => {
    if (activeChat && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.id, activeChat?.messages.length]);

  if (!activeChat) {
    return (
      <ChatArea>
        <EmptyState>
          <div style={{ fontSize: '100px', marginBottom: '20px' }}>💬</div>
          <EmptyStateTitle>WhatsApp Chat Viewer</EmptyStateTitle>
          <EmptyStateText>
            Import your WhatsApp chat exports to view them in the familiar WhatsApp Web interface.
            You can import multiple chats and search through all your conversations.
          </EmptyStateText>
          <div style={{ margin: '30px 0', padding: '20px', backgroundColor: '#f5f6f6', borderRadius: '8px', fontSize: '12px', textAlign: 'left', maxWidth: '500px' }}>
            <strong>Supported WhatsApp Export Formats:</strong>
            <div style={{ marginTop: '10px', fontFamily: 'monospace' }}>
              <div style={{ marginBottom: '8px' }}><strong>Format 1:</strong> [DD/MM/YYYY, HH:MM:SS] Sender: Message</div>
              <div style={{ marginBottom: '8px' }}><strong>Format 2:</strong> DD/MM/YYYY, HH:MM - Sender: Message</div>
              <div style={{ marginBottom: '8px' }}><strong>Format 3:</strong> MM/DD/YYYY, HH:MM AM/PM - Sender: Message</div>
            </div>
          </div>
          <EmptyStateText style={{ marginTop: '20px', fontSize: '12px' }}>
            <strong>To export chats from WhatsApp:</strong><br/>
            Open chat → Menu (⋮) → More → Export chat → Without media
          </EmptyStateText>
          <EmptyStateText style={{ marginTop: '10px', fontSize: '11px', color: '#8696a0' }}>
            Having issues? Check browser console (F12) for detailed parsing logs
          </EmptyStateText>
        </EmptyState>
      </ChatArea>
    );
  }

  const getSenderColorIndex = (sender: string): number => {
    // Create consistent color index for each sender
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
      hash = sender.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const getCurrentUser = (): string => {
    // Analyze messages to detect the current user
    // In WhatsApp exports, the current user might be represented differently
    
    // Get all unique senders
    const senders = [...new Set(activeChat.messages
      .filter(m => m.type !== 'system')
      .map(m => m.sender.trim()))];
    
    console.log('All senders found:', senders); // Debug log
    
    // Check for common current user patterns first
    const currentUserPatterns = ['You', 'you', '+91 98791 35007', '~You~'];
    for (const pattern of currentUserPatterns) {
      if (senders.some(sender => sender === pattern || sender.includes(pattern))) {
        console.log('Found current user by pattern:', pattern); // Debug log
        return pattern;
      }
    }
    
    // If no pattern matches, assume the first sender alphabetically might be current user
    // or use heuristics based on message content
    const sortedSenders = senders.sort();
    console.log('Sorted senders:', sortedSenders); // Debug log
    
    // Return the first sender as fallback (you can manually adjust this)
    return sortedSenders[0] || 'You';
  };

  const isOutgoingMessage = (message: Message): boolean => {
    const currentUser = getCurrentUser();
    const sender = message.sender.trim();
    
    console.log(`Checking message from "${sender}" against current user "${currentUser}"`); // Debug log
    
    return sender === currentUser || sender.includes(currentUser);
  };

  const shouldShowDateSeparator = (message: Message, index: number): boolean => {
    if (index === 0) return true;
    const prevMessage = activeChat.messages[index - 1];
    const currentDate = message.timestamp.toDateString();
    const prevDate = prevMessage.timestamp.toDateString();
    return currentDate !== prevDate;
  };

  const formatDateSeparator = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'dd/MM/yyyy');
    }
  };

  const getMessageTypeDisplay = (message: Message): string => {
    switch (message.type) {
      case 'image':
        return '📷 Photo';
      case 'video':
        return '🎥 Video';
      case 'audio':
        return '🎵 Audio';
      case 'document':
        return '📄 Document';
      default:
        return message.content;
    }
  };

  return (
    <ChatArea>
      <ChatHeader>
        <DefaultAvatar>
          {activeChat.name.charAt(0).toUpperCase()}
        </DefaultAvatar>
        <ChatHeaderInfo>
          <ChatHeaderName>{activeChat.name}</ChatHeaderName>
          <ChatHeaderStatus>
            {activeChat.messages.length} messages • Current user: "{getCurrentUser()}"
            {activeChat.isGroup && ` • ${activeChat.participants?.length || 0} participants`}
          </ChatHeaderStatus>
        </ChatHeaderInfo>
        <div style={{ display: 'flex', gap: '10px' }}>
          <IconButton>
            <VideoCallIcon />
          </IconButton>
          <IconButton>
            <PhoneCallIcon />
          </IconButton>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <MoreOptionsIcon />
          </IconButton>
        </div>
      </ChatHeader>

      <MessagesContainer>
        {(() => {
          const messageGroups = groupConsecutiveMessages(activeChat.messages);
          const elements: React.ReactElement[] = [];
          let messageIndex = 0;

          messageGroups.forEach((group) => {
            group.messages.forEach((message, msgIndexInGroup) => {
              const isOutgoing = isOutgoingMessage(message);
              const showDateSeparator = shouldShowDateSeparator(message, messageIndex);
              const senderColorIndex = getSenderColorIndex(message.sender);
              const isFirstInGroup = msgIndexInGroup === 0;
              const showSender = isFirstInGroup && shouldShowSenderName(group, activeChat.isGroup || false);
              
              if (showDateSeparator) {
                elements.push(
                  <MessageBubble key={`date-${messageIndex}`} $isOutgoing={false} $isSystem={true}>
                    {formatDateSeparator(message.timestamp)}
                  </MessageBubble>
                );
              }

              if (message.type === 'system') {
                elements.push(
                  <MessageBubble
                    key={message.id}
                    $isOutgoing={false}
                    $isSystem={true}
                  >
                    {getMessageTypeDisplay(message)}
                  </MessageBubble>
                );
              } else {
                elements.push(
                  <MessageBubble
                    key={message.id}
                    $isOutgoing={isOutgoing}
                    $isSystem={false}
                    $hideTopTail={!isFirstInGroup}
                  >
                    {showSender && (
                      <MessageSender $senderIndex={senderColorIndex}>
                        {message.sender}
                      </MessageSender>
                    )}
                    <MessageContent>
                      {getMessageTypeDisplay(message)}
                    </MessageContent>
                    <MessageTimestamp>
                      {format(message.timestamp, 'HH:mm')}
                    </MessageTimestamp>
                    {isOutgoing && (
                      <MessageStatus $delivered={true} $read={false}>
                        <DoubleCheckIcon />
                      </MessageStatus>
                    )}
                  </MessageBubble>
                );
              }
              
              messageIndex++;
            });
          });

          return elements;
        })()}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <MessageComposer />
    </ChatArea>
  );
}