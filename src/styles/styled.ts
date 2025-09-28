import styled from "styled-components";

// WhatsApp Web Color Palette - Exact Match
export const colors = {
  primary: "#00a884",
  primaryDark: "#008069",
  primaryLight: "#d1f4cc",
  background: "#f0f2f5",
  panelHeaderBackground: "#f0f2f5",
  panelBackground: "#ffffff",
  chatBackground: "#efeae2",
  messageBackground: "#ffffff",
  messageOutgoing: "#d1f4cc",
  messageIncoming: "#ffffff",
  textPrimary: "#111b21",
  textSecondary: "#667781",
  textMuted: "#8696a0",
  border: "#e9edef",
  shadow: "rgba(0, 0, 0, 0.13)",
  hover: "#f5f6f6",
  searchBackground: "#f0f2f5",
  searchBorder: "#d1d7db",
  timestampColor: "rgba(0, 0, 0, 0.45)",
  senderNameColors: [
    "#00a884",
    "#0088cc",
    "#7b68ee",
    "#ff6347",
    "#32cd32",
    "#ff1493",
    "#ffa500",
    "#9370db",
    "#20b2aa",
    "#cd853f",
  ],
};

// Responsive breakpoints
export const breakpoints = {
  mobile: "768px",
  smallMobile: "480px",
  largeMobile: "1024px",
};

// Main App Container - Responsive WhatsApp Layout
export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f0f2f5;
  font-family: "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;

  /* Mobile responsive layout */
  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    font-size: 16px; /* Larger text for mobile readability */
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    font-size: 15px;
  }
`;

// Left Sidebar - Mobile Responsive
export const Sidebar = styled.div`
  width: 30%;
  min-width: 300px;
  max-width: 500px;
  background: #ffffff;
  border-right: 1px solid #e9edef;
  display: flex;
  flex-direction: column;
  position: relative;

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    min-width: auto;
    max-width: none;
    max-height: 300px;
    border-right: none;
    border-bottom: 1px solid #e9edef;
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    max-height: 250px;
  }
`;

export const SidebarHeader = styled.header`
  height: 48px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.8);

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    height: 52px;
    padding: 10px 16px;
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    height: 48px;
    padding: 8px 12px;
  }
`;

export const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    width: 32px;
    height: 32px;
  }
`;

export const DefaultAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${colors.textSecondary};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: ${colors.hover};
    transform: scale(1.05);
    color: ${colors.textPrimary};
  }

  svg {
    width: 18px;
    height: 18px;
  }

  /* Mobile responsive - larger touch targets */
  @media (max-width: ${breakpoints.mobile}) {
    width: 40px;
    height: 40px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    width: 38px;
    height: 38px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`; // Search Styling
export const SearchContainer = styled.div`
  padding: 10px 12px;
  background: #f0f2f5;
  border-bottom: 1px solid #e9edef;
`;

export const SearchBox = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 0;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 10px;
  box-shadow: 0 1px 1px rgba(11, 20, 26, 0.06);

  svg {
    width: 16px;
    height: 16px;
    color: ${colors.textMuted};
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: ${colors.textPrimary};

  &::placeholder {
    color: ${colors.textMuted};
  }

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 16px; /* Prevent zoom on iOS */
  }
`;

// Chat List Styling - Mobile Responsive
export const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  background: ${colors.panelBackground};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(11, 20, 26, 0.2);
    border-radius: 3px;
  }

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    /* Hide scrollbar on mobile */
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const ChatItem = styled.div<{ $active?: boolean }>`
  padding: 12px 13px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #f2f2f2;
  background: ${(props) => (props.$active ? "#f0f2f5" : "transparent")};
  transition: background-color 0.15s;

  &:hover {
    background-color: ${colors.hover};
  }

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    padding: 14px 16px;
    min-height: 60px;
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    padding: 12px 14px;
    min-height: 56px;
  }

  &:hover {
    background: ${colors.hover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ChatInfo = styled.div`
  flex: 1;
  margin-left: 13px;
  overflow: hidden;
