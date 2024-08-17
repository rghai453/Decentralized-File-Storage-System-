import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";

declare global {
    interface Window {
      ethereum?: MetaMaskInpageProvider;
    }
  }

  interface AuthResult {
    address: string;
    signature: string;
    message: string;
  }
export class userAuthentication {

    private provider?: ethers.BrowserProvider;

    constructor(){
        if (typeof window.ethereum !== 'undefined'){
            this.provider = new ethers.BrowserProvider(window.ethereum as any)
        }
    }

    async connect() {
        if (!this.provider){
            console.log("Metamask not installed")
            return null 
        }

        try {
            const accounts = await this.provider.send('eth_requestAccoutns', [])
            return accounts[0]
        } catch(error) {
            console.log('User denied', error)
            return null 
        }
    }

    async authenticate(): Promise<AuthResult | null> {
        const address = await this.connect()
        if(!address){
            return null
        }
        const message = `Authentication request ${Date.now()}`;

        try {
            const signer = await this.provider!.getSigner()
            const signature = await signer.signMessage(message)

            return {address, signature, message}
        } catch (error){
            console.error(error)
            return null
        }
    }

    async verifySignature(address:string, signature:string, message:string): Promise<boolean>{
        try {
            const recoveredAddress = ethers.verifyMessage(message, signature)
            return recoveredAddress.toLowerCase() === address.toLowerCase()
        } catch(error) {
            console.error(error)
            return false 
        }
    }
}