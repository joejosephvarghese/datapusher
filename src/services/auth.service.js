const { User } = require("../models");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");

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

module.exports = {
  registerUser,
};
