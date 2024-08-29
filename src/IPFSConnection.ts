import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { CID } from 'multiformats/cid'
import type { Helia } from '@helia/interface'
import type { UnixFS } from '@helia/unixfs'


export class IPFSConnection {
    private helia: any 
    private fs: any 

    constructor(){
        this.init(); 
    }

    private async init() {

        this.helia = await createHelia();
        this.fs = unixfs(this.helia);
      }

    async addFile(file: Uint8Array): Promise<string> {
        if (!this.helia || !this.fs) {
            await this.init(); 
        }
        const cid = await this.fs.addFile({content: file})
        console.log(cid)
        return cid.toString(); 
    }

    async getFile(cid: string): Promise<Buffer> {
        if (!this.helia || !this.fs) {
            await this.init(); 
        }
        const parsedCID = CID.parse(cid); 
        const chunks = []
        for await (const chunk of this.fs.cat(parsedCID)){
            chunks.push(chunk)
        }
        return Buffer.concat(chunks); 
    }
}