const express = require('express');
const router = express.Router();

const{accountController}  = require("../../controllers");
const authMiddleware = require("../../middleware/authMiddleware");

router.use(authMiddleware);


router.post('/',accountController.createAccount);

module.exports = router;