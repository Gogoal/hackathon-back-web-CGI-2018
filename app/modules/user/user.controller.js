import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Users from './user.schema';
import logger from '../../helpers/logger.helper';
import { formatQuery, isValidEmail } from '../../helpers/request.helper';
import { createForgotPassword, verifyForgotPasswordToken } from './forgotPassword/forgotPassword.service';

/**
 * @api {GET} /users/ Get all users
 * @apiName getAll users
 * @apiGroup Users
 * @apiParam {Integer} [limit]  Optional Limit return users (100 default)
 * @apiParam {Integer} [page]  Optional Page of users
 * @apiParam {String} [attribute]  Attribute for filter (ex: name=test)
 * @apiSuccess {Object} Users Array of User.
 * @apiSuccess {Object[]} Users List of User.
 */
export function getUsers(req, res) {
  const { filter, limit, offset } = formatQuery(Users, req.query, 100);

  // Get all user
  Users.find(filter, (err, users) => {
    if (err) {
      logger.error(err);
      return res.status(500).send({ success: false, err });
    }
    res.status(200).send({ success: true, data: users });
  }).limit(limit)
    .skip(offset);
}

/**
 * @api {GET} /users/:id Get one user
 * @apiParam {Number} id Users unique ID.
 * @apiName get one user by id
 * @apiGroup Users
 *
 * @apiSuccess {Object} profile User profile information.
 * @apiSuccess {String} profile.name User name.
 * @apiSuccess {String} profile.email User email.
 */
export function getUserById(req, res) {
  // We test if we have objectID for the user
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    logger.debug('Le format de l\'id n\'est pas correct');
    return res.status(400).send({ success: false, err: "Le format de l'id n'est pas correct" });
  }
  Users.find({ _id: req.params.id }, (err, user) => {
    if (err) {
      logger.error(err);
      return res.status(500).send({ success: false, err });
    }
    return res.status(200).send({ success: true, data: user });
  });
}

/**
 * @api {GET} /users/:id Get my user
 * @apiName get my own user
 * @apiGroup Users
 *
 * @apiSuccess {Object} profile User profile information.
 * @apiSuccess {String} profile.name User name.
 * @apiSuccess {String} profile.email User email.
 */
export function getMe(req, res) {
  Users.findOne({ _id: req.userId }, (err, user) => {
    if (err) {
      logger.error(err);
      return res.status(500).send({ success: false, err });
    }
    return res.status(200).send({ success: true, data: user });
  });
}

/**
 * @api {POST} /users Create user
 * @apiName Create user
 * @apiGroup Users
 * @apiParam {String} lastName   lastName of the User.
 * @apiParam {String} firstName   firstName of the User.
 * @apiParam {String} email     email of the User.
 * @apiParam {Date} birthdate     birthdate of the User.
 * @apiParam {Sport} sport     sports of the User.
 * @apiParam {Gender} gender     gender of the User.
 * @apiParam {String} password password (not Hash) of the User.
 * @apiParam {String} facebookId facebookId of the User (if exist).
 * @apiParam {Boolean} isValidate validation user account (default to false)
 * @apiParam {Boolean} validateToken specific token that permit to valid user account
 * @apiSuccess {Object} response Reponse.
 * @apiSuccess {Boolean} response.success true.
 * @apiSuccess {Object} response.user the user create.
 */
export function createUser(req, res) {
  const user = new Users(req.body);
  user.save((err, userCreate) => {
    if (err) {
      logger.error(err);
      return res.status(500).send({ success: false, err });
    }
    return res.status(200).send({ success: true, user: userCreate });
  });
}

/**
 * @api {DELETE} /users/:id Delete user
 * @apiParam {Number} id Users unique ID.
 * @apiName Delete user
 * @apiGroup Users
 * @apiSuccess {Object} response Reponse.
 * @apiSuccess {Boolean} response.success true.
 */
export function deleteUser(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    logger.debug('Le format de l\'id n\'est pas correct');
    return res.status(400).send({ success: false, err: "Le format de l'id n'est pas correct" });
  }
  Users.remove({ _id: req.params.id }, (err) => {
    if (err) {
      logger.error(err);
      return res.status(500).send({ success: false, err });
    }
    return res.status(200).send({ success: true });
  });
}

/**
 * @api {POST} /users/:id Update user
 * @apiName Update user
 * @apiGroup Users
 * @apiParam {String} lastName   lastName of the User.
 * @apiParam {String} firstName   firstName of the User.
 * @apiParam {String} email     email of the User.
 * @apiParam {Date} birthdate     birthdate of the User.
 * @apiParam {Sport} sport     sports of the User.
 * @apiParam {Gender} gender     gender of the User.
 * @apiParam {String} password password (not Hash) of the User.
 * @apiParam {String} facebookId facebookId of the User (if exist).
 * @apiParam {Boolean} isValidate validation user account (default to false)
 * @apiSuccess {Object} response Reponse.
 * @apiSuccess {Boolean} response.success true.
 * @apiSuccess {Object} response.user the user update.
 */
