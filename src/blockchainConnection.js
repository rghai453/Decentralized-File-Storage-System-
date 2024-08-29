import { ethers } from 'ethers';
export class blockChainConnection {
    contract;
    signer;
    constructor(contractAddress, contractABI, providerURL, privateKey) {
        const provider = new ethers.JsonRpcProvider(providerURL);
        this.signer = new ethers.Wallet(privateKey, provider);
        this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
    }
    async storeMetadata(fileHash, fileName, fileSize, pinAddress) {
        try {
            const tx = await this.contract.storeFile(fileHash, fileName, fileSize, pinAddress);
            await tx.wait();
        }
        catch (error) {
            console.error('Error storing metadata:', error);
            throw error;
        }
    }
    async getMetadata(fileHash) {
        try {
            const result = await this.contract.getFile(fileHash);
            return result;
        }
        catch (error) {
            console.error('Error retrieving metadata:', error);
            throw error;
        }
    }
}
