const { User } = require("../models");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");

const findById = async (userId) => {
  return await User.findByPk(userId);
};

const findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};
module.exports = {
  findById,
  findByEmail,
};
