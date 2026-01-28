import { userModel } from '../../DB/models/users.model.js';
import { errorThrow } from '../../Common/index.js';
import { encryption } from '../../Common/utils/encryption.utils.js';
import { getToken } from '../../Common/index.js';

export async function signUp(obj) {
  if (!obj.name || !obj.email || !obj.password || !obj.age || !obj.phone) {
    errorThrow(400, 'Please compelete your credentials');
  }
  obj.phone = encryption(obj.phone);
  try {
    const newUser = await userModel.create(obj);
    return {
      success: 'User added successfully',
      data: `New User ID Is : ${newUser._id}`,
    };
  } catch (error) {
    if (error.code === 11000) {
      errorThrow(400, 'Email is already exist');
    }
    errorThrow(400, 'Please Complete your credentials');
  }
}

export async function signIn(obj) {
  if (!obj.email || !obj.password) {
    errorThrow(400, 'Please compelete your credentials');
  }
  const user = await userModel.findOne({ email: obj.email });
  if (user) {
    const userFound = await user.comparePassword(obj.password);
    if (!userFound) {
      errorThrow(401, 'Invalid email or password');
    }

    const newUser = user.toObject();
    delete newUser.password;
    const token = getToken(newUser);
    return {message: "Logged in successfully", token };
  }
  errorThrow(404, 'invalid email or password');
}

