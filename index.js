const express = require('express');
require('dotenv').config();
const helmet = require('helmet');

// IMPORTING SESSION STUFF
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const routes = require('./routes');

const PORT = process.env.PORT || 3333;
const app = express();

app.set('port', PORT);

app.use(
  session({
    name: 'delicious-cookie-id',
    secret: 'ladfshgoandsuahqwlfoasdhohoasfd',
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((request, response, next) => {
  response.locals.user = request.session.username;
  response.locals.cart = request.session.cart;
  next();
});
app.use(helmet());

app.use(routes.routes);

app.listen(app.get('port'), () => {
  console.log('Now listening for connection on port: ', app.get('port'));
});
