const { accountService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { StatusCodes } = require("http-status-codes");

// CREATE
const createAccount = catchAsync(async (req, res) => {
  const created_by = req.user.id;

  const account = await accountService.createAccount({
    ...req.body,
    created_by,
    updated_by: created_by,
  });

  await accountService.updateAccountRole
(account.account_id,created_by,"admin")

  res.status(StatusCodes.CREATED).json(account);
});

// READ ALL
const getAllAccounts = catchAsync(async (req, res) => {
  const accounts = await accountService.getAllAccounts();
  res.status(StatusCodes.OK).json(accounts);
});

// READ ONE
const getAccountById = catchAsync(async (req, res) => {
  const account = await accountService.getAccountById(req.params.id);
  res.status(StatusCodes.OK).json(account);
});

// UPDATE
const updateAccount = catchAsync(async (req, res) => {
  const updated_by = req.user.id;

  const account = await accountService.updateAccount(
    req.params.id,
    req.body,
    updated_by
  );

  res.status(StatusCodes.OK).json(account);
});

// DELETE
const deleteAccount = catchAsync(async (req, res) => {
  await accountService.deleteAccount(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});

// RESTORE
const restoreAccount = catchAsync(async (req, res) => {
  const account = await accountService.restoreAccount(req.params.id);
  res.status(StatusCodes.OK).json(account);
});

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  restoreAccount,
};
