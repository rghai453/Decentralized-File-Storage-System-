import { Buffer } from 'buffer';
import { FileEncryption } from '../src/fileSecurity';
async function main() {
    try {
        // Create an instance of FileEncryption
        const fileEncryption = new FileEncryption();
        // Generate a key
        console.log('Generating encryption key...');
        const cryptoKey = await FileEncryption.generateKey(256);
        console.log('Key generated successfully.');
        // Sample file content
        const fileContent = 'This is a secret message that we want to encrypt.';
        const fileBuffer = Buffer.from(fileContent);
        console.log('Original content:', fileContent);
        // Encrypt the file
        console.log('Encrypting file...');
        const encryptedFile = FileEncryption.encryptFile(fileBuffer, cryptoKey);
        console.log('File encrypted. Encrypted data length:', (await encryptedFile).length);
        console.log(encryptedFile);
        // Decrypt the file
        console.log('Decrypting file...');
        const decryptedFile = FileEncryption.decryptFile(await encryptedFile, cryptoKey);
        const decryptedContent = decryptedFile.toString();
        console.log('Decrypted content:', decryptedContent);
        // Verify the decrypted content matches the original
        if (fileContent === decryptedContent) {
            console.log('Encryption and decryption successful!');
        }
        else {
            console.log('Encryption and decryption verification failed.');
        }
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
}
// Run the main function
main().catch(console.error);
