const mongoose = require('mongoose');
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();

let Activity;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define the Activity model only if it hasn't been defined yet
if (!Activity) {
  const ActivitySchema = new mongoose.Schema({
    date: String,
    name: String,
    description: String
  });

  Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
}

router.get('/activities', async (req, res) => {
  console.log('GET /activities route hit');
  try {
    const activities = await Activity.find();
    console.log('Activities fetched:', activities);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
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
