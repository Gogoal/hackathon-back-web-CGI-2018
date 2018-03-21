import * as randomstring from 'randomstring';
import logger from '../../../helpers/logger.helper';
import ForgotPassword from './forgotPassword.schema';
import { AuthService } from '../auth/auth.service';

/**
 * Create a new forgot password for the idUser and send a mail
 * @param idUser
 * @param email
 * @return {Promise<void>}
 */
export async function createForgotPassword(idUser, email) {
  // Generate random number for token
  const token = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });

  const forgotPassword = new ForgotPassword({ token, user: idUser });

  return forgotPassword.save((err) => {
    if (err) {
      logger.error(err);
      throw err;
    }
    AuthService.sendForgotPasswordMail(email, token);
  });
}

/**
 * Method to verify the token of the new password of the user of
 * @param userId
 * @param token
 * @return {Promise<boolean>}
 */
export async function verifyForgotPasswordToken(userId, token) {
  const forgotPasswordTarget = await ForgotPassword.findOne({ user: userId, token });
  // If the token doesn't correspond to the user
  if (!forgotPasswordTarget) {
    logger.debug('Token not found.');
    throw new Error('Token not found.');
  }

  const dateExp = new Date(forgotPasswordTarget.createdAt);
  dateExp.setMinutes(dateExp.getMinutes() + 5);
  if (dateExp < new Date()) {
    throw new Error('Token expired.');
  }

  return true;
}
