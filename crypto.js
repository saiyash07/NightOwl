/**
 * Night Owl — End-to-End Encryption Module
 * Uses Web Crypto API (browser-native) for ECDH key exchange + AES-GCM encryption.
 * Keys are generated per session and destroyed on disconnect.
 * The server NEVER sees plaintext messages.
 */

class NightOwlCrypto {
  constructor() {
    this.keyPair = null;       // Our ECDH key pair
    this.sharedKey = null;     // Derived AES key for this session
    this.isReady = false;
  }

  /**
   * Generate a new ECDH key pair for this session
   * @returns {Promise<JsonWebKey>} Our public key to send to the peer
   */
  async generateKeyPair() {
    this.keyPair = await window.crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true, // extractable (we need to export the public key)
      ['deriveKey']
    );

    // Export public key as JWK to send to peer
    const publicKeyJwk = await window.crypto.subtle.exportKey('jwk', this.keyPair.publicKey);
    return publicKeyJwk;
  }

  /**
   * Derive shared AES-GCM key from peer's public key
   * @param {JsonWebKey} peerPublicKeyJwk - The peer's public key
   */
  async deriveSharedKey(peerPublicKeyJwk) {
    // Import peer's public key
    const peerPublicKey = await window.crypto.subtle.importKey(
      'jwk',
      peerPublicKeyJwk,
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      []
    );

    // Derive AES-GCM key from shared secret
    this.sharedKey = await window.crypto.subtle.deriveKey(
      { name: 'ECDH', public: peerPublicKey },
      this.keyPair.privateKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    this.isReady = true;
  }

  /**
   * Encrypt a message string
   * @param {string} plaintext - The censored message to encrypt
   * @returns {Promise<{ ciphertext: ArrayBuffer, iv: Uint8Array }>}
   */
  async encrypt(plaintext) {
    if (!this.isReady) throw new Error('Encryption not ready — key exchange incomplete');

    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // Generate random IV for each message
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.sharedKey,
      data
    );

    return { ciphertext, iv };
  }

  /**
   * Decrypt a received message
   * @param {ArrayBuffer} ciphertext
   * @param {Uint8Array} iv
   * @returns {Promise<string>}
   */
  async decrypt(ciphertext, iv) {
    if (!this.isReady) throw new Error('Decryption not ready — key exchange incomplete');

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      this.sharedKey,
      new Uint8Array(ciphertext)
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  /**
   * Destroy all keys — call on session end
   */
  destroy() {
    this.keyPair = null;
    this.sharedKey = null;
    this.isReady = false;
  }

  /**
   * Helper: Convert ArrayBuffer to base64 for transport over Socket.io
   */
  static bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Helper: Convert base64 back to ArrayBuffer
   */
  static base64ToBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

export default NightOwlCrypto;
