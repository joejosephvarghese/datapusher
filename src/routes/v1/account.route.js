const express = require('express');
const router = express.Router();
const {accountController} = require('../../controllers');

// Create an account
router.post('/', accountController.createAccount);

// Get all accounts
router.get('/', accountController.getAllAccounts);

// Get a single account by ID
router.get('/:id', accountController.getAccountById);

// Update an account by ID
router.put('/:id', accountController.updateAccount);

// Soft-delete an account by ID
router.delete('/:id', accountController.deleteAccount);

// Restore a soft-deleted account (optional)
router.post('/:id/restore', accountController.restoreAccount);

module.exports = router;
