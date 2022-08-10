const express = require('express');
const ehbs = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const {urlencoded, json} = require('express');
const session = require('express-session');
const MySQLSession = require('express-mysql-session');
const {database} = require('./src/keys');
const passport = require('passport');
const flash = require('connect-flash');
const toastr = require('express-toastr');


const app = express();
require('./src/helpers/passport');


app.use(morgan('dev'));
app.use(urlencoded({extended: false}));
app.use(json());

app.use(session({
   secret: 'restaurat-session',
   resave: false,
   saveUninitialized: false,
   store: new MySQLSession(database)
}));

app.use(flash());
app.use(toastr());

app.use(passport.initialize());
app.use(passport.session());

/**
 * Motor de plantillas  HANDLEBARS
 * */
app.set('views', path.join(__dirname, './src/views'));
app.engine('.html', ehbs({
   defaultLayout: 'app',
   extname: '.html',
   helpers: require('./src/helpers/handlebars')
}));
app.set('view engine', '.html');

/**
 * VARIABLES GLOBALES
 * */
app.use((req, res, next) => {
   res.locals.usuario = req.user;
   res.locals.toastr = req.toastr.render()
   next();
})

/**
 * RUTAS
 * */

app.use(require('./src/routes'));
app.use(require('./src/routes/usuario'));
app.use(require('./src/routes/auth'));
app.use(require('./src/routes/admin'));
app.use(require('./src/routes/plato'));
app.use(require('./src/routes/qr'));

/**
 * PUBLIC
 * */

app.use(express.static(path.join(__dirname, './src/public')));

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'),() => {
   console.log('Servidor Ejecutandose');
});

