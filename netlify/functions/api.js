const mongoose = require('mongoose');
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*', // Be more specific in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const router = express.Router();

let Activity;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('MongoDB URI:', process.env.MONGODB_URI);
});

// Define the Activity model only if it hasn't been defined yet
if (!Activity) {
  const ActivitySchema = new mongoose.Schema({
    date: String,
    name: String,
    description: String
  });

  Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
}

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected successfully');
});

router.get('/activities', async (req, res) => {
  console.log('GET /activities route hit');
  try {
    console.log('Attempting to fetch activities from MongoDB');
    const activities = await Activity.find();
    console.log('Activities fetched successfully:', activities);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error fetching activities', error: error.message, stack: error.stack });
  }
});

router.put('/activities/:date', async (req, res) => {
  console.log('PUT /activities/:date route hit');
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

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);

const API_URL = '/.netlify/functions/api';
