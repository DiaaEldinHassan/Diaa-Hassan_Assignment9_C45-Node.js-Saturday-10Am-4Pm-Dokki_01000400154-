import Router from 'express';
import { signIn, signUp } from './auth.service.js';
import { success } from '../../Common/utils/successRes.utils.js';

const router = Router();

router.get('/', async (req, res, next) => {
  res.status(200).send('Welcome to the auth page');
});
// Signup
router.post('/signUp', async (req, res, next) => {
  try {
    const user = await signUp(req.body);
    success(res, 200, 'Done Signing up', user);
  } catch (error) {
    next(error);
  }
});
router.post('/signIn', async (req, res, next) => {
  try {
    const user = await signIn(req.body);
    success(res, 200, user.message, user.token);
  } catch (error) {
    next(error);
  }
});


export { router };
