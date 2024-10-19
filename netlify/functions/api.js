const mongoose = require('mongoose');
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

mongoose.set('strictQuery', false);

console.log('API function loaded');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
  });

// Define the schema outside of the main function
const ActivitySchema = new mongoose.Schema({
  name: String,
  description: String,
  date: { type: String, unique: true }
});

// Use mongoose.models to check if the model already exists
const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://aneesclasses-activitycalendar.netlify.app'
}));

// Create a router
const router = express.Router();

// Define routes on the router
router.get('/activities', async (req, res) => {
  console.log('GET /activities route hit');
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

router.put('/activities/:date', async (req, res) => {
  console.log('PUT /activities/:date route hit');
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);
  try {
    const { name, description } = req.body;
    const updatedActivity = await Activity.findOneAndUpdate(
      { date: req.params.date },
      { name, description },
      { new: true, upsert: true, runValidators: true }
    );
    console.log('Activity updated in database:', updatedActivity);
    res.json(updatedActivity);
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ message: 'Error updating activity', error: error.message });
  }
});

router.delete('/activities/:date', async (req, res) => {
  console.log('DELETE /activities/:date route hit');
  console.log('Request params:', req.params);
  try {
    const deletedActivity = await Activity.findOneAndDelete({ date: req.params.date });
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Error deleting activity', error: error.message });
  }
});

router.post('/activities/initialize', async (req, res) => {
  console.log('POST /activities/initialize route hit');
  try {
    const activities = req.body;
    const result = await Activity.insertMany(activities);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error initializing activities:', error);
    res.status(500).json({ message: 'Error initializing activities', error: error.message });
  }
});

// Add the router to the app
app.use('/.netlify/functions/api', router);

app.post('/activities', async (req, res) => {
  try {
    const { name, description, date } = req.body;
    const newActivity = new Activity({ name, description, date });
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity' });
  }
});

app.delete('/activities/:date', async (req, res) => {
  console.log('Received DELETE request for date:', req.params.date);
  try {
    const deletedActivity = await Activity.findOneAndDelete({ date: req.params.date });
    console.log('Activity deleted from database:', deletedActivity);
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    console.log('Activity deleted');
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Error deleting activity', error: error.message });
  }
});

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Catch-all route
app.use('*', (req, res) => {
  console.log('Catch-all route hit');
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  res.status(404).json({ message: 'Route not found' });
});

module.exports.handler = serverless(app);
