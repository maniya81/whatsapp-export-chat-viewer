// Test the parser with the user's actual chat format
import { ChatParser } from "./chatParser";

const testContent = `05/02/22, 8:06 pm - Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. Learn more.
05/02/22, 8:06 pm - Sagar: Hi
05/02/22, 9:08 pm - +91 98791 35007: Hiee
06/02/22, 1:00 am - Sagar: IMG-20220205-WA0028.jpg (file attached)
Tamne pan aaje lai aavva ta ahi
06/02/22, 2:12 am - +91 98791 35007: Frd na mrj che?
06/02/22, 2:17 am - Sagar: Ha`;

console.log("=== Testing Parser with User's Format ===");
const result = ChatParser.parseWhatsAppExport(testContent, "test.txt");
console.log("Messages found:", result.messages.length);
console.log(
  "Messages:",
  result.messages.map((m) => `${m.sender}: ${m.content.substring(0, 50)}...`)
);

export { testContent };
