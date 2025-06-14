const catchAsync = require("../utils/catchAsync");
const { StatusCodes } = require("http-status-codes");

const { destinationService, accountService } = require("../services");
const ApiError = require("../utils/apiError");
const createDestination = catchAsync(async (req, res) => {
  const { accountId } = req.params;

  const account = await accountService.getAccountById(accountId);

  if (!account) {
    throw ApiError(StatusCodes.NOT_FOUND, "Account not found ");
  }

  const destination = await destinationService.createDestination(
    { ...req.body, account_id: accountId },
    req.user.id
  );

  res.status(StatusCodes.CREATED).json(destination);
});

module.exports = {
  createDestination,
};
