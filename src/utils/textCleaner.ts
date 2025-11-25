/**
 * Utility functions for cleaning and formatting text content
 */

/**
 * Removes HTML tags and entities from text, preserving line breaks as spaces
 */
export const stripHTML = (html: string): string => {
  if (!html) return '';
  
  // Remove HTML tags but preserve content, handle line breaks properly
  let text = html
    .replace(/<br\s*\/?>/gi, ' ') // Convert <br> tags to spaces
    .replace(/<\/p>/gi, ' ') // Convert closing </p> tags to spaces
    .replace(/<p[^>]*>/gi, '') // Remove opening <p> tags
    .replace(/<[^>]*>/g, ' '); // Remove all other HTML tags
  
  // Decode common HTML entities
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&hellip;': '...',
    '&mdash;': '—',
    '&ndash;': '–',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"'
  };
  
  Object.entries(entities).forEach(([entity, replacement]) => {
    text = text.replace(new RegExp(entity, 'g'), replacement);
  });
  
  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\n+/g, ' ') // Convert line breaks to spaces
    .trim();
  
  return text;
};

/**
 * Cleans text for SEO meta descriptions
 * - Removes HTML
 * - Limits length
 * - Ensures proper formatting
 */
export const cleanSEODescription = (text: string, maxLength: number = 160): string => {
  if (!text) return '';
  
  let cleaned = stripHTML(text);
  
  // Truncate if too long, but try to end at a word boundary
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
    const lastSpace = cleaned.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) { // Only truncate at word if it's not too far back
      cleaned = cleaned.substring(0, lastSpace);
    }
    cleaned += '...';
  }
  
  return cleaned;
};

/**
 * Cleans text for SEO titles
 */
export const cleanSEOTitle = (text: string, maxLength: number = 60): string => {
  if (!text) return '';
  
  let cleaned = stripHTML(text);
  
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
    const lastSpace = cleaned.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      cleaned = cleaned.substring(0, lastSpace);
    }
    cleaned += '...';
  }
  
  return cleaned;
};

/**
 * Cleans and formats keywords
 */
export const cleanSEOKeywords = (text: string): string => {
  if (!text) return '';
  
  let cleaned = stripHTML(text);
  
  // Split by common separators and clean each keyword
  const keywords = cleaned
    .split(/[,;|]/)
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 0)
    .slice(0, 10); // Limit to 10 keywords
  
  return keywords.join(', ');
};