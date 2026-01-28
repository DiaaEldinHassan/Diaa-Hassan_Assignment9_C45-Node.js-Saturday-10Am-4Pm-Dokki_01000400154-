import { verifyToken } from "./jwt.utils.js";

export async function checkTokenAndDecode(token) {
  const header = token;
  if (!header) {
    errorThrow(404, 'User is not authorized');
  }
  const headerToken= header.split(" ")[1];
  const decode=await verifyToken(headerToken);
  return decode;
}
