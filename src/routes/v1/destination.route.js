const express = require("express");
const { destinationController } = require("../../controllers");


const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
router.use(authMiddleware);

router.post(
  "/:accountId",
  destinationController.createDestination
);

module.exports = router;
