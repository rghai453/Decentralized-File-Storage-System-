import { userAuthentication } from "../src/userAuthentication";
// Create an instance of the userAuthentication class
const auth = new userAuthentication();
// Example usage in an async function
async function exampleUsage() {
    // Attempt to authenticate the user
    const authResult = await auth.authenticate();
    if (authResult) {
        console.log("Authentication successful!");
        console.log("Address:", authResult.address);
        console.log("Signature:", authResult.signature);
        console.log("Message:", authResult.message);
        // Verify the signature
        const isValid = await auth.verifySignature(authResult.address, authResult.signature, authResult.message);
        if (isValid) {
            console.log("Signature verified successfully!");
            // Proceed with your application logic for authenticated users
        }
        else {
            console.log("Signature verification failed!");
        }
    }
    else {
        console.log("Authentication failed or user denied the request.");
    }
}
// Call the example usage function
exampleUsage();
