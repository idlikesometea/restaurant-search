const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const apiRoutes = require('./routes/api');
const filesRoutes = require('./routes/files');

app.use(bodyParser.urlencoded( {extended: false}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use('/api', apiRoutes);
app.use('/files', filesRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Resource not found'
  });
});

app.listen(8000);
