const winston = require('winston');
const fs = require('fs');

const env = process.env.NODE_ENV !== 'test';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configuation date logger
const tsFormat = () => (new Date()).toLocaleTimeString();

// Create a new logger
// With different option
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info',
    }),
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: tsFormat,
      level: env === 'test' ? 'debug' : 'info',
    }),
  ],
});

export default logger;

