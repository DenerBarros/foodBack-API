const { Router } = require('express');

const userRoutes = require('./users.routes');
const sessionsRoutes = require('./sessions.routes');

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/sessions', sessionsRoutes);

module.exports = routes;