export function updateUser(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    logger.debug('Le format de l\'id n\'est pas correct');
    return res.status(400).send({ success: false, err: "Le format de l'id n'est pas correct" });
  }
  Users.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true }, (err, user) => {
    if (err) {
      logger.error(err);
      return res.status(500).send({ success: false, err });
    }
    return res.status(200).send({ success: true, user });
  });
}

/**
 * @api {POST} /users/forgotPassword Generate a new password
 * @apiName Generate a new password
 * @apiGroup Users
 * @apiParam {String} email     email of the User.
 * @apiSuccess {Object} response Reponse.
 * @apiSuccess {Boolean} response.success true.
 * @apiSuccess {Object} response.user new password generated.
 */
export function forgotPassword(req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(500).send({ success: false, err: 'Pas de paramètre dans la requête' });
  }
  if (!req.body.email) {
    return res.status(500).send({ success: false, err: 'Aucun email précisé' });
  }

  // Test if mail is valid
  if (!isValidEmail(req.body.email)) {
    // Add error to logger
    const errMsg = 'Le format de l\'email n\'est pas correct';
    logger.debug(errMsg);
    return res.status(500).send({ success: false, err: errMsg });
  }

  // Search if user exists width this mail
  Users.findOne({ email: req.body.email }, (err, user) => {
    // // If user not found
    if (!user) {
      const errMsg = 'User not found';
      logger.debug(errMsg);
      return res.status(500).send({ success: false, err: errMsg });
    }

    return createForgotPassword(user._id, req.body.email)
      .then(forgotPasswordCreated => res.status(200)
        .send({ success: true, token: process.env.NODE_ENV === 'test' ? forgotPasswordCreated.token : null }))
      .catch(error => res.status(500).send({ success: false, err: error.message }));
  });
}

/**
 * @api {POST} /users/resetPassword Reset the password
 * @apiName Reset the password
 * @apiGroup Users
 * @apiParam {String} email     email of the User.
 * @apiParam {int} token     Token of the User.
 * @apiParam {String} password password (not Hash) of the User.
 * @apiSuccess {Object} response Reponse.
 * @apiSuccess {Boolean} response.success true.
 * @apiSuccess {Object} response.user the user update.
 */
export function resetPassword(req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(500).send({ auth: false, token: null, err: 'Pas de paramètre dans la requête' });
  }
  if (!req.body.email) {
    return res.status(500).send({ success: false, err: 'Aucun email précisé' });
  }
  if (!req.body.token) {
    return res.status(500).send({ success: false, err: 'Aucun token précisé' });
  }
  if (!req.body.password) {
    return res.status(500).send({ success: false, err: 'Aucun password précisé' });
  }
  if (!isValidEmail(req.body.email)) { // Test if mail is valid
    logger.debug('Le format de l\'email n\'est pas correct'); // Add error to logger
    throw new Error('Le mail n\'est pas valide');
  }
  // Search if user exists width this mail
  Users.findOne({ email: req.body.email }, (err, userTarget) => {
    // If user not found
    if (!userTarget) {
      const errMsg = 'User not found.';
      logger.debug(errMsg);
      return res.status(500).send({ success: false, err: errMsg });
    }
    verifyForgotPasswordToken(userTarget._id, req.body.token)
      .then(() => {
        // If all is ok : Verify Password
        if (req.body.password.length < 8) { // So easy password
          throw new Error('Password so easy, try to find an harder password please.');
        }

        // We can now do the change And apply this to the :database
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        Users.findOneAndUpdate({ _id: userTarget._id }, {
          password: hashedPassword,
        }, { upsert: true })
          .then(() => res.status(200).send({ success: true }));
      })
      .catch(error => res.status(500).send({ success: false, err: error.message }));
  });
}

/**
 * @api {POST} /users/verifyResetPassword Verify if the token of reset the password is valid
 * @apiName Verify if the password can be reset
 * @apiGroup Users
 * @apiParam {String} email     email of the User.
 * @apiParam {int} token     Token of the User.
 * @apiSuccess {Object} response Reponse.
 * @apiSuccess {Boolean} response.success true.
 */
export function validateResetPassword(req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(500).send({ auth: false, token: null, err: 'Pas de paramètre dans la requête' });
  }
  if (!req.body.email) {
    return res.status(500).send({ success: false, err: 'Aucun email précisé' });
  }
  if (!req.body.token) {
    return res.status(500).send({ success: false, err: 'Aucun token précisé' });
  }
  if (!isValidEmail(req.body.email)) { // Test if mail is valid
    logger.debug('Le format de l\'email n\'est pas correct'); // Add error to logger
    throw new Error('Le mail n\'est pas valide');
  }
  // Search if user exists width this mail
  Users.findOne({ email: req.body.email }, (err, user) => {
    // If user not found
    if (!user) {
      logger.debug('User not found.');
      throw new Error('User not found.');
    }

    verifyForgotPasswordToken(user._id, req.body.token)
      .then(() => res.status(200).send({ success: true }))
      .catch(error => res.status(500).send({ success: false, err: error.message }));
  });
}
