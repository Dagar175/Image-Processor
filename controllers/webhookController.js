const axios = require('axios');
const Request = require('../models/Request');
const Webhook = require('../models/Webhook');

const handleWebhook = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Request.find({ sheet_id: requestId });

    if (request.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Fetch all webhook URLs from the Webhook model
    const webhooks = await Webhook.find();

    if (webhooks.length === 0) {
      return res.status(404).json({ error: 'No webhooks found' });
    }

    // Prepare the data to be sent to the webhooks
    const webhookData = {
      requestId: requestId,
      requestDetails: request
    };

    // Send the data to each webhook URL
    await Promise.all(webhooks.map(async (webhook) => {
      try {
        await axios.post(webhook.url, webhookData);
      } catch (error) {
        console.error(`Failed to send data to webhook ${webhook.url}:`, error.message);
      }
    }));

    res.status(200).json({ message: 'Webhook received and processed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addWebhook = async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }
      const webhook = new Webhook({ url });
      await webhook.save();
      res.status(201).json({ message: 'Webhook added successfully', webhook });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const deleteWebhook = async (req, res) => {
    try {
      const { id } = req.params;
      const webhook = await Webhook.findByIdAndDelete(id);
      if (!webhook) {
        return res.status(404).json({ error: 'Webhook not found' });
      }
      res.status(200).json({ message: 'Webhook deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { handleWebhook, addWebhook, deleteWebhook };
