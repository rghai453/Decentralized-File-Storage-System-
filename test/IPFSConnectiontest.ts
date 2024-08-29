
import { IPFSConnection } from '../src/IPFSConnection.js';
import { Buffer } from 'buffer';

async function main() {
  // Create an instance of IPFSConnection
  const ipfs = new IPFSConnection();

  try {
    // Example: Adding a file
    const content = 'Hello, this is a test file for IPFS!';
    const fileBuffer = Buffer.from(content);

    console.log('Adding file to IPFS...');
    const cid = await ipfs.addFile(fileBuffer);
    console.log(`File added successfully. CID: ${cid}`);

    // Example: Retrieving a file
    console.log('Retrieving file from IPFS...');
    const retrievedBuffer = await ipfs.getFile(cid);
    const retrievedContent = retrievedBuffer.toString();
    console.log('Retrieved content:', retrievedContent);

    // Verify the content matches
    if (content === retrievedContent) {
      console.log('Content verification successful!');
    } else {
      console.log('Content verification failed.');
    }

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the main function
main().catch(console.error);