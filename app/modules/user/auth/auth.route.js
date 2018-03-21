import express from 'express';
// We import all controller function to associate with routes
import { login, register, logout, loginFacebook, valid, sendConfirmationEmail } from './auth.controller';
// import { verifyToken } from './auth.service';

// We init the router to use method
const router = express.Router();

// if token
// Token is needed for all routes
// router.use(verifyToken);

// .post login a user
router.route('/login')
  .post(login);

// .post register a user
router.route('/register')
  .post(register);

// .post send a confirmation email
router.route('/sendConfirmationEmail')
  .post(sendConfirmationEmail);

// .get valid an account user
router.route('/valid/:token')
  .get(valid);

// .get logout an user
router.route('/logout')
  .get(logout);

// Facebook connection
router.post('/facebook', loginFacebook);

export default router;
