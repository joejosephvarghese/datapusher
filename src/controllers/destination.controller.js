const catchAsync = require("../utils/catchAsync");

const createDestination = catchAsync(async (req, res) => {
  console.log("hit here");
});

module.exports = {
  createDestination,
};
