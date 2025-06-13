const { User } = require("../models");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");

const registerUser = async ({ name, email, password, role }) => {
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const newUser = await User.create({
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role: role,
  });

  const userWithoutPassword = newUser.get({ plain: true });
  delete userWithoutPassword.password;

  return userWithoutPassword;
};

const findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};
module.exports = {
  registerUser,
  findByEmail
};
