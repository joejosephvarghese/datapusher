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

const getMembersByAccount = catchAsync(async (req, res) => {
  const { account_id } = req.params;
  const { page, limit } = req.query; // Default values if not provided

  if (!account_id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Account ID is required");
  }

  const filter = { account_id }; // Filter members by account_id
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const members = await AccountMember.paginate(filter, options);

  res.status(StatusCodes.OK).json(members);
});

const getMemberById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { account_id, accountmember_id } = req.params;

  // Step 1: Check if user is part of this account
  const isMember = await AccountMember.findOne({
    where: {
      user_id: userId,
      account_id: account_id,
    },
  });

  if (!isMember) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You are not a member of this account"
    );
  }

  // Step 2: Fetch the member info for the given ID within this account
  const member = await AccountMember.findOne({
    where: {
      id: accountmember_id,
      account_id: account_id,
    },
  });

  if (!member) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Member not found in this account"
    );
  }

  res.status(StatusCodes.OK).json(member);
});

const updateMemberById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { account_id, accountmember_id } = req.params;
console.log(req.body,"jksdjfljfdls")
  // Optional: Check if user is authorized to update members in this account

  const isMember = await AccountMember.findOne({
    where: {
      user_id: userId,
      account_id: account_id,
      role:"Admin"
    },
  });

  if (!isMember) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized to update members of this account");
  }

  const [updatedCount, updatedRows] = await AccountMember.update(req.body, {
    where: {
      id: accountmember_id,
      account_id: account_id,
    },
    returning: true,
  });

  if (updatedCount === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Member not found or update failed");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: updatedRows[0],
  });
});


module.exports = {
  inviteUser,
  getMembersByAccount,
  getMemberById,
  updateMemberById
};
