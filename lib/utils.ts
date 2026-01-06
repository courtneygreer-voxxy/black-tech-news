/**
 * Encode article ID to URL-safe format for routing
 * Replaces problematic characters that cause filesystem issues
 */
export function encodeArticleId(id: string): string {
  // Use base64url encoding to avoid filesystem issues with special chars
  // Replace : / ? # [ ] @ ! $ & ' ( ) * + , ; = with safe characters
  return Buffer.from(id, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Decode URL-safe article ID back to original format
 */
export function decodeArticleId(encoded: string): string {
  // Reverse the base64url encoding
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  const padded = base64 + '=='.substring(0, (4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf-8');
}
