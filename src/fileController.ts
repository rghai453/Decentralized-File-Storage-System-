import { IPFSConnection } from "./IPFSConnection";
import { FileEncryption } from "./fileSecurity";
import crypto from "crypto"; 
import { blockChainConnection } from "./blockchainConnection";


export class fileController {

    private ipfs : IPFSConnection
    private fe :FileEncryption 
    private mt :blockChainConnection

    constructor(metadataBlockchain: blockChainConnection){
        this.ipfs = new IPFSConnection()
        this.fe = new FileEncryption()
        this.mt = metadataBlockchain
    }

    async uploadFile(file: Buffer, name: string): Promise<void> {
        //file encryption and key generation
        const key = (await FileEncryption.generateKey())
        const exkey = await this.fe.cryptoKeyToBuffer(key)
        const encryptedFile = await FileEncryption.encryptFile(file, exkey)

        //metadata generation
        const cid = await this.ipfs.addFile(encryptedFile)
        const fileHash = this.generateFileHash(encryptedFile)
        const fileSize = encryptedFile.length 

        //store metadata 
        await this.mt.storeMetadata(fileHash, name, fileSize, cid)

    }

    async downloadFile(fileHash:string): Promise<Buffer>{
        //get metadata using fileHash 
        const metadata = await this.mt.getMetadata(fileHash)
        //get cid from metadata using file
        const encryptedFile = await this.ipfs.getFile(metadata)
        const buff = Buffer.from(encryptedFile)
        //get key from user 
        const key = Buffer.from('key')
        //return decrypted file
        const decryptedfile = await FileEncryption.decryptFile(buff, key)
        const fs = require('fs');
        return fs.writeFileSync('output-file', decryptedfile);
    }

    private generateFileHash(fileBuffer: Buffer): string {
        return crypto.createHash('sha256').update(fileBuffer).digest('hex');
      }
}