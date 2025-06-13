const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const {
  authServices,
  tokenServices,
  userServices,
  accountService,
} = require("../services");
const ApiError = require("../utils/apiError");

const createAccount = catchAsync(async (req, res) => {
  const { account_name, website } = req.body;

  const created_by = req.user.id;

  const account = await accountService.createAccount({
    account_name,
    website,
    created_by,
    updated_by: created_by,
  });

  res.status(StatusCodes.CREATED).json(account);
});

module.exports = {
  createAccount,
};
