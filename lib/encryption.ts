/**
 * Simple encryption/decryption utility for client-side storage
 * Note: This is not highly secure but provides basic obfuscation
 */

// A simple encryption key - in a real app, this would be more secure
const ENCRYPTION_KEY = "ai-chatbot-encryption-key";

export function encryptData(data: string): string {
  if (!data) return "";
  
  try {
    // Simple XOR encryption
    const encrypted = Array.from(data)
      .map((char, i) => {
        const keyChar = ENCRYPTION_KEY[i % ENCRYPTION_KEY.length];
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
      })
      .join('');
    
    // Convert to base64 for safe storage
    return btoa(encrypted);
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
}

export function decryptData(encryptedData: string): string {
  if (!encryptedData) return "";
  
  try {
    // Decode from base64
    const encrypted = atob(encryptedData);
    
    // Reverse the XOR encryption
    const decrypted = Array.from(encrypted)
      .map((char, i) => {
        const keyChar = ENCRYPTION_KEY[i % ENCRYPTION_KEY.length];
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
      })
      .join('');
    
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
}
