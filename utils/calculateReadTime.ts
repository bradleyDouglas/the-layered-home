/**
 * Calculates estimated read time in minutes based on content word count
 * Assumes average reading speed of 200-250 words per minute
 */
export function calculateReadTime(content: any[]): number {
  if (!content || !Array.isArray(content)) {
    return 0;
  }

  let wordCount = 0;

  // Recursively count words in content blocks
  const countWords = (blocks: any[]): void => {
    blocks.forEach((block) => {
      if (block._type === "block" && block.children) {
        block.children.forEach((child: any) => {
          if (child.text) {
            // Count words in text (split by whitespace)
            const words = child.text.trim().split(/\s+/).filter(Boolean);
            wordCount += words.length;
          }
        });
      }
      // Handle nested content in other block types if needed
      if (block.content && Array.isArray(block.content)) {
        countWords(block.content);
      }
    });
  };

  countWords(content);

  // Calculate minutes (using 225 words per minute as average)
  const minutes = Math.ceil(wordCount / 225);

  // Return at least 1 minute if there's any content
  return Math.max(1, minutes);
}
