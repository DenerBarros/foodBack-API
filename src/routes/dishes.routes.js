const { Router } = require('express');

const multer = require('multer');
const uploadConfig = require('../configs/upload');

DishesController = require('../controllers/DishesController');

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const ensureAdmin = require('../middlewares/ensureAdmin');

const dishRoutes = Router();

const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();

dishRoutes.use(ensureAuthenticated);
dishRoutes.post(
  '/',
  ensureAdmin,
  upload.single('img'),
  dishesController.create
);
dishRoutes.get('/:id', dishesController.show);
dishRoutes.get('/', dishesController.index);
dishRoutes.put(
  '/:id',
  ensureAdmin,
  upload.single('img'),
  dishesController.update
);
dishRoutes.delete('/:id', ensureAdmin, dishesController.delete);

module.exports = dishRoutes;
