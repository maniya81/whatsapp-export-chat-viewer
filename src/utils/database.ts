import Dexie, { type Table } from "dexie";
import type { Chat } from "../types/chat";

export class WhatsAppDB extends Dexie {
  chats!: Table<Chat, string>;

  constructor() {
    super("WhatsAppChatViewer");
    this.version(1).stores({
      chats: "id, name, createdAt, updatedAt",
    });
  }

  async saveChat(chat: Chat): Promise<void> {
    await this.chats.put(chat);
  }

  async getChats(): Promise<Chat[]> {
    return await this.chats.orderBy("updatedAt").reverse().toArray();
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.chats.delete(chatId);
  }

  async getChatById(chatId: string): Promise<Chat | undefined> {
    return await this.chats.get(chatId);
  }

  async clearAllChats(): Promise<void> {
    await this.chats.clear();
  }
}

export const db = new WhatsAppDB();
