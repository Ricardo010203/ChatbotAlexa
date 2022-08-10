const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const {noLogged, logged} = require('../helpers/auth');

const routes = express.Router();

routes.get('/difusion', logged, UsuarioController.create);

module.exports = routes;