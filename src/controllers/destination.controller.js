const catchAsync = require("../utils/catchAsync");
const { StatusCodes } = require("http-status-codes");
const {Role }=require("../models")

const { destinationService, accountService } = require("../services");
const ApiError = require("../utils/apiError");

// Create Destination
const createDestination = catchAsync(async (req, res) => {
  const { accountId } = req.params;

  const account = await accountService.getAccountById(accountId);
  if (!account) {
    throw ApiError(StatusCodes.NOT_FOUND, "Account not found");
  }

  const destination = await destinationService.createDestination(
    { ...req.body, account_id: accountId },
    req.user.id
  );

  res.status(StatusCodes.CREATED).json(destination);
});

// Get all Destinations for Account
const getDestinationsForAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  // Convert query params to integers
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const account = await accountService.getAccountById(accountId);
  console.log(account,"accounkt")
  if (!account) {
    throw ApiError(StatusCodes.NOT_FOUND, "Account not found");
  }

  const filter = { account_id: account.account_id };
  const options = { page, limit };

  const destinations = await destinationService.paginatedDestinations(filter, options);

  res.status(StatusCodes.OK).json(destinations);
});

// Get single Destination by ID
const getDestination = catchAsync(async (req, res) => {
  const { destinationId } = req.params;

  const destination = await destinationService.getDestinationById(destinationId);
  if (!destination) {
    throw ApiError(StatusCodes.NOT_FOUND, "Destination not found");
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: { destination },
  });
});

// Update Destination
const updateDestination = catchAsync(async (req, res) => {
  const { destinationId } = req.params;

  const updated = await destinationService.updateDestination(destinationId, req.body);
  if (!updated) {
    throw ApiError(StatusCodes.NOT_FOUND, "Destination not found");
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: { destination: updated },
  });
});

// Delete Destination
const deleteDestination = catchAsync(async (req, res) => {
  const { destinationId } = req.params;

  const deleted = await destinationService.deleteDestination(destinationId);
  if (!deleted) {
    throw ApiError(StatusCodes.NOT_FOUND, "Destination not found");
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: "success",
    data: null,
  });
});




module.exports = {
  createDestination,
  getDestinationsForAccount,
  getDestination,
  updateDestination,
  deleteDestination
};
