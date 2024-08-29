import { Buffer } from 'buffer';
export class FileEncryption {
    static async generateKey(bytes) {
        const key = await window.crypto.subtle.generateKey({
            name: "AES-GCM",
            length: bytes, // 32 bytes = 256 bits
        }, true, // whether the key is extractable (i.e., can be used in exportKey)
        ["encrypt", "decrypt"] // can be used for these operations
        );
        const rawKey = await window.crypto.subtle.exportKey("raw", key);
        const bufferKey = Buffer.from(new Uint8Array(rawKey));
        return bufferKey;
    }
    static async encryptFile(file, key) {
        const cryptoKey = await window.crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['encrypt']);
        // Generate a random IV (initialization vector)
        const iv = window.crypto.getRandomValues(new Uint8Array(16));
        // Encrypt the data
        const encryptedData = await window.crypto.subtle.encrypt({
            name: 'AES-CBC',
            iv: iv
        }, cryptoKey, file);
        // Combine IV and encrypted data
        return Buffer.concat([Buffer.from(iv), Buffer.from(new Uint8Array(encryptedData))]);
    }
    static async decryptFile(encryptedFile, key) {
        const iv = encryptedFile.subarray(0, 16);
        // Extract the encrypted data
        const encryptedData = encryptedFile.subarray(16);
        // Convert the key from Buffer to CryptoKey
        const cryptoKey = await window.crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);
        // Decrypt the data
        const decryptedData = await window.crypto.subtle.decrypt({
            name: 'AES-CBC',
            iv: iv
        }, cryptoKey, encryptedData);
        // Return the decrypted data as a Buffer
        return Buffer.from(new Uint8Array(decryptedData));
    }
}
