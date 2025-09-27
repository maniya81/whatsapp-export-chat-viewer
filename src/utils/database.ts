import Dexie, { type Table } from "dexie";
import type { Chat, MediaFile } from "../types/chat";

export class WhatsAppDB extends Dexie {
  chats!: Table<Chat, string>;
  mediaFiles!: Table<MediaFile, string>;

  constructor() {
    super("WhatsAppChatViewer");

    // Version 1: Original schema
    this.version(1).stores({
      chats: "id, name, createdAt, updatedAt",
    });

    // Version 2: Add media files table
    this.version(2)
      .stores({
        chats: "id, name, createdAt, updatedAt",
        mediaFiles: "id, name, type, size",
      })
      .upgrade(() => {
        // Migration logic for existing data if needed
        console.log(
          "Upgrading database to version 2 - adding media files support"
        );
      });
  }

  // Single chat mode - replace any existing chat
  async saveCurrentChat(
    chat: Chat,
    mediaFiles: MediaFile[] = []
  ): Promise<void> {
    await this.transaction("rw", [this.chats, this.mediaFiles], async () => {
      // Clear all existing data
      await this.chats.clear();
      await this.mediaFiles.clear();

      // Save the new chat and its media
      await this.chats.put(chat);
      if (mediaFiles.length > 0) {
        await this.mediaFiles.bulkPut(mediaFiles);
      }
    });
  }

  async getCurrentChat(): Promise<Chat | null> {
    const chats = await this.chats.toArray();
    return chats.length > 0 ? chats[0] : null;
  }

  async clearCurrentChat(): Promise<void> {
    await this.chats.clear();
    await this.mediaFiles.clear();
  }

  // Media file operations
  async getMediaFile(mediaId: string): Promise<MediaFile | undefined> {
    return await this.mediaFiles.get(mediaId);
  }

  async getAllMediaFiles(): Promise<MediaFile[]> {
    return await this.mediaFiles.toArray();
  }

  async deleteMediaFile(mediaId: string): Promise<void> {
    const mediaFile = await this.getMediaFile(mediaId);
    if (mediaFile?.url) {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(mediaFile.url);
    }
    await this.mediaFiles.delete(mediaId);
  }
}

export const db = new WhatsAppDB();
