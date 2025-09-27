import JSZip from "jszip";
import type { Chat, MediaFile } from "../types/chat";
import { ChatParser } from "./chatParser";

export interface ZipParseResult {
  chat: Chat;
  mediaFiles: Map<string, MediaFile>;
}

export class ZipParser {
  /**
   * Parse a WhatsApp export ZIP file containing chat export and media files
   */
  static async parseWhatsAppZip(file: File): Promise<ZipParseResult> {
    console.log("Parsing ZIP file:", file.name, "Size:", file.size, "bytes");

    const zip = await JSZip.loadAsync(file);
    const mediaFiles = new Map<string, MediaFile>();
    let chatContent = "";
    let chatFileName = "";

    // First pass: Find the chat text file and catalog all media files
    for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
      if (zipEntry.dir) continue;

      const fileName = relativePath.split("/").pop() || "";
      const lowerFileName = fileName.toLowerCase();

      // Look for the main chat export text file
      if (
        lowerFileName.endsWith(".txt") &&
        (lowerFileName.includes("whatsapp") ||
          lowerFileName.includes("chat") ||
          relativePath.includes("_chat.txt"))
      ) {
        console.log("Found chat file:", relativePath);
        chatContent = await zipEntry.async("text");
        chatFileName = fileName;
      }
      // Catalog media files
      else if (this.isMediaFile(fileName)) {
        console.log("Found media file:", relativePath);
        const blob = await zipEntry.async("blob");
        const mediaFile: MediaFile = {
          id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: fileName,
          type: this.getMediaType(fileName),
          size: blob.size,
          url: URL.createObjectURL(blob),
          blob: blob,
        };

        // Store with multiple possible keys for lookup
        mediaFiles.set(fileName, mediaFile);
        mediaFiles.set(fileName.toLowerCase(), mediaFile);

        // Also store with path variants that might appear in the text
        const cleanFileName = this.cleanFileName(fileName);
        if (cleanFileName !== fileName) {
          mediaFiles.set(cleanFileName, mediaFile);
        }
      }
    }

    if (!chatContent) {
      throw new Error(
        "No WhatsApp chat export text file found in ZIP. Please ensure the ZIP contains a valid WhatsApp export."
      );
    }

    console.log(`Found ${mediaFiles.size} media files in ZIP`);
    console.log("Media files:", Array.from(mediaFiles.keys()));

    // Parse the chat content
    let chat = ChatParser.parseWhatsAppExport(chatContent, chatFileName);

    // Second pass: Link media files to messages
    chat = this.linkMediaToMessages(chat, mediaFiles);

    console.log("ZIP parsing completed successfully");

