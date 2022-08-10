const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const {noLogged, logged} = require('../helpers/auth');

const routes = express.Router();

routes.post('/create-qr', logged, UsuarioController.codigo);

module.exports = routes;