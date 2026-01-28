import { config } from 'dotenv';
import { resolve } from 'node:path';
config({ path: resolve('Config/.env.development') });
export const serverPort = process.env.PORT;
export const uri = process.env.DB_URI;
export const offline_db=process.env.OFFLINE_DB;
export const secretKey = process.env.SECRET_KEY;
export const jwtSecretKey = process.env.JWT_SECRET_KEY;
