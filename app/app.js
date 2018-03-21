import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import authRoutes from './modules/user/auth/auth.route';

const app = express();

// Use the bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Add Access-Control-Allow-Origin to the headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Add Method, Credentials, Max-Age in the headers
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const headers = {};
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Credentials'] = false;
    headers['Access-Control-Max-Age'] = '86400';
    headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization';
    res.writeHead(200, headers);
    res.end();
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, 'public')));

// Set the views
// And renderfile with engine ejs
app.set('views', `${__dirname}/views`);
app.engine('html', require('ejs').renderFile);

// Link the apidoc to generate a webservice doc
app.use('/', express.static('apidoc'));

// ALL USED ROUTED
// Permit to use the auth route
app.use('/auth', authRoutes);

export default app;
