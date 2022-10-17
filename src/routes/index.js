const { Router } = require('express');

const userRoutes = require('./users.routes');

const routes = Router();

routes.use('/users', userRoutes);


module.exports = routes;