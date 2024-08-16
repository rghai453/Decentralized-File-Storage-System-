import crypto from "crypto"; 
import {Buffer} from 'buffer'; 


export class FileEncryption{

    static generateKey(): Promise<CryptoKey>{
        const algorithm = {
            name: 'AES-CBC', 
            length: 256
        }
        return crypto.subtle.generateKey(algorithm, 
        true, ['encrypt', 'decrypt']); 
    }

    async cryptoKeyToBuffer(key: CryptoKey): Promise<Buffer> {
        const exported = await crypto.subtle.exportKey(
          key.type === 'public' ? 'spki' : 'pkcs8', 
          key
        );
        return Buffer.from(exported);
      }

    static encryptFile(file: Buffer, key: Buffer): Buffer{
        const iv = crypto.randomBytes(16); 
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv); 
        const encrypted = Buffer.concat([cipher.update(file), cipher.final()]); 
        return Buffer.concat([iv, encrypted]); 
    }

    static decryptFile(encryptedFile: Buffer, key: Buffer): Buffer{
        const iv = encryptedFile.subarray(0, 16);
        const encryptedData = encryptedFile.subarray(16);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    }



}
