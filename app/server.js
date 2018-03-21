import 'babel-polyfill';
import mongoose from 'mongoose';
import app from './app';
import logger from './helpers/logger.helper';
import { config } from './config';

// Choose the port
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  logger.info(`Express server listening on port ${port}`);
});

// init db Url
let dbUrl;

// Permit to switch environnement
switch (process.env.NODE_ENV) {
  case 'production':
    dbUrl = config.db;
    break;
  case 'test':
    dbUrl = config.dbTest;
    break;
  default:
    dbUrl = config.dbDev;
    break;
}

// connect the database mongo
mongoose.connect(dbUrl, { useMongoClient: true });
const db = mongoose.connection;

// Handle connection error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// export the server
module.exports = server;
