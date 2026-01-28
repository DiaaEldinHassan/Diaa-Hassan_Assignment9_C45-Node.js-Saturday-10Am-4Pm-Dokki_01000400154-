import { userModel } from '../../DB/index.js';
import { errorThrow, verifyToken } from '../../Common/index.js';

export async function authorization(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return errorThrow(401, 'User not authorized');
    }

    const token = header.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await userModel.findById(decoded._id);
    if (!user) {
      return errorThrow(401, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    return errorThrow(401, error.message);
  }
}