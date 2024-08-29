import { blockChainConnection } from '../src/blockchainConnection.js';

async function main() {
    // Initialize the blockchain connection
    const connection = new blockChainConnection(
        '0x6BB8b7741F6FBDE29d78103bA747A944A61EE941', // Contract address
        '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"fileHash","type":"string"},{"indexed":false,"internalType":"string","name":"fileName","type":"string"},{"indexed":false,"internalType":"uint256","name":"fileSize","type":"uint256"},{"indexed":false,"internalType":"string","name":"pinAddress","type":"string"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"FileStored","type":"event"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"files","outputs":[{"internalType":"string","name":"fileName","type":"string"},{"internalType":"uint256","name":"fileSize","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"pinAddress","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"fileHash","type":"string"}],"name":"getFile","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"fileHash","type":"string"},{"internalType":"string","name":"fileName","type":"string"},{"internalType":"uint256","name":"fileSize","type":"uint256"},{"internalType":"string","name":"pinAddress","type":"string"}],"name":"storeFile","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userFiles","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]', // Contract ABI
        'https://mainnet.infura.io/v3/5a6b8e8d23744844aa033cf9aad47ef4', // Provider URL
        '0x8c5aba4b00c0f2d23090b4c65d2b9fa849981148a4aa4db963b3e29ea29b0b4f' // Private key
    );

    try {
        // Store metadata
        await connection.storeMetadata(
            'QmX4zdq1fJ9wXvRWYgkL4RKnQAeV5VXgFPpNehyEdfjsrz', // File hash
            'example.txt', // File name
            1024, // File size in bytes
            'ipfs://QmX4zdq1fJ9wXvRWYgkL4RKnQAeV5VXgFPpNehyEdfjsrz' // IPFS address
        );
        console.log('Metadata stored successfully');

        // Retrieve metadata
        const pinAddress = await connection.getMetadata('QmX4zdq1fJ9wXvRWYgkL4RKnQAeV5VXgFPpNehyEdfjsrz');
        console.log('Retrieved pin address:', pinAddress);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();