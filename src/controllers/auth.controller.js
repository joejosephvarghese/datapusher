const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const { authServices, tokenServices, userServices } = require("../services");
const ApiError = require("../utils/apiError");

const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const role = "user";
  const newUser = await authServices.registerUser({
    name,
    email,
    password,
    role,
  });
  const token = tokenServices.generateToken(newUser.id);

  return res.status(StatusCodes.CREATED).json({
    message: "User registered successfully",
    result: { ...newUser, token },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await authServices.findByEmail(email);
  if (!existingUser) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email ");
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  console.log(isPasswordValid, "isPasswordValid");
  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid  password");
  }

  const token = tokenServices.generateToken(existingUser.id);

  res.status(StatusCodes.OK).json({ user: existingUser, token: token });
});

module.exports = {
  register,
  login,
};
