// Sample WhatsApp export formats for testing
export const sampleWhatsAppFormats = [
  {
    name: "Format 1: Brackets with seconds",
    sample: `[25/12/2023, 10:30:45] John: Hello there!
[25/12/2023, 10:31:20] Jane: Hi! How are you?
[25/12/2023, 10:32:15] John: I'm doing great, thanks for asking!`,
    pattern:
      /^\[(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2}:\d{2})\]\s(.+?):\s(.+)$/,
  },
  {
    name: "Format 2: No brackets, dash separator",
    sample: `25/12/2023, 10:30 - John: Hello there!
25/12/2023, 10:31 - Jane: Hi! How are you?
25/12/2023, 10:32 - John: I'm doing great, thanks for asking!`,
    pattern: /^(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2})\s-\s(.+?):\s(.+)$/,
  },
  {
    name: "Format 3: US format with AM/PM",
    sample: `12/25/2023, 10:30:45 AM - John: Hello there!
12/25/2023, 10:31:20 AM - Jane: Hi! How are you?
12/25/2023, 10:32:15 AM - John: I'm doing great, thanks for asking!`,
    pattern:
      /^(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2}:\d{2}\s(?:AM|PM))\s-\s(.+?):\s(.+)$/,
  },
];

export function testChatParser() {
  console.log("Testing chat parser with different formats...");

  sampleWhatsAppFormats.forEach((format) => {
    console.log(`\n--- Testing ${format.name} ---`);
    console.log("Sample:", format.sample);

    const lines = format.sample.split("\n");
    lines.forEach((line) => {
      const match = line.match(format.pattern);
      console.log(`Line: "${line}"`);
      console.log(`Match:`, match ? "YES" : "NO");
      if (match) {
        console.log(
          `  Date: ${match[1]}, Time: ${match[2]}, Sender: ${match[3]}, Content: ${match[4]}`
        );
      }
    });
  });
}
