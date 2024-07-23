// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const sheetRoutes = require('./routes/sheetRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const path = require('path');
const agenda = require('./agenda'); // Import the singleton Agenda instance

dotenv.config();

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/image-processor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define and start Agenda jobs
// require('./jobProcessor')(agenda);

app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/sheet', sheetRoutes);
app.use('/api/webhook', webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Start Agenda
// agenda.start().then(() => {
//   console.log('Agenda started');
// }).catch(err => {
//   console.error('Error starting Agenda:', err);
// });

// Export the app instance
module.exports = app;
