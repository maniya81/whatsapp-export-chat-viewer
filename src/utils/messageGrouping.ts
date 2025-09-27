import type { Message } from "../types/chat";

export interface MessageGroup {
  sender: string;
  isOutgoing: boolean;
  isSystem: boolean;
  messages: Message[];
  timestamp: Date;
}

export function groupConsecutiveMessages(messages: Message[]): MessageGroup[] {
  if (messages.length === 0) return [];

  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup | null = null;

  for (const message of messages) {
    const isOutgoing = message.sender === "You";
    const isSystem = message.type === "system";

    // Start a new group if:
    // 1. No current group
    // 2. Different sender
    // 3. System message (always standalone)
    // 4. Time gap is more than 5 minutes
    const shouldStartNewGroup =
      !currentGroup ||
      currentGroup.sender !== message.sender ||
      isSystem ||
      currentGroup.isSystem ||
      message.timestamp.getTime() - currentGroup.timestamp.getTime() >
        5 * 60 * 1000;

    if (shouldStartNewGroup) {
      currentGroup = {
        sender: message.sender,
        isOutgoing,
        isSystem,
        messages: [message],
        timestamp: message.timestamp,
      };
      groups.push(currentGroup);
    } else if (currentGroup) {
      currentGroup.messages.push(message);
      // Update timestamp to latest message
      currentGroup.timestamp = message.timestamp;
    }
  }

  return groups;
}

export function shouldShowSenderName(
  group: MessageGroup,
  isGroupChat: boolean
): boolean {
  // Show sender name if:
  // 1. It's a group chat AND
  // 2. Not outgoing message AND
  // 3. Not system message
  return isGroupChat && !group.isOutgoing && !group.isSystem;
}
