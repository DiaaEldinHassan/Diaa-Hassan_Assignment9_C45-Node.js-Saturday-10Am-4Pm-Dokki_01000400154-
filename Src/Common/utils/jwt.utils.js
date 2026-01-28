import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../../../Config/config.service.js";
import { errorThrow } from "./errorThrow.utils.js";
export function getToken(data,options={}) {
    return jwt.sign(data,jwtSecretKey,{expiresIn:"1d",...options});
}

export function verifyToken(token) {
    try {
      return jwt.verify(token, jwtSecretKey);
    } catch (error) {
      errorThrow(401, 'Invalid or expired token');
    }
  }