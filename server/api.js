const express = require('express');
const router = express.Router();

let activities = [];

router.get('/activities', (req, res) => {
  res.json(activities);
});

router.post('/activities/initialize', (req, res) => {
  activities = req.body;
  res.json({ message: 'Activities initialized' });
});

router.put('/activities/:date', (req, res) => {
  const { date } = req.params;
  const updatedActivity = req.body;
  const index = activities.findIndex(a => a.date === date);
  if (index !== -1) {
    activities[index] = { ...activities[index], ...updatedActivity };
    res.json(activities[index]);
  } else {
    // If the activity doesn't exist, create a new one
    activities.push({ ...updatedActivity, date });
    res.status(201).json(updatedActivity);
  }
});

router.delete('/activities/:date', (req, res) => {
  const { date } = req.params;
  const initialLength = activities.length;
  activities = activities.filter(a => a.date !== date);
  
  if (activities.length < initialLength) {
    res.json({ message: 'Activity deleted successfully' });
  } else {
    res.status(404).json({ message: 'Activity not found' });
  }
});

router.post('/activities', (req, res) => {
  const newActivity = req.body;
  const existingIndex = activities.findIndex(a => a.date === newActivity.date);
  
  if (existingIndex !== -1) {
    // If an activity with this date already exists, update it
    activities[existingIndex] = { ...activities[existingIndex], ...newActivity };
    res.json(activities[existingIndex]);
  } else {
    // Otherwise, add the new activity
    activities.push(newActivity);
    res.status(201).json(newActivity);
  }
});

module.exports = router;
