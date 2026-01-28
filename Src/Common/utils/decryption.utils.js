import crypto from 'node:crypto';
import { secretKey } from '../../../Config/config.service.js';
import { errorThrow } from './errorThrow.utils.js';

export function decryption(data) {
  const values = Array.isArray(data) ? data : [data];

  const key = Buffer.from(secretKey, 'hex');

  if (key.length !== 32) {
    errorThrow(400, 'Secret key must be exactly 32 bytes');
  }

  const algorithm = 'aes-256-cbc';

  return values.map((item) => {
    if (
      !item ||
      typeof item !== 'object' ||
      typeof item.iv !== 'string' ||
      typeof item.number !== 'string'
    ) {
      errorThrow(400, 'Invalid encrypted phone format');
    }

    const iv = Buffer.from(item.iv, 'hex');

    if (iv.length !== 16) {
      errorThrow(400, 'Invalid IV length');
    }

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(item.number, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  });
}
