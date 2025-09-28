import type { Message, Chat } from "../types/chat";

export class ChatParser {
  static parseWhatsAppExport(content: string, filename: string): Chat {
    console.log("Parsing chat file:", filename);
    console.log("Content preview:", content.substring(0, 500));

    const lines = content.split("\n").filter((line) => line.trim());
    const messages: Message[] = [];

    // Extract chat name from filename (remove .txt and "WhatsApp Chat with " prefix if present)
    const chatName = filename
      .replace(".txt", "")
      .replace(/^WhatsApp Chat with /, "")
      .replace(/^WhatsApp Chat - /, "");

    console.log("Extracted chat name:", chatName);
    console.log("Total lines to parse:", lines.length);

    // Multiple regex patterns to handle different WhatsApp export formats
    const patterns = [
      // Format: [DD/MM/YYYY, HH:MM:SS] Sender: Message
      /^\[(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2}:\d{2})\]\s(.+?):\s(.+)$/,
      // Format: [DD/MM/YYYY, HH:MM:SS AM/PM] Sender: Message
      /^\[(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2}:\d{2}\s(?:AM|PM))\]\s(.+?):\s(.+)$/,
      // Format: DD/MM/YYYY, HH:MM - Sender: Message
      /^(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2})\s-\s(.+?):\s(.+)$/,
      // Format: DD/MM/YYYY, HH:MM:SS - Sender: Message
      /^(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2}:\d{2})\s-\s(.+?):\s(.+)$/,
      // Format: DD/MM/YY, HH:MM am/pm - Sender: Message (2-digit year with AM/PM) - FIXED
      /^(\d{1,2}\/\d{1,2}\/\d{2}),\s(\d{1,2}:\d{2})\s(am|pm|AM|PM)\s-\s(.+?):\s(.+)$/,
      // Format: DD/MM/YY, HH:MM - Sender: Message (2-digit year)
      /^(\d{1,2}\/\d{1,2}\/\d{2}),\s(\d{1,2}:\d{2})\s-\s(.+?):\s(.+)$/,
      // Format: MM/DD/YYYY, HH:MM - Sender: Message (US format)
      /^(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2})\s-\s(.+?):\s(.+)$/,
      // Format: DD.MM.YYYY, HH:MM - Sender: Message (European format)
      /^(\d{1,2}\.\d{1,2}\.\d{4}),\s(\d{1,2}:\d{2})\s-\s(.+?):\s(.+)$/,
    ];

    const systemPatterns = [
      // System messages with brackets
      /^\[(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2}:\d{2})\]\s(.+)$/,
      // System messages without brackets 4-digit year
      /^(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2})\s-\s(.+)$/,
      // System messages without brackets 2-digit year with am/pm - FIXED
      /^(\d{1,2}\/\d{1,2}\/\d{2}),\s(\d{1,2}:\d{2})\s(am|pm|AM|PM)\s-\s(.+)$/,
      // System messages without brackets 2-digit year
      /^(\d{1,2}\/\d{1,2}\/\d{2}),\s(\d{1,2}:\d{2})\s-\s(.+)$/,
    ];

    let currentMessage: Partial<Message> | null = null;
    let patternMatchCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let messageMatched = false;

      // Try to match regular message with any pattern
      for (const pattern of patterns) {
        const messageMatch = line.match(pattern);
        if (messageMatch) {
          // Save previous message if exists
          if (currentMessage) {
            messages.push(currentMessage as Message);
          }

          // Handle different group counts based on pattern
          let date, time, sender, content;
          if (messageMatch.length === 6) {
            // Pattern with separate time and AM/PM: date, time, ampm, sender, content
            [, date, time, , sender, content] = messageMatch;
            time = `${messageMatch[2]} ${messageMatch[3]}`; // Combine time and AM/PM
          } else {
            // Standard pattern: date, time, sender, content
            [, date, time, sender, content] = messageMatch;
          }

          const timestamp = this.parseDateTime(date, time);

          currentMessage = {
            id: `msg-${Date.now()}-${i}`,
            timestamp,
            sender: sender.trim(),
            content: content.trim(),
            type: this.detectMessageType(content),
          };

          messageMatched = true;
          patternMatchCount++;
          break;
        }
      }

      if (!messageMatched) {
        // Try to match system message
        for (const pattern of systemPatterns) {
          const systemMatch = line.match(pattern);
          if (systemMatch) {
            // Save previous message if exists
            if (currentMessage) {
              messages.push(currentMessage as Message);
            }

            // Handle different group counts for system messages
            let date, time, content;
            if (systemMatch.length === 5) {
              // Pattern with separate time and AM/PM: date, time, ampm, content
              [, date, time, , content] = systemMatch;
              time = `${systemMatch[2]} ${systemMatch[3]}`; // Combine time and AM/PM
            } else {
              // Standard pattern: date, time, content
              [, date, time, content] = systemMatch;
            }

            const timestamp = this.parseDateTime(date, time);

            currentMessage = {
              id: `sys-${Date.now()}-${i}`,
              timestamp,
              sender: "System",
              content: content.trim(),
              type: "system",
            };

            messageMatched = true;
            patternMatchCount++;
            break;
          }
        }
      }

      // If line doesn't match any pattern, it's likely a continuation of previous message
      if (!messageMatched && currentMessage) {
        currentMessage.content += "\n" + line;
      } else if (!messageMatched && i < 10) {
        // Log first few unmatched lines for debugging
        console.log(`Unmatched line ${i}:`, line);
      }
    }

    // Add the last message
    if (currentMessage) {
      messages.push(currentMessage as Message);
    }

    console.log(`Pattern matches found: ${patternMatchCount}`);
    console.log(`Total messages parsed: ${messages.length}`);
    console.log("First few messages:", messages.slice(0, 3));

    // Sort messages by timestamp
    messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const lastMessage = messages[messages.length - 1] || null;
    const participants = [
      ...new Set(messages.map((m) => m.sender).filter((s) => s !== "System")),
    ];

    return {
      id: `chat-${Date.now()}`,
      name: chatName,
      lastMessage,
      messages,
      isGroup: participants.length > 2,
      participants,
      createdAt: messages[0]?.timestamp || new Date(),
      updatedAt: lastMessage?.timestamp || new Date(),
    };
  }

  private static parseDateTime(date: string, time: string): Date {
    let parsedDate: Date;

    // Handle different date formats
    if (date.includes(".")) {
      // European format: DD.MM.YYYY or DD.MM.YY
      const [day, month, year] = date.split(".").map(Number);
      const fullYear = year < 100 ? 2000 + year : year; // Convert 2-digit to 4-digit year
      parsedDate = new Date(fullYear, month - 1, day);
    } else {
      // Standard format: DD/MM/YYYY, DD/MM/YY, or MM/DD/YYYY
      const parts = date.split("/").map(Number);
      const [day, month, year] = parts;
      const fullYear = year < 100 ? 2000 + year : year; // Convert 2-digit to 4-digit year
      parsedDate = new Date(fullYear, month - 1, day);
    }

    // Handle different time formats
    if (
      time.toLowerCase().includes("am") ||
      time.toLowerCase().includes("pm")
    ) {
      // 12-hour format (case insensitive)
      const [timePart, period] = time.split(" ");
      const [hours, minutes, seconds = 0] = timePart.split(":").map(Number);
      let adjustedHours = hours;

      if (period.toLowerCase() === "pm" && hours !== 12) {
        adjustedHours += 12;
      } else if (period.toLowerCase() === "am" && hours === 12) {
        adjustedHours = 0;
      }

      parsedDate.setHours(adjustedHours, minutes, seconds);
    } else {
      // 24-hour format
      const timeParts = time.split(":").map(Number);
      const [hours, minutes, seconds = 0] = timeParts;
      parsedDate.setHours(hours, minutes, seconds);
    }

    return parsedDate;
  }

  private static detectMessageType(content: string): Message["type"] {
    const lowerContent = content.toLowerCase();

    // Check for file attachments with extensions
    if (lowerContent.includes("(file attached)")) {
      console.log("Detected file attached pattern in:", content);
      const fileExtension = content
        .match(/\.([a-zA-Z0-9]+)\s*\(/)?.[1]
        ?.toLowerCase();

      if (fileExtension) {
        // Image file types
        if (
          [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "bmp",
            "webp",
            "svg",
            "tiff",
            "tif",
          ].includes(fileExtension)
        ) {
          console.log("Detected as image type:", content);
          return "image";
        }
        // Video file types
        if (
          [
            "mp4",
            "mov",
            "avi",
            "mkv",
            "flv",
            "webm",
            "3gp",
            "wmv",
            "m4v",
          ].includes(fileExtension)
        ) {
          return "video";
        }
        // Audio file types
        if (
          ["mp3", "wav", "aac", "flac", "ogg", "m4a", "wma", "opus"].includes(
            fileExtension
          )
        ) {
          return "audio";
        }
        // Document file types
        if (
          [
            "pdf",
            "doc",
            "docx",
            "txt",
            "rtf",
            "xls",
            "xlsx",
            "ppt",
            "pptx",
            "zip",
            "rar",
          ].includes(fileExtension)
        ) {
          return "document";
        }
      }

      // Default to document if we can't determine the type
      return "document";
    }

    // Legacy patterns for older WhatsApp exports
    if (
      content.includes("<Media omitted>") ||
      lowerContent.includes("image omitted") ||
      lowerContent.includes("video omitted") ||
      lowerContent.includes("media omitted")
    ) {
      return lowerContent.includes("video") ? "video" : "image";
    }
    if (
      content.includes("<audio omitted>") ||
      lowerContent.includes("voice message") ||
      lowerContent.includes("audio omitted")
    ) {
      return "audio";
    }
    if (
      content.includes("<document omitted>") ||
      lowerContent.includes("document omitted") ||
      lowerContent.includes("document")
    ) {
      return "document";
    }
    return "text";
  }
}
