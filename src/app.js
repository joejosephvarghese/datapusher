const express = require("express");
const helmet = require("helmet");
const morgan = require('./config/morgan');
const { helmetConfig ,environment} = require("../src/config/config");
const routes = require("./routes/v1");
const sequelize = require("../src/models/connection");
const logger = require("./config/logger");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("./utils/apiError");
const { errorConverter, errorHandler } = require("../src/middleware/error");

const app = express();

app.use(helmet(helmetConfig));

app.use(express.json());

if (environment.node !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

sequelize
  .authenticate()
  .then(() => logger.info("Connected to postgres"))
  .catch((err) => console.error("Error: " + err));


app.use("/v1", routes);

app.use((req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, "Not found"));
});

app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
