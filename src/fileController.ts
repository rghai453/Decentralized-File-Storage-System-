import { IPFSConnection } from "./IPFSConnection";
import { FileEncryption } from "./fileSecurity";
import crypto from "crypto"; 
import { blockChainConnection } from "./blockchainConnection";
import fs from 'fs/promises'; 


export class fileController {

    private ipfs : IPFSConnection
    private fe :FileEncryption 
    private mt :blockChainConnection

    constructor(metadataBlockchain: blockChainConnection){
        this.ipfs = new IPFSConnection()
        this.fe = new FileEncryption()
        this.mt = metadataBlockchain
    }

     async uploadFile(file: Uint8Array, name: string, key: Buffer): Promise<string> {
        //file encryption and key generation
        const encryptedFile = await FileEncryption.encryptFile(file, key)

        //metadata generation
        const cid = await this.ipfs.addFile(encryptedFile)
        const fileHash = this.generateFileHash(encryptedFile)
        const fileSize = encryptedFile.length 

        //store metadata 
        await this.mt.storeMetadata(await fileHash, name, fileSize, cid)
        return fileHash
    }

        // edit to get key from user as parameter
     async downloadFile(fileHash:string, key: Buffer): Promise<Buffer>{
        //get metadata using fileHash 
        const metadata = await this.mt.getMetadata(fileHash)
        //get cid from metadata using file
        const encryptedFile = await this.ipfs.getFile(metadata)
        //return decrypted file
        const decryptedfile = await FileEncryption.decryptFile(encryptedFile, key)
        fs.writeFile('output-file.txt', decryptedfile);
        return decryptedfile; 
    }

    private async generateFileHash(fileBuffer: Buffer): Promise<string> {
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', fileBuffer);

        // Convert ArrayBuffer to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
        return hashHex;
      }
}