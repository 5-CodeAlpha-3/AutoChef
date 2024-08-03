const express = require('express');
const router = express.Router();
const Service = require('../models/service');
// const authMiddleware = require('../middleware/middleware'); 

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Update a service.
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, duration } = req.body;

  if (!name || !description || !price || !duration) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, description, price, duration },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Add a new service
router.post('/',async (req, res) => {
  const { name, description, price, duration } = req.body;

  if (!name || !description || !price || !duration) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const newService = new Service({
    name,
    description,
    price,
    duration,
  });

  try {
    const savedService = await newService.save();
    res.status(201).json(savedService);;
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a service
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

module.exports = router;
