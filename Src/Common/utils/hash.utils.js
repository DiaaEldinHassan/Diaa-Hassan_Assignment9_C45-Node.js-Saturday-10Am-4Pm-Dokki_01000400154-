import { hash, compare } from 'bcrypt';

export async function hashing(password) {
  const hashed = await hash(password, 10);
  return hashed;
}

export async function comparing(password, hashedPassword) {
  return await compare(password, hashedPassword);
}
