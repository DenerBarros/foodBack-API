const { Router } = require('express');

const userRoutes = require('./users.routes');
const dishesRoutes = require('./dishes.routes');
const sessionsRoutes = require('./sessions.routes');

const routes = Router();

routes.use('/sessions', sessionsRoutes);
routes.use('/users', userRoutes);
routes.use('/dishes', dishesRoutes);

module.exports = routes;