`;

export const ChatName = styled.div`
  font-size: 17px;
  font-weight: 400;
  color: ${colors.textPrimary};
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatPreview = styled.div`
  font-size: 14px;
  color: ${colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 12px;
  color: ${colors.textMuted};
`;

export const ChatTime = styled.div`
  margin-bottom: 4px;
`;

export const UnreadCount = styled.div<{ $visible?: boolean }>`
  background: ${colors.primary};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  display: ${(props) => (props.$visible ? "flex" : "none")};
`;

// Additional Chat Sidebar Components
export const ChatItemContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${colors.hover};
  }
`;

export const LastMessage = styled.div`
  font-size: 14px;
  color: ${colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
`;

export const ChatTimestamp = styled.div`
  font-size: 12px;
  color: ${colors.textMuted};
  margin-bottom: 4px;
  white-space: nowrap;
`;

export const ImportButton = styled.label`
  background: linear-gradient(135deg, #25d366 0%, #20b858 100%);
  color: white;
  padding: 8px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  text-align: center;
  box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
  border: none;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
    background: linear-gradient(135deg, #20b858 0%, #1da750 100%);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(37, 211, 102, 0.3);
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid ${colors.textMuted};
  border-radius: 50%;
  border-top-color: ${colors.primary};
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Chat Area Styling - Mobile Responsive
export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${colors.chatBackground};
  position: relative;

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    flex: 1;
    height: calc(100vh - 300px);
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    height: calc(100vh - 250px);
  }
`;

export const ChatHeader = styled.header`
  height: 52px;
  padding: 8px 16px;
  background: linear-gradient(
    135deg,
    ${colors.panelHeaderBackground} 0%,
    #ffffff 100%
  );
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 1px solid ${colors.border};
  box-shadow: 0 2px 8px rgba(11, 20, 26, 0.08);

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    height: 48px;
    padding: 6px 12px;
    border-left: none;
    border-top: 1px solid ${colors.border};
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    height: 46px;
    padding: 5px 10px;
  }
`;

export const ChatHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 15px;
  overflow: hidden;

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    margin-left: 12px;
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    margin-left: 8px;
  }
`;

export const ChatHeaderName = styled.h1`
  font-size: 16px;
  font-weight: 400;
  color: #111b21;
  line-height: 1.2;
  margin: 0;

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 17px;
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    font-size: 16px;
  }
`;

export const ChatHeaderStatus = styled.div`
  font-size: 13px;
  color: #667781;
  line-height: 1.2;
`;

// Messages Area - Mobile Responsive WhatsApp Style
export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #e5ddd5;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  padding: 20px 7%;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.08);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    padding: 12px 4%;

    /* Hide scrollbar on mobile for cleaner look */
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    padding: 8px 3%;
  }
`;

export const MessageBubble = styled.div<{
  $isOutgoing: boolean;
  $isSystem?: boolean;
  $hideTopTail?: boolean;
}>`
  position: relative;
  background-color: ${(props) => (props.$isOutgoing ? "#cfe9ba" : "#ffffff")};
  width: fit-content;
  max-width: 500px;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
  margin-bottom: 10px;
  align-self: ${(props) => (props.$isOutgoing ? "flex-end" : "flex-start")};

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    max-width: 85%;
    padding: 10px 12px;
    font-size: 16px;
    line-height: 1.4;
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    max-width: 90%;
    padding: 8px 10px;
    font-size: 15px;
  }

  /* Message tail - hidden for consecutive messages */
  &::before {
    position: absolute;
    top: 0;
    content: "";
    display: ${(props) => (props.$hideTopTail ? "none" : "block")};
    border: solid;
    ${(props) =>
      props.$isOutgoing
        ? `
      left: auto;
      right: -28px;
      border-width: 0px 16px 16px 16px;
      border-color: transparent;
      border-left-color: #cfe9ba;
    `
        : `
      left: -10px;
      border-width: 0px 16px 16px 0px;
      border-color: transparent;
      border-right-color: #ffffff;
    `}
  }

  ${(props) =>
    props.$isSystem
      ? `
    align-self: center;
    background-color: rgba(225, 245, 254, 0.92);
    color: rgba(74, 74, 74, 0.88);
    font-size: 12px;
    text-transform: uppercase;
    
    &::before {
      display: none;
    }
  `
      : ""}
