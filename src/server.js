require('express-async-errors');

require('dotenv/config');

const express = require('express');
const cors = require('cors');
const database = require('./database/sqlite');

const uploadConfig = require('./configs/upload');

const AppError = require('./utils/AppError');
const routes = require('./routes');
const app = express();

database();

app.use(cors());
app.use(express.json());

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log(`server is running at ${PORT}`));
