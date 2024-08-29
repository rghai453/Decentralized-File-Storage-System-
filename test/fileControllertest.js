import { fileController } from '../src/fileController.js';
import { blockChainConnection } from '../src/blockchainConnection.js';
import { FileEncryption } from '../src/fileSecurity.js';
async function main() {
    const connection = new blockChainConnection('0x6BB8b7741F6FBDE29d78103bA747A944A61EE941', // Contract address
    '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"fileHash","type":"string"},{"indexed":false,"internalType":"string","name":"fileName","type":"string"},{"indexed":false,"internalType":"uint256","name":"fileSize","type":"uint256"},{"indexed":false,"internalType":"string","name":"pinAddress","type":"string"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"FileStored","type":"event"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"files","outputs":[{"internalType":"string","name":"fileName","type":"string"},{"internalType":"uint256","name":"fileSize","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"pinAddress","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"fileHash","type":"string"}],"name":"getFile","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"fileHash","type":"string"},{"internalType":"string","name":"fileName","type":"string"},{"internalType":"uint256","name":"fileSize","type":"uint256"},{"internalType":"string","name":"pinAddress","type":"string"}],"name":"storeFile","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userFiles","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]', // Contract ABI
    'https://sepolia.infura.io/v3/5a6b8e8d23744844aa033cf9aad47ef4', // Provider URL
    '0x8c5aba4b00c0f2d23090b4c65d2b9fa849981148a4aa4db963b3e29ea29b0b4f' // Private key
    );
    const controller = new fileController(connection);
    try {
        // Upload a file
        const fileContent = 'test file text talk';
        const fileBuffer = Buffer.from(fileContent);
        const key = await FileEncryption.generateKey(256);
        console.log('Your key', key);
        const hash = await controller.uploadFile(fileBuffer, 'talk.txt', key);
        console.log('File uploaded successfully');
        // Download a file
        const downloadedFile = await controller.downloadFile(hash, key);
        console.log('File downloaded successfully');
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
}
main();
