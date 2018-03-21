import nodemailer from 'nodemailer';

import logger from './logger.helper';
import { mailConfig } from '../config';

export class EmailService {
  /**
   * Send an email
   * @param emailAdress string
   * @param title string
   * @param text string
   * @returns {boolean}
   */
  static sendMail(emailAdress, title, text) {
    // We don't send a mail if we are in environnement test
    if (process.env.NODE_ENV === 'test') return logger.info('Envoi de mail désactivé dans le mode test');

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: mailConfig.mail,
        pass: mailConfig.password,
      },
      // Bypass Google security : https://myaccount.google.com/lesssecureapps
      tls: { rejectUnauthorized: false },
    });

    // Configuration send mail
    const mailOptions = {
      from: mailConfig.mail, // sender address
      to: emailAdress, // list of receivers
      subject: title, // Subject line
      html: text, // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      transporter.close();
      if (error) {
        logger.error(error);
        return false;
      }
      logger.info('Message sent: %s', info.messageId);
    });

    return true;
  }
}
