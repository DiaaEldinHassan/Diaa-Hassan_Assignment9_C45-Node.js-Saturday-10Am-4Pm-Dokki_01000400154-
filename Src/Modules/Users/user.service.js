import { userModel } from '../../DB/index.js';
import { encryption, errorThrow, verifyToken } from '../../Common/index.js';
import { checkTokenAndDecode } from '../../Common/index.js';

export async function updateUserData(token, updateData) {
  const header = await checkTokenAndDecode(token);
  if (!header) errorThrow(401, 'User not authorized');
  try {
    if (updateData.phone) {
      updateData.phone = await encryption(updateData.phone);
    }
    const user = await userModel.findByIdAndUpdate(
      header._id, 
      updateData, 
      { new: true, runValidators: true }
    );
    if (!user) {
      return errorThrow(404, 'User not found in the database');
    }
    let updated = user.toObject(); 
    delete updated.password;
    return { message: 'Updated successfully', data: updated };

  } catch (error) {
    if (error.code === 11000) {
      errorThrow(400, 'Email already exists');
    }
    errorThrow(400, error.message || error);
  }
}

export async function deleteUser(user) {
  const header = await checkTokenAndDecode(user);
  try {
    const user = await userModel.findByIdAndDelete(header._id);
    if (!user) {
      errorThrow(404, 'User Not found');
    }
    return { message: 'User Deleted', data: user };
  } catch (error) {
    errorThrow(400, error);
  }
}
