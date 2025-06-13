const { Account } = require("../models");
const ApiError = require("../utils/apiError");
const { StatusCodes } = require("http-status-codes");

// CREATE
const createAccount = async (accountData) => {
  const allowedFields = ["account_name", "website", "created_by", "updated_by"];
  const filteredData = {};

  allowedFields.forEach((field) => {
    if (accountData[field] !== undefined) {
      filteredData[field] = accountData[field];
    }
  });

  const existing = await Account.findOne({
    where: { account_name: filteredData.account_name },
  });
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, "Account name already exists");
  }

  return Account.create(filteredData);
};

// READ ALL
const getAllAccounts = async () => {
  return Account.findAll();
};

// READ ONE
const getAccountById = async (id) => {
  const account = await Account.findByPk(id);
  if (!account) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Account not found");
  }
  return account;
};

// UPDATE
const updateAccount = async (id, updateData, updatedBy) => {
  const account = await Account.findByPk(id);
  if (!account) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Account not found");
  }

  Object.assign(account, updateData);
  account._updatedBy = updatedBy; // this will be used in your model's `beforeUpdate`
  await account.save();

  return account;
};

// DELETE (soft delete)
const deleteAccount = async (id) => {
  const account = await Account.findByPk(id);

  if (!account) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Account not found");
  }

  await account.destroy(); // This performs a soft delete

  return {
    message: "Account deleted successfully",
    account_id: account.account_id,
  };
};

// RESTORE (if soft-deleted)
const restoreAccount = async (id) => {
  const account = await Account.findByPk(id, { paranoid: false });
  if (!account) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Account not found");
  }

  await account.restore();
  return account;
};

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  restoreAccount,
};
