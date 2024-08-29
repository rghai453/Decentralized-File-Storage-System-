// server.js
import express from 'express';
import crypto from 'crypto';
import * as ethUtil from 'ethereumjs-util';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your-jwt-secret';  // In production, use a secure, environment-specific secret

// Store nonces (you'd use a database in production)
const nonces = new Map();

app.post('/auth/nonce', (req, res) => {
  const address = req.body.address.toLowerCase();
  const nonce = crypto.randomBytes(16).toString('hex');
  nonces.set(address, nonce);
  res.json({ nonce });
});

app.post('/auth/verify', (req, res) => {
  const { address, signature } = req.body;
  const nonce = nonces.get(address.toLowerCase());

  if (!nonce) {
    return res.status(400).json({ error: 'Invalid nonce' });
  }

  const message = `Please sign this message to login: ${nonce}`;
  const msgBuffer = Buffer.from(message);
  const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
  const signatureBuffer = ethUtil.toBuffer(signature);
  const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
  const publicKey = ethUtil.ecrecover(
    msgHash,
    signatureParams.v,
    signatureParams.r,
    signatureParams.s
  );
  const addressBuffer = ethUtil.publicToAddress(publicKey);
  const recoveredAddress = ethUtil.bufferToHex(addressBuffer);

  if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
    const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '1h' });
    nonces.delete(address.toLowerCase());
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));