import crypto from 'crypto'

export function sign(srcData: string, privateKey: string): string {
    const key = crypto.createPrivateKey(privateKey);
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(srcData);
    const signature = signer.sign(key);
    return signature.toString("base64");
  }