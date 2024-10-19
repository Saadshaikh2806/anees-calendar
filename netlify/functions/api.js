const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
const Activity = require('./models/Activity'); // Adjust the path as needed
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Log more details about the error
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Full error object:', JSON.stringify(err, null, 2));
  });

const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();

// GET all activities
router.get('/activities', async (req, res) => {
  console.log('GET /activities route hit');
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// POST new activity
router.post('/activities', async (req, res) => {
  console.log('POST /activities route hit', req.body);
  try {
    const newActivity = new Activity(req.body);
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ message: 'Error adding activity' });
  }
});

// PUT (update) activity
router.put('/activities/:date', async (req, res) => {
  console.log('PUT /activities/:date route hit', req.params.date, req.body);
  try {
    const updatedActivity = await Activity.findOneAndUpdate(
      { date: req.params.date },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updatedActivity);
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ message: 'Error updating activity' });
  }
});

// DELETE activity
router.delete('/activities/:date', async (req, res) => {
  console.log('DELETE /activities/:date route hit', req.params.date);
  try {
    await Activity.findOneAndDelete({ date: req.params.date });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Error deleting activity' });
  }
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);

const API_URL = '/.netlify/functions/api';
