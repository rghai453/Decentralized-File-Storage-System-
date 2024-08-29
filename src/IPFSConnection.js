import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { CID } from 'multiformats/cid';
export class IPFSConnection {
    helia;
    fs;
    constructor() {
        this.init();
    }
    async init() {
        this.helia = await createHelia();
        this.fs = unixfs(this.helia);
    }
    async addFile(file) {
        if (!this.helia || !this.fs) {
            await this.init();
        }
        const cid = await this.fs.addFile({ content: file });
        return cid.toString();
    }
    async getFile(cid) {
        if (!this.helia || !this.fs) {
            await this.init();
        }
        const parsedCID = CID.parse(cid);
        const chunks = [];
        for await (const chunk of this.fs.cat(parsedCID)) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }
}
