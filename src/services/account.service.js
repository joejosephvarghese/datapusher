const { Account } = require("../models");
const ApiError = require("../utils/apiError");
const { StatusCodes } = require("http-status-codes");

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

module.exports = {
  createAccount,
};
