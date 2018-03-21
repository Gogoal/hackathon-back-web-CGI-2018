import express from 'express';
import {
  getUsers,
  getUserById,
  getEventsByUserId,
  createUser,
  deleteUser,
  updateUser,
  getMe,
  forgotPassword,
  resetPassword,
  validateResetPassword,
} from './user.controller';
import { verifyToken, isAdmin } from './auth/auth.service';

const router = express.Router();

// .post forgot password, send new one
router.route('/forgotPassword')
  .post(forgotPassword);

// .post reset password user
router.route('/resetPassword')
  .post(resetPassword);

// .post verify reset password user
router.route('/verifyResetPassword')
  .post(validateResetPassword);

// For other webservice, we need a token so we use on the road
if (process.env.NODE_ENV !== 'test') router.use(verifyToken);

// .get Get all Users with filter option
// .post Create a new user
router.route('/')
  .get(isAdmin, getUsers)
  .post(isAdmin, createUser);

// .get Get information user by token
router.route('/me')
  .get(getMe);

// .get Get information user by ID
// .delete Delete user by ID
// .put Update user by ID
router.route('/:id')
  .get(isAdmin, getUserById)
  .delete(isAdmin, deleteUser)
  .put(isAdmin, updateUser);

// .get Get all user event
router.route('/:id/events')
  .get(isAdmin, getEventsByUserId);

export default router;
