require('express-async-errors');
const AppError = require('./utils/AppError');

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

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