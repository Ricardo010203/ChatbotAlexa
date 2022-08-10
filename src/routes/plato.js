const express = require('express');
const PlatoController = require('../controllers/PlatoController');
const {noLogged, logged} = require('../helpers/auth');
const {upload} = require('../helpers/uploadFile');

const routes = express.Router();

routes.get('/get-convenio', logged, PlatoController.index);
routes.get('/create-convenio', logged, PlatoController.create);
routes.post('/store-plato', [logged, upload('foto')], PlatoController.store);
routes.get('/edit-convenio/:id', logged, PlatoController.edit);
routes.post('/update-plato/:id', [logged, upload('foto')], PlatoController.update);
routes.get('/delete-convenio/:id', logged, PlatoController.delete);

module.exports = routes;