`;

export const MessageBubbleContent = styled.div<{ $isOutgoing: boolean }>`
  /* Content is now directly in MessageBubble */
`;

export const MessageSender = styled.div<{ $senderIndex?: number }>`
  font-size: 12.8px;
  font-weight: 500;
  color: ${(props) =>
    props.$senderIndex !== undefined
      ? colors.senderNameColors[
          props.$senderIndex % colors.senderNameColors.length
        ]
      : colors.primary};
  margin-bottom: 1px;
`;

export const SystemMessage = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 7.5px;
  padding: 4px 12px;
  font-size: 12px;
  color: #8696a0;
  text-align: center;
  max-width: 80%;
  box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13);
`;

export const MessageContent = styled.div`
  font-size: 14.2px;
  line-height: 19px;
  color: #111b21;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding-right: 70px;
  padding-bottom: 18px;
  position: relative;

  a {
    color: #53bdeb;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const MessageFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 4px;
`;

export const MessageTimestamp = styled.time`
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 15px;
  position: absolute;
  bottom: 4px;
  right: 7px;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0;

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
    bottom: 6px;
    right: 10px;
    gap: 4px;
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    font-size: 11px;
    bottom: 5px;
    right: 8px;
  }
`;

export const MessageStatus = styled.div<{
  $delivered?: boolean;
  $read?: boolean;
}>`
  display: inline-flex;
  align-items: center;

  svg {
    width: 16px;
    height: 10px;
    color: ${(props) => (props.$read ? "#53bdeb" : "rgba(0, 0, 0, 0.45)")};
  }

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    svg {
      width: 17px;
      height: 11px;
    }
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    svg {
      width: 16px;
      height: 10px;
    }
  }
  }
`;

// Empty State
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px;
  text-align: center;
  background: ${colors.background};
`;

export const EmptyStateTitle = styled.h1`
  font-size: 32px;
  font-weight: 300;
  color: ${colors.textSecondary};
  margin-bottom: 10px;
`;

export const EmptyStateText = styled.p`
  font-size: 14px;
  color: ${colors.textMuted};
  line-height: 1.4;
  max-width: 600px;
`;

// File Upload
export const FileInput = styled.input`
  display: none;
`;

export const UploadButton = styled.label`
  background: ${colors.primary};
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${colors.primaryDark};
  }

  /* Mobile responsive - larger touch target */
  @media (max-width: ${breakpoints.mobile}) {
    padding: 14px 28px;
    font-size: 16px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    padding: 12px 24px;
    font-size: 15px;
  }
`;

// Message Composer - Mobile Responsive
export const MessageComposerContainer = styled.div`
  padding: 5px 10px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid #e9edef;

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    padding: 8px 12px;
    gap: 10px;
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    padding: 6px 10px;
    gap: 8px;
  }
`;

export const MessageInput = styled.div`
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 10px 15px;
  border: none;
  outline: none;
  font-size: 15px;
  color: #111b21;
  min-height: 42px;
  max-height: 150px;
  overflow-y: auto;

  &:empty::before {
    content: "Type a message";
    color: #8696a0;
    opacity: 0.5;
  }

  /* Mobile responsive */
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 16px;
    padding: 12px 16px;
    min-height: 44px;
  }

  @media (max-width: ${breakpoints.smallMobile}) {
    font-size: 15px;
    padding: 10px 14px;
  }
`;
