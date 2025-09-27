export interface Message {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "document" | "system";
}

export interface Chat {
  id: string;
  name: string;
  lastMessage: Message | null;
  messages: Message[];
  avatar?: string;
  isGroup: boolean;
  participants?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResult {
  chatId: string;
  chatName: string;
  message: Message;
  highlightedContent: string;
}
