import { Router } from 'express';
import { success } from '../../Common/index.js';
import { deleteUser, updateUserData } from './user.service.js';

export const router = Router();

router.get('/', (req, res, next) => {
  success(res, 200, 'Welcome to user page', req.user);
});

router.patch('/', async (req, res, next) => {
  try {
    const updatedData = await updateUserData(req.headers.authorization, req.body);
    success(res, 200, 'User data updated', updatedData);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const delUser = await deleteUser(req.headers.authorization);
    success(res, 200, delUser.message, delUser.data);
  } catch (error) {
    next(error);
  }
});
