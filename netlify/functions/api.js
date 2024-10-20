const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
const Activity = require('./models/Activity'); // Adjust the path as needed
const AcademicActivity = require('./models/AcademicActivity'); // Adjust the path as needed
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
app.use(cors({ origin: '*' }));
app.use(express.json());

const router = express.Router();

// GET all activities
router.get('/activities', async (req, res) => {
  console.log('GET /activities route hit');
  try {
    console.log('Attempting to fetch activities from MongoDB');
    console.log('MongoDB URI:', process.env.MONGODB_URI); // Log the MongoDB URI
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

// GET all academic activities
router.get('/academic-activities', async (req, res) => {
  try {
    const activities = await AcademicActivity.find();
    res.json(activities);
  } catch (error) {
    console.error('Error fetching academic activities:', error);
    res.status(500).json({ message: 'Error fetching academic activities' });
  }
});

// POST new academic activity
router.post('/academic-activities', async (req, res) => {
  try {
    const newActivity = new AcademicActivity(req.body);
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Error adding academic activity:', error);
    res.status(500).json({ message: 'Error adding academic activity' });
  }
});

// PUT (update) academic activity
router.put('/academic-activities/:date', async (req, res) => {
  try {
    const updatedActivity = await AcademicActivity.findOneAndUpdate(
      { date: req.params.date },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updatedActivity);
  } catch (error) {
    console.error('Error updating academic activity:', error);
    res.status(500).json({ message: 'Error updating academic activity' });
  }
});

// DELETE academic activity
router.delete('/academic-activities/:date', async (req, res) => {
  try {
    await AcademicActivity.findOneAndDelete({ date: req.params.date });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting academic activity:', error);
    res.status(500).json({ message: 'Error deleting academic activity' });
  }
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);

const API_URL = '/.netlify/functions/api';

const handler = async (event, context) => {
  try {
    // Your existing code here
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, stack: error.stack }),
    };
  }
};

