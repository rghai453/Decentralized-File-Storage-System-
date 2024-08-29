import { blockChainConnection } from './blockchainConnection';
import { fileController } from './fileController';
import { FileEncryption } from './fileSecurity';
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

let fileControllerInstance: fileController;
let userAddress: string;


async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider.getSigner();
            userAddress = await (await signer).getAddress();
            document.getElementById('authStatus')!.textContent = `Connected: ${userAddress}`;
            document.getElementById('fileSystem')!.style.display = 'block';
            document.getElementById('connectButton')!.style.display = 'none';

            // Initialize fileController here
            const contractAddress = '0x6BB8b7741F6FBDE29d78103bA747A944A61EE941';
            const contractABI = '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"fileHash","type":"string"},{"indexed":false,"internalType":"string","name":"fileName","type":"string"},{"indexed":false,"internalType":"uint256","name":"fileSize","type":"uint256"},{"indexed":false,"internalType":"string","name":"pinAddress","type":"string"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"FileStored","type":"event"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"files","outputs":[{"internalType":"string","name":"fileName","type":"string"},{"internalType":"uint256","name":"fileSize","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"pinAddress","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"fileHash","type":"string"}],"name":"getFile","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"fileHash","type":"string"},{"internalType":"string","name":"fileName","type":"string"},{"internalType":"uint256","name":"fileSize","type":"uint256"},{"internalType":"string","name":"pinAddress","type":"string"}],"name":"storeFile","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userFiles","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]';
            const providerURL = 'https://sepolia.infura.io/v3/5a6b8e8d23744844aa033cf9aad47ef4';
            const privateKey = '0x8c5aba4b00c0f2d23090b4c65d2b9fa849981148a4aa4db963b3e29ea29b0b4f'; 

            const blockchainConnection = new blockChainConnection(
                contractAddress,
                contractABI,
                providerURL,
                privateKey
            );

            fileControllerInstance = new fileController(blockchainConnection);

        } catch (error) {
            console.error('Failed to connect wallet:', error);
            document.getElementById('authStatus')!.textContent = 'Failed to connect wallet';
        }
    } else {
        document.getElementById('authStatus')!.textContent = 'Please install MetaMask';
    }
}

async function uploadFile() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    console.log(fileInput)
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file to upload');
        return;
    }

    try {
        const buffer = await file.arrayBuffer();
        console.log('Your buffer has generated')
        const fileBuffer = new Uint8Array(buffer);
        console.log('A file buffer has been generated')
        const key = await FileEncryption.generateKey(256);
        const fileHash = await fileControllerInstance.uploadFile(fileBuffer, file.name, key);
        console.log('A file hash has been generated')
        document.getElementById('uploadResult')!.textContent = `File uploaded successfully. File Hash: ${fileHash}`;
        alert(`Your encryption key is: ${key.toString('hex')}. Please save this key to decrypt your file later.`);
    } catch (error) {
        console.error('Error uploading file:', error);
        document.getElementById('uploadResult')!.textContent = 'Error uploading file';
    }
}

async function downloadFile() {
    const fileHash = (document.getElementById('fileHash') as HTMLInputElement).value;
    if (!fileHash) {
        alert('Please enter a file hash');
        return;
    }

    const keyHex = prompt('Please enter your encryption key:');
    if (!keyHex) {
        alert('Encryption key is required');
        return;
    }

    try {
        const key = Buffer.from(keyHex, 'hex');
        const fileBuffer = await fileControllerInstance.downloadFile(fileHash, key);
        const blob = new Blob([fileBuffer]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'downloaded-file';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        document.getElementById('downloadResult')!.textContent = 'File downloaded successfully';
    } catch (error) {
        console.error('Error downloading file:', error);
        document.getElementById('downloadResult')!.textContent = 'Error downloading file';
    }
}

document.getElementById('connectButton')!.addEventListener('click', connectWallet);
document.getElementById('uploadButton')!.addEventListener('click', uploadFile);
document.getElementById('downloadButton')!.addEventListener('click', downloadFile);

// Make functions available globally
(window as any).uploadFile = uploadFile;
(window as any).downloadFile = downloadFile;


