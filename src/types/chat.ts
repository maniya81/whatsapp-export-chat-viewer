export interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  blob?: Blob;
}

export interface Message {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "document" | "system";
  mediaFile?: MediaFile;
  caption?: string; // For images/videos with captions
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
