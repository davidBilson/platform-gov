
const str2ab = (str) => {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  };
  
  // Convert ArrayBuffer to string after decryption
  const ab2str = (buf) => {
    const decoder = new TextDecoder();
    return decoder.decode(buf);
  };
  
  // Generate a random 16-byte IV (Initialization Vector)
  const generateIV = () => {
    return window.crypto.getRandomValues(new Uint8Array(16));
  };
  
  // Derive a key from the thread ID
  const deriveKey = async (threadId) => {
    
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      str2ab(`${threadId}-encryption-key`),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    
    // Use PBKDF2 to derive an AES-GCM key
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: str2ab("govlink-secure-chat"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };
  
  /**
   * Encrypts a message using AES-GCM
   * @param {string} threadId - The thread ID for key derivation
   * @param {string} message - The plaintext message to encrypt
   * @returns {Promise<{ciphertext: string, iv: string}>} - The encrypted message and IV in base64
   */
  export const encryptMessage = async (threadId, message) => {
    try {
      const key = await deriveKey(threadId);
      const iv = generateIV();
      
      // Encrypt the message
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        str2ab(message)
      );
      
      // Convert to base64 for storage/transmission
      return {
        ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        iv: btoa(String.fromCharCode(...iv))
      };
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  };
  
  export const decryptMessage = async (threadId, encryptedMessage, ivBase64) => {
    try {
      const key = await deriveKey(threadId);
      
      // Convert base64 to ArrayBuffer
      const encryptedData = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));
      const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
      
      // Decrypt the message
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        encryptedData
      );
      
      return ab2str(decrypted);
    } catch (error) {
      console.error("Decryption error:", error);
      return "";
    }
  };