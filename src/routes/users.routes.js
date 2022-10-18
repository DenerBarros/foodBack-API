const { Router } = require('express');

UserController = require('../controllers/UserControllers');

const usersRoutes = Router();

const userController = new UserController();

usersRoutes.post('/', userController.create);

module.exports = usersRoutes;
