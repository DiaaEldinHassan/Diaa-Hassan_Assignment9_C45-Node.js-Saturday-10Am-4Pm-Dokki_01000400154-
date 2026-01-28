import crypto from 'node:crypto';
import { secretKey } from '../../../Config/config.service.js';
import { errorThrow } from './errorThrow.utils.js';

export function encryption(data) {
  if (!Array.isArray(data)) {
    errorThrow(400, 'Data must be an array of strings');
  }

  const key = Buffer.from(secretKey, 'hex');

  if (key.length !== 32) {
    errorThrow(400, 'Secret key must be exactly 32 bytes');
  }

  const algorithm = 'aes-256-cbc';

  return data.map((value) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      iv: iv.toString('hex'),
      number: encrypted
    };
  });
}
