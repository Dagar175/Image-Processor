const express = require('express');
const router = express.Router();
const { handleWebhook, addWebhook, deleteWebhook } = require('../controllers/webhookController');

// Route for webhook
router.post('/', handleWebhook);


router.post('/add', addWebhook);

// Route for deleting a webhook
router.delete('/delete/:id', deleteWebhook);

module.exports = router;
