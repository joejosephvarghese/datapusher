const catchAsync = require("../utils/catchAsync");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");
const { Account, User, AccountMember, Role } = require("../models");

const inviteUser = catchAsync(async (req, res) => {
  const { account_id, role, member } = req.body;
  const userId = req.user.id; // Authenticated user
  console.log(member, "gg");
  // Validate required fields
  if (!account_id || !role) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Missing required fields");
  }

  // Check if account exists
  const account = await Account.findByPk(account_id);
  if (!account) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Account not found");
  }

  // Check if user already a member
  const existingMember = await AccountMember.findOne({
    where: { account_id: account_id, user_id: member },
  });

  if (existingMember) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "You are already added to this account"
    );
  }

  // Create new account member
  await AccountMember.create({
    account_id,
    user_id: member,
    role: role,
  });

  return res.status(StatusCodes.CREATED).json({
    message: "You have been added to the account",
  });
});

module.exports = {
  inviteUser,
};
