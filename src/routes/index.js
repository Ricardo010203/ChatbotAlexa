const express = require('express');
const AppController = require('../controllers/AppController');
const {noLogged, logged} = require('../helpers/auth');

const routes = express.Router();

routes.get('/', noLogged, AppController.index);
routes.get('/login', noLogged, AppController.login);

module.exports = routes;