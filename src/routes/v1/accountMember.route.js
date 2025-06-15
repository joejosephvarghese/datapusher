const express = require('express');
const router = express.Router();
const {accountController,accountMemberController} = require('../../controllers');

const authMiddleware = require("../../middleware/authMiddleware");
router.use(authMiddleware);

// Create an account
router.post('/invite', accountMemberController.inviteUser);

router.get('/account/:account_id/member/:accountmember_id', accountMemberController.updateMemberById);
router.put('/account/:account_id/member/:accountmember_id', accountMemberController.updateMemberById);
router.delete('/account/:account_id/member/:accountmember_id', accountMemberController.removeTheUser);

// router.get('/account/:account_id', accountMemberController.getMembersByAccount);








module.exports = router;