    return {
      chat,
      mediaFiles,
    };
  }

  /**
   * Check if a file is a media file based on its extension
   */
  private static isMediaFile(fileName: string): boolean {
    const mediaExtensions = [
      // Images
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "bmp",
      "tiff",
      "svg",
      // Videos
      "mp4",
      "mov",
      "avi",
      "mkv",
      "webm",
      "3gp",
      "wmv",
      "flv",
      // Audio
      "mp3",
      "wav",
      "aac",
      "ogg",
      "m4a",
      "wma",
      "opus",
      // Documents
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "txt",
      "rtf",
    ];

    const extension = fileName.toLowerCase().split(".").pop();
    return extension ? mediaExtensions.includes(extension) : false;
  }

  /**
   * Get media type category from filename
   */
  private static getMediaType(fileName: string): string {
    const extension = fileName.toLowerCase().split(".").pop();

    const imageExts = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "bmp",
      "tiff",
      "svg",
    ];
    const videoExts = ["mp4", "mov", "avi", "mkv", "webm", "3gp", "wmv", "flv"];
    const audioExts = ["mp3", "wav", "aac", "ogg", "m4a", "wma", "opus"];

    if (extension) {
      if (imageExts.includes(extension)) return "image";
      if (videoExts.includes(extension)) return "video";
      if (audioExts.includes(extension)) return "audio";
    }

    return "document";
  }

  /**
   * Clean filename for better matching (remove special chars, normalize)
   */
  private static cleanFileName(fileName: string): string {
    return fileName
      .replace(/[^\w\s.-]/g, "") // Remove special characters except dots, hyphens, underscores
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();
  }

  /**
   * Link media files to messages based on timestamps and content analysis
   */
  private static linkMediaToMessages(
    chat: Chat,
    mediaFiles: Map<string, MediaFile>
  ): Chat {
    console.log("Linking media files to messages...");

    const updatedMessages = chat.messages.map((message) => {
      if (message.type === "text" || message.type === "system") {
        return message;
      }

      // Try to find matching media file
      const mediaFile = this.findMediaForMessage(message, mediaFiles);

      if (mediaFile) {
        console.log(
          `Linked media file ${mediaFile.name} to message ${message.id}`
        );

        // Extract caption if the message content has both media reference and text
        let caption: string | undefined = message.content;
        if (
          caption.toLowerCase().includes("media omitted") ||
          caption.toLowerCase().includes("image omitted") ||
          caption.toLowerCase().includes("video omitted")
        ) {
          // Check if there's additional text that could be a caption
          const lines = caption.split("\n");
          const captionLines = lines.filter(
            (line) =>
              !line.toLowerCase().includes("omitted") && line.trim().length > 0
          );

          caption =
            captionLines.length > 0 ? captionLines.join("\n") : undefined;
        }

        return {
          ...message,
          mediaFile,
          caption:
            caption && caption.trim() !== message.content ? caption : undefined,
        };
      }

      return message;
    });

    return {
      ...chat,
      messages: updatedMessages,
    };
  }

  /**
   * Find media file that matches a message based on various heuristics
   */
  private static findMediaForMessage(
    message: any,
    mediaFiles: Map<string, MediaFile>
  ): MediaFile | undefined {
    // Strategy 1: Look for direct filename references in message content
    const content = message.content.toLowerCase();

    // Extract potential filenames from the message content
    const filenamePatterns = [
      /([a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)/g, // Basic filename pattern
      /([a-zA-Z0-9_-]+\s*-\s*[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)/g, // Filename with dashes
    ];

    for (const pattern of filenamePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          const cleanMatch = match.trim();
          if (mediaFiles.has(cleanMatch)) {
            return mediaFiles.get(cleanMatch);
          }
          if (mediaFiles.has(cleanMatch.toLowerCase())) {
            return mediaFiles.get(cleanMatch.toLowerCase());
          }
        }
      }
    }

    // Strategy 2: Find media files with timestamps close to the message timestamp
    const messageTime = message.timestamp.getTime();
    const timeWindow = 5 * 60 * 1000; // 5 minutes window

    for (const [fileName, mediaFile] of mediaFiles) {
      // Try to extract timestamp from filename
      const fileTime = this.extractTimestampFromFilename(fileName);
      if (fileTime && Math.abs(fileTime - messageTime) <= timeWindow) {
        // Verify the media type matches
        if (this.messageTypeMatchesMedia(message.type, mediaFile.type)) {
          return mediaFile;
        }
      }
    }

    // Strategy 3: Sequential matching - match media files in order of appearance
    // This is a fallback for when other strategies fail
    // We'll implement a more sophisticated version later if needed

    return undefined;
  }

  /**
   * Extract timestamp from filename if possible
   */
  private static extractTimestampFromFilename(fileName: string): number | null {
    // WhatsApp often names files with patterns like:
    // IMG-20231225-WA0001.jpg
    // VID-20231225-WA0001.mp4
    // AUD-20231225-WA0001.opus

    const timestampPatterns = [
      /(\d{4})(\d{2})(\d{2})/, // YYYYMMDD
      /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    ];

    for (const pattern of timestampPatterns) {
      const match = fileName.match(pattern);
      if (match) {
        const [, year, month, day] = match;
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
        if (!isNaN(date.getTime())) {
          return date.getTime();
        }
      }
    }

    return null;
  }

  /**
   * Check if message type matches media file type
   */
  private static messageTypeMatchesMedia(
    messageType: string,
    mediaType: string
  ): boolean {
    return (
      messageType === mediaType ||
      (messageType === "document" &&
        ["image", "video", "audio"].includes(mediaType))
    );
  }
}
