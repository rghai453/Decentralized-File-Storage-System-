import {ethers} from 'ethers'

export class blockChainConnection {

    private contract: ethers.Contract
    private signer: ethers.Signer

    constructor(
        contractAddress: string,
        contractABI:string,
        providerURL:string, 
        privateKey:string
    ){
        const provider = new ethers.JsonRpcProvider(providerURL)
        this.signer = new ethers.Wallet(privateKey, provider)
        this.contract = new ethers.Contract(contractAddress, contractABI, this.signer)
    }

    async storeMetadata(fileHash: string, fileName: string, fileSize: number, pinAddress: string ) : Promise<void>{
        try {
            const tx = await this.contract.storeFile(fileHash, fileName, fileSize, pinAddress)
            await tx.wait()
        }catch (error) {
            console.error('Error storing metadata:', error);
            throw error;
          }
    }

    async getMetadata(fileHash:string): Promise<string> {
        try {
            const result = await this.contract.getFile(fileHash)
            return result[3]
        } catch (error) {
            console.error('Error retrieving metadata:', error);
            throw error;
        }
    }


}