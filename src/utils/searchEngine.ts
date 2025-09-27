import Fuse from "fuse.js";
import type { Chat, Message, SearchResult } from "../types/chat";

export class SearchEngine {
  private fuse: Fuse<{ chatId: string; chatName: string; message: Message }>;

  constructor(chats: Chat[]) {
    const searchData = chats.flatMap((chat) =>
      chat.messages.map((message) => ({
        chatId: chat.id,
        chatName: chat.name,
        message,
      }))
    );

    this.fuse = new Fuse(searchData, {
      keys: [
        { name: "message.content", weight: 0.8 },
        { name: "message.sender", weight: 0.6 },
        { name: "chatName", weight: 0.4 },
      ],
      includeScore: true,
      includeMatches: true,
      threshold: 0.3,
      minMatchCharLength: 2,
    });
  }

  search(query: string): SearchResult[] {
    if (!query.trim()) return [];

    const results = this.fuse.search(query);

    return results.map((result) => {
      const { chatId, chatName, message } = result.item;
      let highlightedContent = message.content;

      // Highlight matches in content
      if (result.matches) {
        const contentMatches = result.matches.find(
          (match) => match.key === "message.content"
        );
        if (contentMatches && contentMatches.indices) {
          highlightedContent = this.highlightMatches(
            message.content,
            contentMatches.indices
          );
        }
      }

      return {
        chatId,
        chatName,
        message,
        highlightedContent,
      };
    });
  }

  private highlightMatches(
    text: string,
    indices: readonly [number, number][]
  ): string {
    let result = "";
    let lastIndex = 0;

    // Sort indices by start position
    const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);

    for (const [start, end] of sortedIndices) {
      // Add text before match
      result += text.substring(lastIndex, start);
      // Add highlighted match
      result += `<mark>${text.substring(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    }

    // Add remaining text
    result += text.substring(lastIndex);

    return result;
  }

  updateChats(chats: Chat[]): void {
    const searchData = chats.flatMap((chat) =>
      chat.messages.map((message) => ({
        chatId: chat.id,
        chatName: chat.name,
        message,
      }))
    );

    this.fuse.setCollection(searchData);
  }
}
