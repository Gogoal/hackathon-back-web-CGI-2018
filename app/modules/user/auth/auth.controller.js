import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsersModel from '../user.schema';
import logger from '../../../helpers/logger.helper';
import { config } from '../../../config';
import { AuthService } from './auth.service';

const randomstring = require('randomstring');

function generateToken(user) {
  const token = `Bearer ${jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 86400,
  })}`;
  logger.debug(`Token generated to user id ${user._id}`);
  return { auth: true, token, user };
}

/**
 * @api {POST} /auth/register Register
 * @apiName register
 * @apiGroup Auth
 *
 * @apiParam {String} lastName   lastName of the User.
 * @apiParam {String} firstName   firstName of the User.
 * @apiParam {String} email     email of the User.
 * @apiParam {Date} birthdate     birthdate of the User.
 * @apiParam {Gender} gender     gender of the User.
 * @apiParam {String} password password (not Hash) of the User.
 * @apiParam {String} facebookId facebookId of the User (if exist).
 *
 * @apiSuccess {Boolean} auth If the authentification is ok.
 * @apiSuccess {String} token  token of authentification.
 * @apiSuccess {Object} response.user the user login.
 */
export function register(req, res) {
  // Test if there is parameter in the request
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(500).send({ auth: false, token: null, err: 'Pas de paramètre dans la requête' });
  }

  // Test if there is already an user with the mail in the parameter
  UsersModel.findOne({ email: req.body.email }, (err, user) => {
    // Error findOne
    if (err) {
      logger.error(err);
      return res.status(500).send({ auth: false, token: null, err });
    } else if (!user) { // We can create the user
      const hashedPassword = bcrypt.hashSync(req.body.password, 8);
      const generateTokenVerification = randomstring.generate({ length: 12, charset: 'alphabetic' }); // Generate a validation token

      // WE CREATE USER
      UsersModel.create(
        {
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          email: req.body.email,
          birthdate: req.body.birthdate,
          gender: req.body.gender,
          password: hashedPassword,
          validateToken: generateTokenVerification,
        },
        (errCreate, userCreate) => {
          if (errCreate) return res.status(500).send({ auth: false, token: null, errCreate });

          logger.debug(`User created. Id user ${userCreate.id}`);

          return res.status(200).send(generateToken(userCreate)); // TODO Deal with email error
          // For now, we create the user even if there is a problem in the sending of the mail
        },
      );
    } else {
      logger.debug('Email déjà utilisé');
      return res.status(401).send({ auth: false, token: null, msg: 'Email déja utilisé' });
    }
  });
}

/**
 * @api {POST} /auth/sendConfirmationEmail Send confirmation email to the user
 * @apiName sendConfirmationMail
 * @apiGroup Auth
 *
 * @apiParam {String} email   email of the User.
 * @apiSuccess {Object} response Reponse.
 * @apiSuccess {Boolean} response.success true.
 */
export function sendConfirmationEmail(req, res) {
  UsersModel.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      logger.error(err);
      return res.status(500).send({ success: false, err });
    } else if (user) {
      // Add a test for the mail
      if (AuthService.sendConfirmationMail(req.body.email, user.validateToken)) {
        return res.status(200).send(generateToken(user));
      }
      return res.status(200).send(generateToken(user)); // TODO Deal with email error
    }
    logger.debug('Email non existant dans la base');
    return res.status(401).send({ success: false, err: 'Email non existant dans la base' });
  });
}

/**
 * @api {GET} /auth/valid/:token Validate Account
 * @apiParam {Number} Unique token
 * @apiName Validate Account
 * @apiGroup Auth
 * @apiSuccess {Object} response Reponse.
 * @apiSuccess {Boolean} response.success true.
 */
export function valid(req, res) {
  UsersModel.findOneAndUpdate({ validateToken: req.params.token }, { isValidate: 'true' }, (err, user) => {
    if (err) {
      logger.error(err);
      return res.status(500).send({ success: false, err });
    } else if (user) {
      return res.redirect(301, 'http://we-sport.techgame.fr/compte-cree/');
    }
    logger.debug('Token non valide');
    return res.status(401).send({ success: false, err: 'Token non valide' });
  });
}

/**
 * @api {POST} /auth/login Login
 * @apiName login
 * @apiGroup Auth
 *
 * @apiParam {String} password  Required Password of the User.
 * @apiParam {String} email  Required Mail of the User.
 *
 * @apiSuccess {Boolean} auth If the authentification is ok.
 * @apiSuccess {String} token  token of authentification.
 * @apiSuccess {Object} response.user the user login.
 */
export function login(req, res) {
  UsersModel.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      logger.error(err);
      return res.status(500).send({ auth: false, token: null, err });
    }
    if (!user) return res.status(404).send({ auth: false, token: null });
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    logger.info('Login success');
    return res.status(200).send(generateToken(user));
  });
}

/**
 * @api {get} /auth/logout Logout
 * @apiName logout
 * @apiGroup Auth
 *
 * @apiSuccess {Boolean} auth authentification false.
 * @apiSuccess {String} token  token null.
 */
export function logout(req, res) {
  logger.info('Logout success !');
  return res.status(200).send({ auth: false, token: null });
}


/**
 * connection with Facebook
 * If user exist then return token else create user and return token
 * @param req
 * @param res
 */
export function loginFacebook(req, res) {
  if (req.body.id === undefined || req.body.id === null) {
    return res.status(500).send({ auth: false, token: null });
  }
  UsersModel.findOne({ facebookId: req.body.id }, (err, user) => {
    if (err) {
      logger.error(err);
      return res.status(500).send({ auth: false, token: null, err });
    } else if (!user) {
      UsersModel.create(
        {
          name: req.body.name,
          email: req.body.email,
          facebookId: req.body.id,
        },
        (errCreate, userCreate) => {
          if (errCreate) {
            logger.error(errCreate);
            return res.status(500).send({ auth: false, token: null, errCreate });
          }
          logger.info('Login Facebook success');
          return res.status(200).send(generateToken(userCreate));
        },
      );
    } else {
      return res.status(200).send(generateToken(user));
    }
  });
}

