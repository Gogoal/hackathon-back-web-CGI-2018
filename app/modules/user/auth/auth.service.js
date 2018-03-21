import jwt from 'jsonwebtoken';
import logger from '../../../helpers/logger.helper';
import { config } from '../../../config';
import { EmailService } from '../../../helpers/mail.helper';

/**
 * Verify the user token and return the correspond user in req.userId
 * @param req
 * @param res
 * @param next
 * @return {null}
 */
export function verifyToken(req, res, next) {
  const token = req.get('Authorization');

  // If no token in the request
  // We return an error
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }
  jwt.verify(token.substring(7), config.secret, (err, decoded) => {
    // else we verify the token, if token no valid
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id; // else token exist and is valid
    next();
    return null;
  });
  return null;
}

/**
 * TODO Add all right to the admin
 * @param req
 * @param res
 * @param next
 * @return {null}
 */
export function isAdmin(req, res, next) {
  logger.debug(req.userId);
  next();
  return null;
}

export class AuthService {
  /**
   * Send confirmation mail to the user after register
   * @param email
   * @param token
   */
  static sendConfirmationMail(email, token) {
    // We set the link for the right environnement
    const linkApi = process.env.NODE_ENV === 'test' ? config.apiLocal : config.apiProd;

    // Template confirmation mail
    const title = 'Bienvenue dans WeSport ✔';
    const text = `
      <b>Toute l'équipe WeSport vous souhaite la bienvenue !</b>
      <p>Cliquez sur ce lien pour valider votre compte :</p>
      <a href="${linkApi}/auth/valid/${token}">${linkApi}/auth/valid/${token}</a>
    `;

    // Send mail with EmailService
    EmailService.sendMail(email, title, text);
  }

  /**
   * Send a reset password email to the user
   * @param email
   * @param token
   */
  static sendForgotPasswordMail(email, token) {
    // Template confirmation mail
    const title = 'Réinitialisation du mot de passe WeSport';
    const text = `
      <b>Bonjour,</b>
      <p>Avez-vous oublié votre mot de passe WeSport ? Saisissez le code ci-contre dans votre application préférée <3 :</p>
      <p>Mon code : <q>${token}</q></p>
    `;

    // Send mail with EmailService
    EmailService.sendMail(email, title, text);
  }
}

