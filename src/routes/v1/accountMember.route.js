const express = require('express');
const router = express.Router();
const {accountController,accountMemberController} = require('../../controllers');

const authMiddleware = require("../../middleware/authMiddleware");
router.use(authMiddleware);
// Create an account
router.post('/invite', accountMemberController.inviteUser);



module.exports = router;
