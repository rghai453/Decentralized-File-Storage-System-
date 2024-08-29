import { IPFSConnection } from "./IPFSConnection";
import { FileEncryption } from "./fileSecurity";
import fs from 'fs/promises';
export class fileController {
    ipfs;
    fe;
    mt;
    constructor(metadataBlockchain) {
        this.ipfs = new IPFSConnection();
        this.fe = new FileEncryption();
        this.mt = metadataBlockchain;
    }
    async uploadFile(file, name, key) {
        //file encryption and key generation
        const encryptedFile = await FileEncryption.encryptFile(file, key);
        //metadata generation
        const cid = await this.ipfs.addFile(encryptedFile);
        const fileHash = this.generateFileHash(encryptedFile);
        const fileSize = encryptedFile.length;
        //store metadata 
        await this.mt.storeMetadata(await fileHash, name, fileSize, cid);
        return fileHash;
    }
    // edit to get key from user as parameter
    async downloadFile(fileHash, key) {
        //get metadata using fileHash 
        const metadata = await this.mt.getMetadata(fileHash);
        //get cid from metadata using file
        const encryptedFile = await this.ipfs.getFile(metadata);
        //return decrypted file
        const decryptedfile = await FileEncryption.decryptFile(encryptedFile, key);
        fs.writeFile('output-file.txt', decryptedfile);
        return decryptedfile;
    }
    async generateFileHash(fileBuffer) {
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', fileBuffer);
        // Convert ArrayBuffer to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
}
